import type { SupabaseClient, User } from '@supabase/supabase-js'
import { createServerClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { getDefaultOrgId } from '@/lib/org-resolver'

export type VistaPanel = 'admin' | 'cohost'

export type StaffFila = {
  id: string
  evento_id: string
  organizacion_id: string
  email: string
  nombre: string | null
  rol: string
  user_id: string | null
}

export type ContextoPanel = {
  db: SupabaseClient
  orgId: string
  user: User
  vista: VistaPanel
  eventosPermitidos: string[] | null
  staff: StaffFila[]
}

export async function contextoPanel(): Promise<ContextoPanel | null> {
  const supabase = await createServerClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null

  const admin = createAdminClient()
  const email = String(data.user.email || '').trim().toLowerCase()
  let staff: StaffFila[] = []
  if (admin && email) {
    const { data: rows } = await admin
      .from('evento_staff')
      .select('id, evento_id, organizacion_id, email, nombre, rol, user_id')
      .eq('email', email)
    staff = (rows ?? []) as StaffFila[]
    if (data.user.id) {
      const sinUser = staff.filter((s) => !s.user_id)
      if (sinUser.length) {
        await admin.from('evento_staff').update({ user_id: data.user.id }).eq('email', email).is('user_id', null)
        staff = staff.map((s) => ({ ...s, user_id: s.user_id || data.user.id }))
      }
    }
  }

  const orgIdDefault = await getDefaultOrgId()
  let esAdmin = false
  if (admin && orgIdDefault) {
    const { data: mem } = await admin
      .from('organizacion_miembros')
      .select('rol')
      .eq('organizacion_id', orgIdDefault)
      .eq('user_id', data.user.id)
      .maybeSingle()
    esAdmin = mem?.rol === 'admin'
  }

  if (esAdmin && orgIdDefault) {
    return {
      db: supabase as unknown as SupabaseClient,
      orgId: orgIdDefault,
      user: data.user,
      vista: 'admin',
      eventosPermitidos: null,
      staff,
    }
  }

  const host = staff.filter((s) => s.rol === 'cohost' || s.rol === 'puerta')
  if (host.length && admin) {
    return {
      db: admin as unknown as SupabaseClient,
      orgId: host[0].organizacion_id,
      user: data.user,
      vista: 'cohost',
      eventosPermitidos: host.map((s) => s.evento_id),
      staff: host,
    }
  }

  return null
}

export function eventoPermitido(ctx: ContextoPanel, eventoId: unknown) {
  if (ctx.vista === 'admin') return true
  return typeof eventoId === 'string' && !!eventoId && (ctx.eventosPermitidos || []).includes(eventoId)
}
