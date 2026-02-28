/**
 * Envío de SMS vía Brevo (transactional SMS).
 * Requiere: BREVO_API_KEY, BREVO_SMS_SENDER
 * Opcional: DEFAULT_SMS_COUNTRY_CODE (ej. 57 para Colombia)
 */

const BREVO_SMS_URL = 'https://api.brevo.com/v3/transactionalSMS/send'

export async function sendSms(to: string, content: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY
  const sender = process.env.BREVO_SMS_SENDER || 'Synergy'

  if (!apiKey) {
    return { ok: false, error: 'BREVO_API_KEY no configurada' }
  }

  // Formatear número: si no tiene +, añadir código de país por defecto
  let recipient = to.replace(/\D/g, '').trim()
  if (!recipient.startsWith('+')) {
    const countryCode = process.env.DEFAULT_SMS_COUNTRY_CODE || '57'
    recipient = `${countryCode}${recipient}`
  } else {
    recipient = recipient.replace(/^\+/, '')
  }

  try {
    const res = await fetch(BREVO_SMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: sender.slice(0, 11),
        recipient,
        content,
        type: 'transactional',
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.message || `Brevo error ${res.status}` }
    }
    return { ok: true }
  } catch (e) {
    console.error('Brevo SMS error:', e)
    return { ok: false, error: 'Error al enviar SMS' }
  }
}
