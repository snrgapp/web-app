import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'

function resolveOrgSlugFromHost(request: NextRequest): string {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  const bare = host.replace(/:.*/, '')
  const normalized = bare.startsWith('www.') ? bare.slice(4) : bare

  // miembros.snrg.lat o member.snrg.lat -> snrg
  if (normalized.startsWith('miembros.') || normalized.startsWith('member.')) {
    const parts = normalized.split('.')
    return parts[1] || 'snrg'
  }

  return 'snrg'
}

export async function GET(request: NextRequest) {
  try {
    await requireMember(request)
    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const orgSlug = resolveOrgSlugFromHost(request)
    const { data: org } = await supabase
      .from('organizaciones')
      .select('id')
      .eq('slug', orgSlug)
      .limit(1)
      .maybeSingle()

    if (!org?.id) return Response.json({ events: [] })

    const today = new Date().toISOString().slice(0, 10)
    const { data: events } = await supabase
      .from('eventos')
      .select('id, titulo, fecha, ciudad, checkin_slug, link')
      .eq('organizacion_id', org.id)
      .gte('fecha', today)
      .order('fecha', { ascending: true })
      .order('orden', { ascending: true })
      .limit(50)

    return Response.json({ events: events || [] })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
