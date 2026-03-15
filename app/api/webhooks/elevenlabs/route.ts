import { createHmac, timingSafeEqual } from 'crypto'
import { NextResponse } from 'next/server'
import { generateProfileEmbeddings } from '@/services/embeddings'
import { buscarMatches, guardarMatches } from '@/services/matching'
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

/**
 * data_collection_results: array [{ id, value }] u objeto
 * { nombre_negocio: { value, rationale }, ... }
 */
function flattenCollectionArray(arr: unknown): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  if (!arr || typeof arr !== 'object') return out

  if (!Array.isArray(arr)) {
    const obj = arr as Record<string, unknown>
    for (const [key, entry] of Object.entries(obj)) {
      if (!entry || typeof entry !== 'object') continue
      const e = entry as Record<string, unknown>
      const val = e.value ?? e.val ?? e.answer
      if (val !== undefined && val !== '') out[key] = val
    }
    return out
  }

  for (const item of arr) {
    if (!item || typeof item !== 'object') continue
    const o = item as Record<string, unknown>
    const id = asStr(o.id ?? o.key ?? o.name)
    const val = o.value ?? o.val ?? o.answer
    if (id && val !== undefined && val !== '') out[id] = val
  }
  return out
}

/** Claves que deben salir solo de la llamada (data collection), no del formulario */
const PROFILE_KEYS = new Set([
  'lead_id',
  'ciudad_principal',
  'nombre_negocio',
  'descripcion_negocio',
  'tipo_negocio',
  'momento_negocio',
  'antiguedad_negocio',
  'cliente_objetivo',
  'busca_primario',
  'busca_detalle',
  'busca_secundario',
  'ofrece',
  'logro_notable',
  'preferencia_conexion',
  'referido_por',
  'notas_personalidad',
  'score_urgencia',
  'perfil_completo',
  'follow_up_pendiente',
  'contacto_nombre',
])

/** Recorre todo el JSON: ElevenLabs a veces anida data collection a varios niveles */
function deepCollectProfileFields(node: unknown, out: Record<string, unknown>): void {
  if (node === null || node === undefined) return
  if (typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const el of node) {
      if (el && typeof el === 'object' && !Array.isArray(el)) {
        const o = el as Record<string, unknown>
        const id = asStr(o.id ?? o.key ?? o.name ?? o.field_id)
        const val = o.value ?? o.val ?? o.answer ?? o.text ?? o.content
        if (id && PROFILE_KEYS.has(id) && val !== undefined && val !== '')
          out[id] = val
      }
      deepCollectProfileFields(el, out)
    }
    return
  }
  const obj = node as Record<string, unknown>
  for (const [k, v] of Object.entries(obj)) {
    if (PROFILE_KEYS.has(k) && v !== undefined && v !== '' && typeof v !== 'object')
      out[k] = v
    deepCollectProfileFields(v, out)
  }
}

