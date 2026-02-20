import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'

type NotificationType = 'cafe_invitado' | 'evento_pronto' | 'actualizacion'

export interface NotificationItem {
  id: string
  tipo: NotificationType
  titulo: string
  mensaje: string
  link?: string
  created_at: string
}

export async function GET(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const notifications: NotificationItem[] = []
    const now = new Date()
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    // 1. Invitaciones a café: alguien me invitó (connected_member_id = yo, member_id = quien invita)
    const { data: cafeInvites } = await supabase
      .from('connections')
      .select('id, created_at, member_id')
      .eq('connected_member_id', member.id)
      .eq('tipo', 'cafe_invitado')
      .order('created_at', { ascending: false })
      .limit(5)

    if (cafeInvites?.length) {
      const inviterIds = [...new Set(cafeInvites.map((c) => c.member_id))]
      const { data: inviters } = await supabase
        .from('members')
        .select('id, nombre')
        .in('id', inviterIds)
      const inviterMap = new Map((inviters || []).map((m) => [m.id, m.nombre || 'Un miembro']))
      for (const c of cafeInvites) {
        const nombre = inviterMap.get(c.member_id) || 'Un miembro'
        notifications.push({
          id: `cafe-${c.id}`,
          tipo: 'cafe_invitado',
          titulo: 'Invitación a café',
          mensaje: `${nombre} te invitó a un café`,
          link: '/red-contactos',
          created_at: c.created_at,
        })
      }
    }

    // 2. Eventos próximos (próximos 7 días)
    const { data: events } = await supabase
      .from('member_events')
      .select('id, titulo, fecha_inicio')
      .gte('fecha_inicio', now.toISOString())
      .lte('fecha_inicio', in7Days.toISOString())
      .order('fecha_inicio', { ascending: true })
      .limit(5)

    if (events?.length) {
      for (const e of events) {
        const fecha = e.fecha_inicio ? new Date(e.fecha_inicio).toLocaleDateString('es-MX', {
          day: 'numeric',
          month: 'short',
        }) : ''
        notifications.push({
          id: `event-${e.id}`,
          tipo: 'evento_pronto',
          titulo: 'Evento próximo',
          mensaje: `${e.titulo} — ${fecha}`,
          link: '/eventos',
          created_at: e.fecha_inicio || new Date().toISOString(),
        })
      }
    }

    // 3. Actualizaciones (placeholder - se puede extender con tabla member_notifications)
    // Por ahora vacío; en el futuro: novedades, anuncios, etc.

    // Ordenar por fecha más reciente
    notifications.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return Response.json({ notifications })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
