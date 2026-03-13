import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

/**
 * Post-call webhook ElevenLabs → guarda perfil en ia_call_profiles.
 * URL: https://tu-dominio.com/api/webhooks/elevenlabs
 *
 * Seguridad: ELEVENLABS_WEBHOOK_SECRET + cabecera elevenlabs-signature (HMAC-SHA256).
 * El cuerpo debe leerse en bruto antes de JSON.parse para que la firma coincida.
 */

const WEBHOOK_TOLERANCE_MS = 30 * 60 * 1000

function verifyElevenLabsSignature(
  rawBody: string,
  sigHeader: string | null,
  secret: string
): { ok: true } | { ok: false; reason: string } {
  if (!sigHeader?.trim()) {
    return { ok: false, reason: 'Falta cabecera elevenlabs-signature' }
  }
  const parts = sigHeader.split(',').map((p) => p.trim())
  let t = ''
  let v0 = ''
  for (const p of parts) {
    if (p.startsWith('t=')) t = p.slice(2)
    if (p.startsWith('v0=')) v0 = p.slice(3)
  }
  if (!t || !v0) {
    return { ok: false, reason: 'Cabecera de firma inválida (se espera t=... y v0=...)' }
  }
  const ts = Number(t) * 1000
  if (Number.isNaN(ts) || Math.abs(Date.now() - ts) > WEBHOOK_TOLERANCE_MS) {
    return { ok: false, reason: 'Timestamp fuera de ventana (replay)' }
  }
  const payload = `${t}.${rawBody}`
  const expected = createHmac('sha256', secret).update(payload).digest('hex')
  try {
    const a = Buffer.from(expected, 'hex')
    const b = Buffer.from(v0, 'hex')
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, reason: 'Firma no válida' }
    }
  } catch {
    return { ok: false, reason: 'Firma no válida' }
  }
  return { ok: true }
}
function pickLeadId(payload: Record<string, unknown>): string | null {
  const data = (payload.data ?? payload) as Record<string, unknown>
  const dyn = (data.dynamic_variables ??
    data.conversation_initiation_client_data ??
    {}) as Record<string, unknown>
  if (typeof dyn.lead_id === 'string' && dyn.lead_id) return dyn.lead_id
  const analysis = (data.analysis ?? payload.analysis) as Record<string, unknown> | undefined
  const structured = (analysis?.structured_data ??
    analysis?.structuredData) as Record<string, unknown> | undefined
  if (structured && typeof structured.lead_id === 'string') return structured.lead_id
  return null
}

function pickConversationId(payload: Record<string, unknown>): string | null {
  const data = (payload.data ?? payload) as Record<string, unknown>
  const id =
    data.conversation_id ??
    data.conversationId ??
    payload.conversation_id ??
    payload.conversationId
  return typeof id === 'string' && id ? id : null
}

function pickStructured(payload: Record<string, unknown>): Record<string, unknown> {
  const data = (payload.data ?? payload) as Record<string, unknown>
  const analysis = (data.analysis ?? payload.analysis) as Record<string, unknown> | undefined
  return (analysis?.structured_data ??
    analysis?.structuredData ??
    data.collection ??
    {}) as Record<string, unknown>
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const secret = process.env.ELEVENLABS_WEBHOOK_SECRET?.trim()

    if (secret) {
      const sig = req.headers.get('elevenlabs-signature')
      const v = verifyElevenLabsSignature(rawBody, sig, secret)
      if (!v.ok) {
        console.warn('ElevenLabs webhook firma:', v.reason)
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    let payload: Record<string, unknown>
    try {
      payload = JSON.parse(rawBody) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
    }

    const leadId = pickLeadId(payload)
    const conversationId = pickConversationId(payload)

    if (!leadId || !conversationId) {
      console.warn(
        'ElevenLabs webhook: falta lead_id o conversation_id, ignorando',
        JSON.stringify({ leadId: !!leadId, conversationId: !!conversationId })
      )
      return NextResponse.json({ ok: true })
    }

    const s = pickStructured(payload)
    const supabase = createAdminClient()
    if (!supabase) {
      console.error('ElevenLabs webhook: Supabase no configurado')
      return NextResponse.json({ error: 'Config error' }, { status: 503 })
    }

    const data = (payload.data ?? payload) as Record<string, unknown>

    const { error } = await supabase.from('ia_call_profiles').upsert(
      {
        lead_id: leadId,
        vapi_call_id: conversationId,

        ciudad_principal: (s.ciudad_principal as string) ?? null,
        nombre_negocio: (s.nombre_negocio as string) ?? null,
        descripcion_negocio: (s.descripcion_negocio as string) ?? null,
        tipo_negocio: (s.tipo_negocio as string) ?? null,
        momento_negocio: (s.momento_negocio as string) ?? null,
        antiguedad_negocio: (s.antiguedad_negocio as string) ?? null,
        cliente_objetivo: (s.cliente_objetivo as string) ?? null,
        busca_primario: (s.busca_primario as string) ?? null,
        busca_detalle: (s.busca_detalle as string) ?? null,
        busca_secundario: (s.busca_secundario as string) ?? null,
        ofrece: (s.ofrece as string) ?? null,
        logro_notable: (s.logro_notable as string) ?? null,
        preferencia_conexion: (s.preferencia_conexion as string) ?? null,
        referido_por: (s.referido_por as string) ?? null,
        notas_personalidad: (s.notas_personalidad as string) ?? null,
        score_urgencia: (s.score_urgencia as string) ?? null,
        perfil_completo: (s.perfil_completo as boolean) ?? null,
        follow_up_pendiente: (s.follow_up_pendiente as boolean) ?? null,

        ended_reason: (data.call_successful != null
          ? String(data.call_successful)
          : null) as string | null,
        started_at: (data.start_time as string) ?? (data.metadata as Record<string, unknown>)?.start_time as string ?? null,
        ended_at: (data.end_time as string) ?? null,
        cost: null,
      },
      { onConflict: 'vapi_call_id' }
    )

    if (error) {
      console.error('ElevenLabs webhook ia_call_profiles upsert:', error)
      return NextResponse.json({ error: 'Upsert failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('ElevenLabs webhook error:', e)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
