import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const member = await requireMember(request)
    const eventId = params.id

    if (!eventId) {
      return Response.json({ error: 'Evento no especificado' }, { status: 400 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const { error } = await supabase.from('event_attendance').upsert(
      {
        event_id: eventId,
        member_id: member.id,
      },
      { onConflict: 'event_id,member_id' }
    )

    if (error) {
      return Response.json({ error: 'Error al registrar' }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
