import { NextRequest } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { setMemberSession } from '@/lib/members/session'
import { loginSchema } from '@/lib/members/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Teléfono inválido' }, { status: 400 })
    }

    const { phone } = parsed.data
    const normalizedPhone = phone.replace(/\D/g, '').trim()
    if (normalizedPhone.length < 8) {
      return Response.json({ error: 'Teléfono inválido' }, { status: 400 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Usuario no registrado' }, { status: 401 })
    }

    const { data: existing } = await supabase
      .from('members')
      .select('id')
      .eq('phone', normalizedPhone)
      .maybeSingle()

    if (!existing) {
      return Response.json({ error: 'Usuario no registrado' }, { status: 401 })
    }
    const memberId = existing.id

    const token = await setMemberSession(memberId, normalizedPhone)
    if (!token) {
      return Response.json({ error: 'Usuario no registrado' }, { status: 401 })
    }

    const url = new URL(request.url)
    const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? url.host).replace(/:.*$/, '')
    const from = url.searchParams.get('from') || ''
    // Si el login fue desde snrg.lat (dominio principal), redirigir al subdominio miembros
    const mainHosts = ['snrg.lat', 'www.snrg.lat']
    const isLocalhost = host === 'localhost' || host.endsWith('.localhost')
    const membersOrigin = process.env.NEXT_PUBLIC_MIEMBROS_URL
      ?? (isLocalhost ? `${url.protocol}//miembros.${host.includes('.') ? host : 'localhost'}${url.port ? `:${url.port}` : ''}` : 'https://miembros.snrg.lat')
    const shouldRedirectToSubdomain = mainHosts.some((h) => host === h) || isLocalhost
    const redirectUrl = shouldRedirectToSubdomain
      ? `${membersOrigin}${from.startsWith('/') ? from : ''}`
      : `${url.protocol}//${url.host}${from.startsWith('/') ? from : '/miembros'}`

    return Response.json({ ok: true, redirect: redirectUrl })
  } catch (e) {
    console.error('Login error:', e)
    return Response.json({ error: 'Usuario no registrado' }, { status: 401 })
  }
}
