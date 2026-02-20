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

const DEV_PHONE = 'dev'

/** Obtiene o crea el miembro "dev" para desarrollo local (solo NODE_ENV=development) */
async function getOrCreateDevMember(): Promise<Member | null> {
  if (process.env.NODE_ENV !== 'development') return null
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data: existing } = await supabase
    .from('members')
    .select('id, phone, nombre, email, empresa, avatar_url, referido_por_id, created_at, updated_at')
    .eq('phone', DEV_PHONE)
    .maybeSingle()

  if (existing) return existing as Member

  const { data: created, error } = await supabase
    .from('members')
    .insert({ phone: DEV_PHONE, nombre: 'Dev (local)' })
    .select('id, phone, nombre, email, empresa, avatar_url, referido_por_id, created_at, updated_at')
    .single()

  if (error) return null
  return created as Member
}

/** Obtiene el miembro actual desde la cookie de sesión en la request */
export async function getMemberFromRequest(request: NextRequest): Promise<Member | null> {
  const cookieHeader = request.cookies.get('member_session')?.value
  if (cookieHeader) {
    const payload = parseSessionToken(cookieHeader)
    if (payload) {
      const supabase = createAdminClient()
      if (supabase) {
        const { data, error } = await supabase
          .from('members')
          .select('id, phone, nombre, email, empresa, avatar_url, referido_por_id, created_at, updated_at')
          .eq('id', payload.memberId)
          .eq('phone', payload.phone)
          .maybeSingle()
        if (!error && data) return data as Member
      }
    }
  }

  // En desarrollo local sin sesión: usar miembro dev para poder ver el dashboard
  if (process.env.NODE_ENV === 'development') {
    return getOrCreateDevMember()
  }
  return null
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
