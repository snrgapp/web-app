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

    const { data: connections } = await supabase
      .from('connections')
      .select('connected_member_id')
      .eq('member_id', member.id)

    const alreadyConnected = new Set((connections || []).map((c) => c.connected_member_id))
    alreadyConnected.add(member.id)

    const { data: allMembers } = await supabase
      .from('members')
      .select('id, nombre, empresa, email, phone')
      .neq('id', member.id)
      .limit(50)

    const recommendations = (allMembers || [])
      .filter((m) => !alreadyConnected.has(m.id))
      .slice(0, 20)
      .map((m) => ({
        id: m.id,
        nombre: m.nombre || 'Sin nombre',
        empresa: m.empresa || '',
        email: m.email || '',
        phone: m.phone || '',
      }))

    return Response.json({ recommendations })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
