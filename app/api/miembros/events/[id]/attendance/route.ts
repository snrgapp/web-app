import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(
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

    const { data } = await supabase
      .from('event_attendance')
      .select('id')
      .eq('event_id', eventId)
      .eq('member_id', member.id)
      .maybeSingle()

    return Response.json({ registered: !!data })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
