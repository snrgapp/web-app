import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'
import { inviteCafeSchema } from '@/lib/members/schemas'

export async function POST(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const body = await request.json()
    const parsed = inviteCafeSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'ID de miembro inválido' }, { status: 400 })
    }

    const { connectedMemberId } = parsed.data
    if (connectedMemberId === member.id) {
      return Response.json({ error: 'No puedes invitarte a ti mismo' }, { status: 400 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const { error } = await supabase.from('connections').upsert(
      {
        member_id: member.id,
        connected_member_id: connectedMemberId,
        tipo: 'cafe_invitado',
      },
      { onConflict: 'member_id,connected_member_id' }
    )

    if (error) {
      return Response.json({ error: 'Error al enviar invitación' }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
