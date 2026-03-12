import { NextRequest } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { setMemberSession } from '@/lib/members/session'
import { verifyPassword } from '@/lib/members/password'
import { loginSchema } from '@/lib/members/schemas'
import { checkLoginRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Teléfono o contraseña inválido' }, { status: 400 })
    }

    const { phone, password } = parsed.data
    const normalizedPhone = phone.replace(/\D/g, '').trim()
    if (normalizedPhone.length < 8) {
      return Response.json({ error: 'Teléfono inválido' }, { status: 400 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown'
    if (await checkLoginRateLimit(ip)) {
      return Response.json({ error: 'Demasiados intentos. Intenta más tarde.' }, { status: 429 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Usuario no registrado' }, { status: 401 })
    }

    const countryCode = process.env.DEFAULT_SMS_COUNTRY_CODE || '57'
    const withPrefix = `+${countryCode}${normalizedPhone}`
    const { data: existing, error: fetchError } = await supabase
      .from('members')
      .select('id, password_hash')
      .in('phone', [normalizedPhone, withPrefix])
      .maybeSingle()

    if (fetchError || !existing) {
      return Response.json({ error: 'Teléfono o contraseña incorrectos' }, { status: 401 })
    }

    const valid = await verifyPassword(password, existing.password_hash)
    if (!valid) {
      return Response.json({ error: 'Teléfono o contraseña incorrectos' }, { status: 401 })
    }

    const memberId = existing.id
    const token = await setMemberSession(memberId, normalizedPhone)
    if (!token) {
      return Response.json({ error: 'Usuario no registrado' }, { status: 401 })
    }

    const url = new URL(request.url)
    const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? url.host).replace(/:.*$/, '')
    const from = url.searchParams.get('from') || ''
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
