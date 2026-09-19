/**
 * Envío transaccional y de alertas por Bird Email API.
 * Dominio verificado: snrg.lat
 *
 * Env:
 *   BIRD_API_KEY          clave bk_us1_... / bk_eu1_...
 *   BIRD_API_URL          opcional, default según el prefijo de la clave
 *   BIRD_SENDER_EMAIL     default hola@snrg.lat
 *   BIRD_SENDER_NAME      default Synergy
 */

function apiHost(apiKey: string) {
  if (process.env.BIRD_API_URL) return process.env.BIRD_API_URL.replace(/\/+$/, '')
  if (apiKey.startsWith('bk_eu1_') || apiKey.startsWith('bkeu1')) {
    return 'https://eu1.platform.bird.com'
  }
  return 'https://us1.platform.bird.com'
}

export async function sendBirdEmail(input: {
  to: { email: string; name?: string }[]
  subject: string
  html: string
  text?: string
  category?: 'transactional' | 'marketing'
  tags?: Record<string, string>
  headers?: Record<string, string>
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const apiKey = process.env.BIRD_API_KEY ?? null
  if (!apiKey) {
    return { success: false, error: 'BIRD_API_KEY no configurada' }
  }

  const senderEmail = process.env.BIRD_SENDER_EMAIL || 'hola@snrg.lat'
  const senderName = process.env.BIRD_SENDER_NAME || 'Synergy'

  try {
    const response = await fetch(`${apiHost(apiKey)}/v1/email/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        from: { email: senderEmail, name: senderName },
        to: input.to.map((r) => (r.name ? { email: r.email, name: r.name } : r.email)),
        subject: input.subject,
        html: input.html,
        text: input.text,
        category: input.category ?? 'transactional',
        tags: input.tags,
        headers: input.headers,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      return { success: false, error: body.slice(0, 280) }
    }

    const payload = (await response.json()) as { id?: string }
    return { success: true, id: payload.id }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al enviar correo',
    }
  }
}
