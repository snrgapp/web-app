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
function asStr(v: unknown): string | null {
  if (typeof v === 'string' && v.trim()) return v.trim()
  if (typeof v === 'number' && !Number.isNaN(v)) return String(v)
  return null
}

function pickLeadId(payload: Record<string, unknown>): string | null {
  const data = (payload.data ?? payload) as Record<string, unknown>
  const dyn = (data.dynamic_variables ??
    (data.conversation_initiation_client_data as Record<string, unknown>)
      ?.dynamic_variables ??
    data.conversation_initiation_client_data ??
    payload.dynamic_variables ??
    {}) as Record<string, unknown>
  const fromDyn = asStr(dyn.lead_id)
  if (fromDyn) return fromDyn
  const analysis = (data.analysis ?? payload.analysis) as Record<string, unknown> | undefined
  const structured = (analysis?.structured_data ??
    analysis?.structuredData ??
    analysis?.data_collection_results) as Record<string, unknown> | undefined
  if (structured) {
    const id = asStr(structured.lead_id)
    if (id) return id
  }
  return asStr(payload.lead_id)
}

function pickConversationId(payload: Record<string, unknown>): string | null {
  const data = (payload.data ?? payload) as Record<string, unknown>
  const meta = (data.metadata ?? payload.metadata) as Record<string, unknown> | undefined
  const candidates = [
    data.conversation_id,
    data.conversationId,
    payload.conversation_id,
    payload.conversationId,
    meta?.conversation_id,
    meta?.conversationId,
    (data.conversation as Record<string, unknown>)?.conversation_id,
  ]
  for (const c of candidates) {
    const s = asStr(c)
    if (s) return s
  }
  return null
}

/** Data collection / análisis: varias rutas según versión ElevenLabs */
function pickStructured(payload: Record<string, unknown>): Record<string, unknown> {
  const data = (payload.data ?? payload) as Record<string, unknown>
  const analysis = (data.analysis ?? payload.analysis) as Record<string, unknown> | undefined
  const blocks: Record<string, unknown>[] = [
    (analysis?.structured_data as Record<string, unknown>) ?? {},
    (analysis?.structuredData as Record<string, unknown>) ?? {},
    (analysis?.data_collection_results as Record<string, unknown>) ?? {},
    (analysis?.data_collection as Record<string, unknown>) ?? {},
    (data.collection as Record<string, unknown>) ?? {},
    (data.data_collection as Record<string, unknown>) ?? {},
    (payload.collection as Record<string, unknown>) ?? {},
  ]
  const out: Record<string, unknown> = {}
  for (const b of blocks) {
    if (b && typeof b === 'object')
      for (const [k, v] of Object.entries(b)) if (v !== undefined && v !== '') out[k] = v
  }
  return out
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
    const col = (key: string): string | null => {
      const v = s[key]
      if (v === null || v === undefined) return null
      if (typeof v === 'boolean') return null
      return asStr(v)
    }
    const colBool = (key: string): boolean | null =>
      typeof s[key] === 'boolean' ? (s[key] as boolean) : null

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

        ciudad_principal: col('ciudad_principal'),
        nombre_negocio: col('nombre_negocio'),
        descripcion_negocio: col('descripcion_negocio'),
        tipo_negocio: col('tipo_negocio'),
        momento_negocio: col('momento_negocio'),
        antiguedad_negocio: col('antiguedad_negocio'),
        cliente_objetivo: col('cliente_objetivo'),
        busca_primario: col('busca_primario'),
        busca_detalle: col('busca_detalle'),
        busca_secundario: col('busca_secundario'),
        ofrece: col('ofrece'),
        logro_notable: col('logro_notable'),
        preferencia_conexion: col('preferencia_conexion'),
        referido_por: col('referido_por'),
        notas_personalidad: col('notas_personalidad'),
        score_urgencia: col('score_urgencia'),
        perfil_completo: colBool('perfil_completo'),
        follow_up_pendiente: colBool('follow_up_pendiente'),

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
