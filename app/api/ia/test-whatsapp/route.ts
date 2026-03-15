// ============================================
// SYNERGY — Endpoint de prueba WhatsApp
// Archivo: app/api/ia/test-whatsapp/route.ts
// Dispara el envío de matches por WhatsApp sin llamada
// SOLO PARA DESARROLLO — eliminar en producción
// ============================================

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { enviarBienvenida, enviarMatches } from '@/services/whatsapp'
import type { MatchResult } from '@/services/matching'

export async function POST(req: Request) {
  // Bloquear en producción
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_TEST_WHATSAPP !== '1') {
    return NextResponse.json({ error: 'No disponible en producción' }, { status: 403 })
  }

  try {
    const { profile_a_id } = (await req.json()) as { profile_a_id: string }

    if (!profile_a_id) {
      return NextResponse.json({ error: 'Falta profile_a_id' }, { status: 400 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 })
    }

    // 1. Buscar el perfil A con su teléfono
    const { data: perfilA, error: errorA } = await supabase
      .from('ia_call_profiles')
      .select(`
        id,
        contacto_nombre,
        nombre_negocio,
        lead_id
      `)
      .eq('id', profile_a_id)
      .single()

    if (errorA || !perfilA) {
      return NextResponse.json({ error: 'Perfil A no encontrado' }, { status: 404 })
    }

    const { data: submissionA } = await supabase
      .from('ia_form_submissions')
      .select('telefono, nombre_completo')
      .eq('id', perfilA.lead_id)
      .single()

    if (!submissionA?.telefono) {
      return NextResponse.json({ error: 'Teléfono no encontrado para perfil A' }, { status: 404 })
    }

    // 2. Buscar matches en ia_matches para este perfil
    const { data: matchesDB, error: errorMatches } = await supabase
      .from('ia_matches')
      .select(`
        id,
        profile_b_id,
        score,
        razon,
        status
      `)
      .eq('profile_a_id', profile_a_id)
      .order('score', { ascending: false })

    if (errorMatches || !matchesDB || matchesDB.length === 0) {
      return NextResponse.json(
        {
          error: 'No hay matches para este perfil',
          hint: 'Verifica que ia_matches tenga registros para este profile_a_id',
        },
        { status: 404 }
      )
    }

    // 3. Enriquecer matches con datos del perfil B
    const matchesEnriquecidos: MatchResult[] = await Promise.all(
      matchesDB
        .filter((m) => m.profile_b_id != null)
        .map(async (m) => {
          const { data: perfilB } = await supabase
            .from('ia_call_profiles')
            .select(
              'id, contacto_nombre, nombre_negocio, ciudad_principal, descripcion_negocio, busca_detalle, ofrece, score_urgencia, notas_personalidad'
            )
            .eq('id', m.profile_b_id)
            .single()

          const score = Number(m.score)
          return {
            perfil: {
              id: m.profile_b_id as string,
              contacto_nombre: perfilB?.contacto_nombre ?? null,
              nombre_negocio: perfilB?.nombre_negocio ?? null,
              ciudad_principal: perfilB?.ciudad_principal ?? null,
              descripcion_negocio: perfilB?.descripcion_negocio ?? null,
              busca_detalle: perfilB?.busca_detalle ?? null,
              ofrece: perfilB?.ofrece ?? null,
              score_urgencia: perfilB?.score_urgencia ?? null,
              notas_personalidad: perfilB?.notas_personalidad ?? null,
              embedding_need: [],
              embedding_offer: [],
              similarity: score,
            },
            score,
            razon: m.razon ?? 'Creo que deberían conocerse.',
            breakdown: {
              similarity_base: score,
              city_bonus: 0,
              urgency_bonus: 0,
            },
          }
        })
    )

    if (matchesEnriquecidos.length === 0) {
      return NextResponse.json(
        { error: 'No hay matches válidos (profile_b_id null)' },
        { status: 404 }
      )
    }

    // 4. Actualizar status a "enviado" en ia_matches
    for (const m of matchesDB) {
      await supabase
        .from('ia_matches')
        .update({ status: 'enviado', updated_at: new Date().toISOString() })
        .eq('id', m.id)
    }

    // 5. Enviar WhatsApp
    console.log('📱 Enviando bienvenida a:', submissionA.telefono)
    await enviarBienvenida(submissionA.telefono, submissionA.nombre_completo)

    await new Promise((r) => setTimeout(r, 2000))

    console.log('📱 Enviando matches a:', submissionA.telefono)
    await enviarMatches(submissionA.telefono, submissionA.nombre_completo, matchesEnriquecidos)

    return NextResponse.json({
      ok: true,
      telefono: submissionA.telefono,
      matches_enviados: matchesEnriquecidos.length,
      matches: matchesEnriquecidos.map((m) => ({
        nombre_negocio: m.perfil.nombre_negocio,
        score: m.score,
        razon: m.razon,
      })),
    })
  } catch (error) {
    console.error('Error en test-whatsapp:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
