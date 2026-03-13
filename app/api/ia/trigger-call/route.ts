import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { scheduleOutboundCall } from '@/lib/elevenlabs-outbound'

/**
 * Dispara la llamada ElevenLabs (Twilio outbound) para un submission ya guardado.
 * Llamado por el frontend tras el submit.
 */
export async function POST(req: NextRequest) {
  try {
    const { submissionId } = await req.json()

    if (!submissionId || typeof submissionId !== 'string') {
      return NextResponse.json(
        { error: 'submissionId requerido' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Config error' },
        { status: 503 }
      )
    }

    const { data: sub, error } = await supabase
      .from('ia_form_submissions')
      .select('id, telefono, nombre_completo')
      .eq('id', submissionId)
      .single()

    if (error || !sub) {
      return NextResponse.json(
        { error: 'Submission no encontrado' },
        { status: 404 }
      )
    }

    const callResult = await scheduleOutboundCall({
      to: sub.telefono,
      customerName: sub.nombre_completo ?? undefined,
      leadId: sub.id,
    })

    if (!callResult.ok) {
      console.error('trigger-call ElevenLabs failed:', callResult.error)
      return NextResponse.json(
        { error: callResult.error ?? 'Error al llamar' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, conversationId: callResult.conversationId })
  } catch (e) {
    console.error('trigger-call error:', e)
    return NextResponse.json(
      { error: 'Error inesperado' },
      { status: 500 }
    )
  }
}
