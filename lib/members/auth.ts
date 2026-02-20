import { NextRequest } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { parseSessionToken } from './session'

export interface Member {
  id: string
  phone: string
  nombre: string | null
  email: string | null
  empresa: string | null
  avatar_url: string | null
  referido_por_id: string | null
  created_at: string
  updated_at: string
}

/** Obtiene el miembro actual desde la cookie de sesión en la request */
export async function getMemberFromRequest(request: NextRequest): Promise<Member | null> {
  const cookieHeader = request.cookies.get('member_session')?.value
  if (!cookieHeader) return null

  const payload = parseSessionToken(cookieHeader)
  if (!payload) return null

  const supabase = createAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('members')
    .select('id, phone, nombre, email, empresa, avatar_url, referido_por_id, created_at, updated_at')
    .eq('id', payload.memberId)
    .eq('phone', payload.phone)
    .maybeSingle()

  if (error || !data) return null
  return data as Member
}

/** Verifica sesión y devuelve miembro o lanza 401 */
export async function requireMember(request: NextRequest): Promise<Member> {
  const member = await getMemberFromRequest(request)
  if (!member) {
    throw new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }
  return member
}
