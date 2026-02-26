import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'

/** PATCH: actualizar perfil del miembro (ciudad) */
export async function PATCH(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const body = await request.json()
    const ciudad = typeof body.ciudad === 'string' ? body.ciudad.trim() || null : null

    const { error } = await supabase
      .from('members')
      .update({
        ciudad: ciudad ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', member.id)

    if (error) {
      return Response.json({ error: 'No se pudo actualizar' }, { status: 500 })
    }

    return Response.json({ ok: true, ciudad })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
