/**
 * Envío de SMS vía Brevo (transactional SMS).
 * Requiere: BREVO_API_KEY
 * Opcional: BREVO_SMS_SENDER (default: Synergy), DEFAULT_SMS_COUNTRY_CODE (ej. 57)
 *
 * NOTA: Brevo usa la MISMA API key que email (xkeysib-...). No uses credenciales SMTP.
 * Para SMS debes comprar créditos en: Cuenta > Mi Plan > SMS & WhatsApp.
 */

const BREVO_SMS_URL = 'https://api.brevo.com/v3/transactionalSMS/send'

/** Normaliza el número para Brevo: solo dígitos con código de país, sin + */
function formatRecipient(phone: string, defaultCountryCode: string): string {
  const digits = phone.replace(/\D/g, '').trim()
  if (!digits.length) return ''
  // Si ya comienza con el código de país, no duplicar
  if (digits.startsWith(defaultCountryCode) && digits.length > defaultCountryCode.length) {
    return digits
  }
  return `${defaultCountryCode}${digits}`
}

export async function sendSms(to: string, content: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY
  const sender = (process.env.BREVO_SMS_SENDER || 'Synergy').slice(0, 11)
  const countryCode = process.env.DEFAULT_SMS_COUNTRY_CODE || '57'

  if (!apiKey) {
    return { ok: false, error: 'BREVO_API_KEY no configurada' }
  }

  const recipient = formatRecipient(to, countryCode)
  if (!recipient || recipient.length < 10) {
    return { ok: false, error: 'Número de teléfono inválido' }
  }

  try {
    const res = await fetch(BREVO_SMS_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender,
        recipient,
        content,
        type: 'transactional',
      }),
    })

    const body = await res.json().catch(() => ({}))
    if (!res.ok) {
      // Brevo devuelve message o code en errores; 402 = sin créditos SMS
      const msg = typeof body?.message === 'string' ? body.message : body?.code ?? `HTTP ${res.status}`
      console.error('[Brevo SMS] Error:', res.status, body)
      return {
        ok: false,
        error: res.status === 402
          ? 'Sin créditos SMS. Compra en Brevo: Mi Plan > SMS & WhatsApp.'
          : msg,
      }
    }
    return { ok: true }
  } catch (e) {
    console.error('[Brevo SMS] Exception:', e)
    return { ok: false, error: 'Error de conexión con Brevo' }
  }
}
