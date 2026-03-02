import { NextRequest } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { checkLoginRateLimit } from '@/lib/rate-limit'
import { generateOtp, setOtp } from '@/lib/members/otp'

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/transactionalSMS/sms'

async function sendOtpViaBrevo(recipient: string, code: string) {
  const msg = `Código de verificación de synergy: ${code}`
  const headers = {
    accept: 'application/json',
    'content-type': 'application/json',
    'api-key': process.env.BREVO ?? '',
  }

  const body = {
    type: 'transactional',
    unicodeEnabled: true,
    sender: 'synergy',
    recipient,
    content: msg,
    tag: 't1',
    organisationPrefix: 'synergy',
  }

  const res = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    return { code: res.status, message: 'Hubo un lío al enviar el código de ingreso', data }
  }
  return { code: 200, message: 'Código de ingreso enviado', data }
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? 'unknown'
    if (await checkLoginRateLimit(ip)) {
      return Response.json({ error: 'Demasiados intentos. Intenta más tarde.' }, { status: 429 })
    }

    const body = await request.json()
    const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
    const normalizedPhone = phone.replace(/\D/g, '').trim()

    if (normalizedPhone.length < 8) {
      return Response.json({ error: 'Teléfono inválido' }, { status: 400 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const countryCode = process.env.DEFAULT_SMS_COUNTRY_CODE || '57'
    const withPrefix = `+${countryCode}${normalizedPhone}`
    const { data: existing } = await supabase
      .from('members')
      .select('id')
      .in('phone', [normalizedPhone, withPrefix])
      .maybeSingle()

    if (!existing) {
      return Response.json({ error: 'Usuario no registrado' }, { status: 401 })
    }

    const code = generateOtp()
    const stored = await setOtp(normalizedPhone, code)
    if (!stored.ok) {
      const isDev = process.env.NODE_ENV === 'development'
      return Response.json({
        error: isDev && stored.error
          ? stored.error
          : 'No se pudo generar el código. Intenta más tarde.',
      }, { status: 503 })
    }

    const recipient = `${countryCode}${normalizedPhone}`
    const result = await sendOtpViaBrevo(recipient, code)

    if (result.code !== 200) {
      return Response.json({
        error: result.message,
      }, { status: 500 })
    }

    return Response.json({ ok: true, message: result.message })
  } catch (e) {
    console.error('Send code error:', e)
    return Response.json({ error: 'Error al enviar código' }, { status: 500 })
  }
}
