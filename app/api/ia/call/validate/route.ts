import { NextResponse } from 'next/server'

/**
 * Valida que la configuración de Vapi esté lista para llamadas.
 * No expone valores sensibles.
 */
export async function GET() {
  const apiKey = process.env.VAPI_PRIVATE_KEY ?? process.env.VAPI_API_KEY
  const assistantId = process.env.VAPI_ASSISTANT_ID
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID

  const checks = {
    VAPI_PRIVATE_KEY_or_VAPI_API_KEY: !!apiKey,
    VAPI_ASSISTANT_ID: !!assistantId,
    VAPI_PHONE_NUMBER_ID: !!phoneNumberId,
  }

  const allOk = Object.values(checks).every(Boolean)

  const vapiKeysFound = Object.keys(process.env).filter((k) => k.startsWith('VAPI_'))

  return NextResponse.json({
    ok: allOk,
    ready: allOk,
    checks,
    envKeysPresent: vapiKeysFound,
    message: allOk
      ? 'Configuración de Vapi lista para llamadas'
      : 'Faltan variables. Revisa .env.local: VAPI_PRIVATE_KEY (o VAPI_API_KEY), VAPI_ASSISTANT_ID, VAPI_PHONE_NUMBER_ID',
  })
}
