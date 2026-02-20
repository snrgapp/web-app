import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    await requireMember(request)
    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const { data: events } = await supabase
      .from('member_events')
      .select('id, titulo, descripcion, fecha_inicio, fecha_fin, lugar, image_url')
      .order('fecha_inicio', { ascending: true })

    return Response.json({ events: events || [] })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
