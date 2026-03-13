/**
 * Dispara una llamada saliente via Vapi.ai (programada 25 s después).
 * Número en formato E.164 (ej: +573001234567).
 *
 * Endpoints: /call (genérico) o /call/phone (teléfono). Vapi acepta ambos.
 */
export async function scheduleOutboundCall(to: string): Promise<{ ok: boolean; error?: string; details?: unknown }> {
  const apiKey = process.env.VAPI_PRIVATE_KEY ?? process.env.VAPI_API_KEY
  const assistantId = process.env.VAPI_ASSISTANT_ID
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID

  if (!apiKey || !assistantId || !phoneNumberId) {
    return { ok: false, error: 'Vapi no configurado' }
  }

  const useImmediate = process.env.VAPI_IMMEDIATE_CALL === 'true'
  const earliestAt = new Date(Date.now() + 25 * 1000)
  const latestAt = new Date(earliestAt.getTime() + 2 * 60 * 1000)

  const payload: Record<string, unknown> = {
    assistantId,
    phoneNumberId,
    customer: { number: to },
  }
  if (!useImmediate) {
    payload.schedulePlan = {
      earliestAt: earliestAt.toISOString(),
      latestAt: latestAt.toISOString(),
    }
  }

  try {
    const res = await fetch('https://api.vapi.ai/call/phone', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('Vapi call error:', res.status, JSON.stringify(data))
      return {
        ok: false,
        error: (data as { message?: string }).message || `Vapi ${res.status}`,
        details: data,
      }
    }
    return { ok: true }
  } catch (e) {
    console.error('Vapi scheduleOutboundCall:', e)
    return { ok: false, error: 'Error de conexión con Vapi', details: String(e) }
  }
}
