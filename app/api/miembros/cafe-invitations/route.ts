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

    const { data: rows, error } = await supabase
      .from('connections')
      .select('id, member_id, connected_member_id, tipo, created_at')
      .in('tipo', ['cafe_invitado', 'cafe_aceptado'])
      .or(`member_id.eq.${member.id},connected_member_id.eq.${member.id}`)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      return Response.json({ error: 'Error al cargar invitaciones' }, { status: 500 })
    }

    const otherIds = [
      ...new Set(
        (rows || []).map((r) =>
          r.member_id === member.id ? r.connected_member_id : r.member_id
        )
      ),
    ]

    const { data: others } = otherIds.length
      ? await supabase
          .from('members')
          .select('id, nombre, empresa')
          .in('id', otherIds)
      : { data: [] as Array<{ id: string; nombre: string | null; empresa: string | null }> }

    const othersMap = new Map((others || []).map((m) => [m.id, m]))

    const invitations = (rows || []).map((r) => {
      const otherId = r.member_id === member.id ? r.connected_member_id : r.member_id
      const other = othersMap.get(otherId)
      return {
        id: r.id,
        tipo: r.tipo,
        created_at: r.created_at,
        direccion: r.member_id === member.id ? 'enviada' : 'recibida',
        nombre: other?.nombre || 'Sin nombre',
        empresa: other?.empresa || '',
      }
    })

    return Response.json({ invitations })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