/** Data collection solo desde el payload del post-llamada (nada del formulario) */
function pickStructured(payload: Record<string, unknown>): Record<string, unknown> {
  const data = (payload.data ?? payload) as Record<string, unknown>
  const analysis = (data.analysis ?? payload.analysis) as Record<string, unknown> | undefined
  const blocks: Record<string, unknown>[] = []

  const push = (b: unknown) => {
    if (b && typeof b === 'object' && !Array.isArray(b))
      blocks.push(b as Record<string, unknown>)
  }
  push(analysis?.structured_data)
  push(analysis?.structuredData)
  push(analysis?.data_collection)
  push(data.collection)
  push(data.data_collection)
  push(payload.collection)
  push(flattenCollectionArray(analysis?.data_collection_results))
  push(flattenCollectionArray(data.data_collection_results))
  push(flattenCollectionArray(analysis?.evaluation_criteria_results))
  push(flattenCollectionArray(data.evaluation_results))

  const flatRoots = [payload, data] as const
  for (const root of flatRoots) {
    const skip = new Set(['type', 'event', 'data', 'analysis', 'metadata'])
    for (const [k, v] of Object.entries(root)) {
      if (skip.has(k) || v === null || v === '') continue
      if (typeof v === 'object' && !Array.isArray(v)) continue
      if (PROFILE_KEYS.has(k)) blocks.push({ [k]: v })
    }
  }

  const out: Record<string, unknown> = {}
  for (const b of blocks) {
    for (const [k, v] of Object.entries(b)) {
      if (v !== undefined && v !== '') out[k] = v
    }
  }
  if (!out.nombre_negocio && out.nombreNegocio) out.nombre_negocio = out.nombreNegocio
  if (!out.nombre_negocio && out.business_name) out.nombre_negocio = out.business_name
  if (!out.contacto_nombre && out.nombre_contacto) out.contacto_nombre = out.nombre_contacto

  deepCollectProfileFields(payload, out)
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

    /** Diagnóstico: Vercel → Logs. Quitar ELEVENLABS_WEBHOOK_DEBUG después (datos sensibles). */
    if (
      process.env.ELEVENLABS_WEBHOOK_DEBUG === '1' ||
      process.env.ELEVENLABS_WEBHOOK_DEBUG === 'true'
    ) {
      console.log('[elevenlabs webhook] rawBody.length', rawBody.length)
      console.log('[elevenlabs webhook] payload JSON:\n', JSON.stringify(payload, null, 2))
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
    if (
      process.env.ELEVENLABS_WEBHOOK_DEBUG === '1' ||
      process.env.ELEVENLABS_WEBHOOK_DEBUG === 'true'
    ) {
      console.log(
        '[elevenlabs webhook] pickStructured keys:',
        Object.keys(s),
        '\nleadId',
        pickLeadId(payload),
        'conversationId',
        pickConversationId(payload)
      )
    }

    const col = (key: string): string | null => {
      const v = s[key]
      if (v === null || v === undefined) return null
      if (typeof v === 'boolean') return null
      return asStr(v)
    }
    const colBool = (key: string): boolean | null => {
      const v = s[key]
      if (typeof v === 'boolean') return v
      if (v === 'true' || v === 'false') return v === 'true'
      return null
    }

    const supabase = createAdminClient()
    if (!supabase) {
      console.error('ElevenLabs webhook: Supabase no configurado')
      return NextResponse.json({ error: 'Config error' }, { status: 503 })
    }

    const data = (payload.data ?? payload) as Record<string, unknown>
    const filled = [
      col('nombre_negocio'),
      col('contacto_nombre'),
      col('ciudad_principal'),
    ].filter(Boolean).length
    if (filled === 0) {
      console.warn(
        'ElevenLabs webhook: data collection vacía para esta llamada; revisar identificadores en el agente (nombre_negocio, contacto_nombre, …)',
        { conversationId, leadId }
      )
    }

    const { error } = await supabase.from('ia_call_profiles').upsert(
      {
        lead_id: leadId,
        vapi_call_id: conversationId,

        contacto_nombre: col('contacto_nombre'),
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

    // ── Embeddings: generar si el perfil tiene lo mínimo ──
    const tieneMinimo =
      col('descripcion_negocio') &&
      col('busca_detalle') &&
      col('ofrece')

    if (tieneMinimo) {
      try {
        const { data: perfilGuardado } = await supabase
          .from('ia_call_profiles')
          .select('id')
          .eq('vapi_call_id', conversationId)
          .single()

        if (perfilGuardado?.id) {
          const perfilParaEmbedding = {
            id: perfilGuardado.id,
            contacto_nombre: col('contacto_nombre'),
            nombre_negocio: col('nombre_negocio'),
            descripcion_negocio: col('descripcion_negocio'),
            sector: col('tipo_negocio'),
            tipo_negocio: col('tipo_negocio'),
            momento_negocio: col('momento_negocio'),
            cliente_objetivo: col('cliente_objetivo'),
            busca_primario: col('busca_primario'),
            busca_detalle: col('busca_detalle'),
            busca_secundario: col('busca_secundario'),
            ofrece: col('ofrece'),
            logro_notable: col('logro_notable'),
            ciudad_principal: col('ciudad_principal'),
          }

          const { embedding_need, embedding_offer } =
            await generateProfileEmbeddings(perfilParaEmbedding)

          const { error: embeddingError } = await supabase
            .from('ia_call_profiles')
            .update({
              embedding_need: JSON.stringify(embedding_need),
              embedding_offer: JSON.stringify(embedding_offer),
              listo_para_matching: true,
            })
            .eq('id', perfilGuardado.id)

          if (embeddingError) {
            console.error('Error guardando embeddings:', embeddingError)
          } else {
            console.log('✅ Embeddings generados para:', col('contacto_nombre') || perfilGuardado.id)

            // ── Paso 3: Matching ──
            if (embedding_need) {
              try {
                const perfilParaMatch = {
                  id: perfilGuardado.id,
                  contacto_nombre: col('contacto_nombre'),
                  nombre_negocio: col('nombre_negocio'),
                  descripcion_negocio: col('descripcion_negocio'),
                  tipo_negocio: col('tipo_negocio'),
                  momento_negocio: col('momento_negocio'),
                  cliente_objetivo: col('cliente_objetivo'),
                  busca_primario: col('busca_primario'),
                  busca_detalle: col('busca_detalle'),
                  busca_secundario: col('busca_secundario'),
                  ofrece: col('ofrece'),
                  logro_notable: col('logro_notable'),
                  ciudad_principal: col('ciudad_principal'),
                  score_urgencia: col('score_urgencia'),
                  embedding_need,
                  embedding_offer,
                }
                const matches = await buscarMatches(perfilParaMatch)

                if (matches.length > 0) {
                  console.log(`🎯 ${matches.length} matches para:`, col('contacto_nombre'))
                  matches.forEach((m) => {
                    console.log(`  → ${m.perfil.nombre_negocio} (score: ${m.score.toFixed(2)}) — ${m.razon}`)
                  })
                  await guardarMatches(perfilGuardado.id, matches)
                } else {
                  console.log('Sin matches por ahora — la red necesita más miembros')
                }
              } catch (matchErr) {
                console.error('Error en matching (no crítico):', matchErr)
              }
            }
          }
        }
      } catch (embErr) {
        console.error('Error generando embeddings (no crítico):', embErr)
      }
    } else {
      console.warn('Perfil incompleto — embeddings omitidos', {
        conversationId,
        tiene_descripcion: !!col('descripcion_negocio'),
        tiene_busca: !!col('busca_detalle'),
        tiene_ofrece: !!col('ofrece'),
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('ElevenLabs webhook error:', e)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}

/** Navegador / validación de URL: evita 405 Method Not Allowed */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'elevenlabs-webhook',
    hint: 'POST con cuerpo firmado (ElevenLabs-Signature) para guardar perfil',
  })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: 'GET, HEAD, POST, OPTIONS',
    },
  })
}
