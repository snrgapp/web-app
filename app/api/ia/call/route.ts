import { NextResponse } from 'next/server'

/**
 * Inicia una llamada saliente via Vapi.ai.
 * El número debe estar en formato E.164 (ej: +54911..., +521..., +1...).
 *
 * Requiere en .env.local:
 * - VAPI_PRIVATE_KEY
 * - VAPI_ASSISTANT_ID
 * - VAPI_PHONE_NUMBER_ID (cuando Twilio asigne el número)
 */
export async function POST(req: Request) {
  try {
    const { to } = await req.json()

    if (!to || typeof to !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere el número de teléfono (to)' },
        { status: 400 }
      )
    }

    const apiKey = process.env.VAPI_PRIVATE_KEY ?? process.env.VAPI_API_KEY
    const assistantId = process.env.VAPI_ASSISTANT_ID
    const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID

    if (!apiKey || !assistantId) {
      return NextResponse.json(
        { error: 'Configuración de Vapi incompleta (VAPI_PRIVATE_KEY, VAPI_ASSISTANT_ID)' },
        { status: 503 }
      )
    }

    if (!phoneNumberId) {
      return NextResponse.json(
        { error: 'Número de teléfono no configurado (VAPI_PHONE_NUMBER_ID). Pendiente de Twilio.' },
        { status: 503 }
      )
    }

    const body: Record<string, unknown> = {
      assistantId,
      phoneNumberId,
      customer: { number: to },
      schedulePlan: {
        earliestAt: new Date(Date.now() + 50 * 1000).toISOString(),
      },
    }

    const vapiRes = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await vapiRes.json().catch(() => ({}))
    return NextResponse.json(data, { status: vapiRes.status })
  } catch (e) {
    console.error('Vapi call error:', e)
    return NextResponse.json(
      { error: 'Error al iniciar la llamada' },
      { status: 500 }
    )
  }
}
