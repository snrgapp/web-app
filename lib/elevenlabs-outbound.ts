/**
 * Llamadas salientes vía ElevenLabs Conversational AI + Twilio.
 * @see https://elevenlabs.io/docs/api-reference/twilio/outbound-call
 *
 * Variables de entorno:
 * - ELEVENLABS_API_KEY (xi-api-key)
 * - ELEVENLABS_AGENT_ID
 * - ELEVENLABS_AGENT_PHONE_NUMBER_ID (número importado en ElevenLabs)
 */

type OutboundOptions = {
  to: string
  customerName?: string
  /** UUID ia_form_submissions → dynamic_variables.lead_id para el agente/webhook */
  leadId?: string
}

export async function scheduleOutboundCall(
  toOrOptions: string | OutboundOptions
): Promise<{ ok: boolean; error?: string; details?: unknown; conversationId?: string }> {
  const to = typeof toOrOptions === 'string' ? toOrOptions : toOrOptions.to
  const customerName = typeof toOrOptions === 'string' ? undefined : toOrOptions.customerName
  const leadId = typeof toOrOptions === 'string' ? undefined : toOrOptions.leadId

  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID
  const agentPhoneNumberId = process.env.ELEVENLABS_AGENT_PHONE_NUMBER_ID

  if (!apiKey || !agentId || !agentPhoneNumberId) {
    return { ok: false, error: 'ElevenLabs no configurado (ELEVENLABS_API_KEY, ELEVENLABS_AGENT_ID, ELEVENLABS_AGENT_PHONE_NUMBER_ID)' }
  }

  const dynamicVariables: Record<string, string | number | boolean> = {}
  if (leadId) dynamicVariables.lead_id = leadId
  if (customerName?.trim()) {
    const full = customerName.trim()
    const first = full.split(/\s+/)[0] ?? full
    dynamicVariables.first_name = first
    dynamicVariables.customerName = first
    /** Nombre completo del formulario (saludo personalizado en el agente) */
    dynamicVariables.full_name = full
  }

  const body: Record<string, unknown> = {
    agent_id: agentId,
    agent_phone_number_id: agentPhoneNumberId,
    to_number: to,
  }
  if (Object.keys(dynamicVariables).length > 0) {
    body.conversation_initiation_client_data = { dynamic_variables: dynamicVariables }
  }

  try {
    const res = await fetch('https://api.elevenlabs.io/v1/convai/twilio/outbound-call', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean
      message?: string
      conversation_id?: string
      detail?: unknown
    }

    if (!res.ok || data.success === false) {
      const msg =
        typeof data.message === 'string'
          ? data.message
          : res.statusText || `ElevenLabs ${res.status}`
      console.error('ElevenLabs outbound-call error:', res.status, JSON.stringify(data))
      return { ok: false, error: msg, details: data.detail ?? data }
    }

    return { ok: true, conversationId: data.conversation_id }
  } catch (e) {
    console.error('ElevenLabs scheduleOutboundCall:', e)
    return { ok: false, error: 'Error de conexión con ElevenLabs', details: String(e) }
  }
}
