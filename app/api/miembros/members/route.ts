import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('members')
      .select('id, nombre, email, empresa, phone')
      .neq('id', member.id)
      .order('created_at', { ascending: false })
      .limit(200)

    if (error) {
      return Response.json({ error: 'Error al cargar miembros' }, { status: 500 })
    }

    const members = (data || []).map((m) => ({
      id: m.id,
      nombre: m.nombre || 'Sin nombre',
      email: m.email || '',
      empresa: m.empresa || '',
      phone: m.phone || '',
    }))

    return Response.json({ members })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
