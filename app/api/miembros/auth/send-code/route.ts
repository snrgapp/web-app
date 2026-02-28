import { NextRequest } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { checkLoginRateLimit } from '@/lib/rate-limit'
import { generateOtp, setOtp } from '@/lib/members/otp'
import { sendSms } from '@/lib/brevo-sms'

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
    if (!stored) {
      return Response.json({ error: 'No se pudo generar el código. Intenta más tarde.' }, { status: 503 })
    }

    const content = `Tu código de acceso a Synergy es: ${code}. Válido por 5 minutos.`
    const smsResult = await sendSms(normalizedPhone, content)

    if (!smsResult.ok) {
      return Response.json({ error: smsResult.error || 'Error al enviar SMS' }, { status: 500 })
    }

    return Response.json({ ok: true, message: 'Código enviado' })
  } catch (e) {
    console.error('Send code error:', e)
    return Response.json({ error: 'Error al enviar código' }, { status: 500 })
  }
}
