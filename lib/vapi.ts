/**
 * Dispara una llamada saliente via Vapi.ai (programada 50 s después).
 * Número en formato E.164 (ej: +573001234567).
 */
export async function scheduleOutboundCall(to: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.VAPI_PRIVATE_KEY ?? process.env.VAPI_API_KEY
  const assistantId = process.env.VAPI_ASSISTANT_ID
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID

  if (!apiKey || !assistantId || !phoneNumberId) {
    return { ok: false, error: 'Vapi no configurado' }
  }

  try {
    const res = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId,
        phoneNumberId,
        customer: { number: to },
        schedulePlan: {
          earliestAt: new Date(Date.now() + 50 * 1000).toISOString(),
        },
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error('Vapi call error:', res.status, err)
      return { ok: false, error: 'Error al programar llamada' }
    }
    return { ok: true }
  } catch (e) {
    console.error('Vapi scheduleOutboundCall:', e)
    return { ok: false, error: 'Error de conexión con Vapi' }
  }
}
