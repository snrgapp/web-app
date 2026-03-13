import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

/**
 * Webhook de Vapi para end-of-call-report.
 * Inserta o actualiza ia_call_profiles con datos extraídos durante la llamada.
 *
 * Configurar en Vapi Dashboard: Server URL = tu-dominio/api/webhooks/vapi
 * serverMessages: ["end-of-call-report"]
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json()

    if (payload?.message?.type !== 'end-of-call-report') {
      return NextResponse.json({ ok: true })
    }

    const call = payload.message.call
    const analysis = payload.message.analysis
    const s = analysis?.structuredData ?? {}

    const leadId = s.lead_id

    if (!leadId) {
      console.warn('Vapi webhook: lead_id ausente en structuredData, ignorando')
      return NextResponse.json({ ok: true })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      console.error('Vapi webhook: Supabase no configurado')
      return NextResponse.json({ error: 'Config error' }, { status: 503 })
    }

    const { error } = await supabase.from('ia_call_profiles').upsert(
      {
        lead_id: leadId,
        vapi_call_id: call.id,

        ciudad_principal: s.ciudad_principal ?? null,
        nombre_negocio: s.nombre_negocio ?? null,
        descripcion_negocio: s.descripcion_negocio ?? null,
        tipo_negocio: s.tipo_negocio ?? null,
        momento_negocio: s.momento_negocio ?? null,
        antiguedad_negocio: s.antiguedad_negocio ?? null,
        cliente_objetivo: s.cliente_objetivo ?? null,
        busca_primario: s.busca_primario ?? null,
        busca_detalle: s.busca_detalle ?? null,
        busca_secundario: s.busca_secundario ?? null,
        ofrece: s.ofrece ?? null,
        logro_notable: s.logro_notable ?? null,
        preferencia_conexion: s.preferencia_conexion ?? null,
        referido_por: s.referido_por ?? null,
        notas_personalidad: s.notas_personalidad ?? null,
        score_urgencia: s.score_urgencia ?? null,
        perfil_completo: s.perfil_completo ?? null,
        follow_up_pendiente: s.follow_up_pendiente ?? null,

        ended_reason: call.endedReason ?? null,
        started_at: call.startedAt ?? null,
        ended_at: call.endedAt ?? null,
        cost: call.cost ?? null,
      },
      { onConflict: 'vapi_call_id' }
    )

    if (error) {
      console.error('Vapi webhook ia_call_profiles upsert:', error)
      return NextResponse.json({ error: 'Upsert failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Vapi webhook error:', e)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
