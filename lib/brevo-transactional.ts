const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

function getApiKey() {
  return process.env.BREVO_API_KEY ?? null
}

export async function sendTransactionalEmail(input: {
  to: { email: string; name?: string }[]
  subject: string
  html: string
  text?: string
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = getApiKey()
  if (!apiKey) {
    return { success: false, error: 'BREVO_API_KEY no configurada' }
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'hola@snrg.lat'
  const senderName = process.env.BREVO_SENDER_NAME || 'Synergy'

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: input.to,
        subject: input.subject,
        htmlContent: input.html,
        textContent: input.text,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      return { success: false, error: body.slice(0, 280) }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al enviar correo',
    }
  }
}
