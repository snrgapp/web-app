import { NextResponse } from 'next/server'

/**
 * Valida configuración ElevenLabs para llamadas salientes.
 */
export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID
  const phoneId = process.env.ELEVENLABS_AGENT_PHONE_NUMBER_ID

  const checks = {
    ELEVENLABS_API_KEY: !!apiKey,
    ELEVENLABS_AGENT_ID: !!agentId,
    ELEVENLABS_AGENT_PHONE_NUMBER_ID: !!phoneId,
  }

  const allOk = Object.values(checks).every(Boolean)
  const envKeys = Object.keys(process.env).filter(
    (k) => k.startsWith('ELEVENLABS_')
  )

  return NextResponse.json({
    ok: allOk,
    ready: allOk,
    checks,
    envKeysPresent: envKeys,
    message: allOk
      ? 'ElevenLabs listo para llamadas salientes'
      : 'Faltan variables: ELEVENLABS_API_KEY, ELEVENLABS_AGENT_ID, ELEVENLABS_AGENT_PHONE_NUMBER_ID',
  })
}
