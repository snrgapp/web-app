import { NextResponse } from 'next/server'
import { scheduleOutboundCall } from '@/lib/elevenlabs-outbound'

/**
 * Inicia una llamada saliente vía ElevenLabs (ConvAI + Twilio).
 * Número en E.164 (ej: +573001234567).
 *
 * .env.local:
 * - ELEVENLABS_API_KEY
 * - ELEVENLABS_AGENT_ID
 * - ELEVENLABS_AGENT_PHONE_NUMBER_ID
 */
export async function POST(req: Request) {
  try {
    const { to: toParam, number, name, leadId } = (await req.json()) as {
      to?: string
      number?: string
      name?: string
      leadId?: string
    }
    const to = toParam ?? number
    const customerName = typeof name === 'string' ? name.trim() : undefined

    if (!to || typeof to !== 'string') {
      return NextResponse.json(
        { error: 'Se requiere el número de teléfono (to)' },
        { status: 400 }
      )
    }

    const result = await scheduleOutboundCall({
      to,
      customerName,
      leadId: typeof leadId === 'string' ? leadId : undefined,
    })

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status: 503 }
      )
    }

    return NextResponse.json({
      success: true,
      conversation_id: result.conversationId,
    })
  } catch (e) {
    console.error('ElevenLabs call error:', e)
    return NextResponse.json(
      { error: 'Error al iniciar la llamada' },
      { status: 500 }
    )
  }
}
