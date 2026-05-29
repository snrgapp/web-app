'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import type { GeniusConectaSubmission } from '@/types/database.types'

export async function verificarGeniusPorTelefono(
  telefono: string
): Promise<{ ok: true; submission: GeniusConectaSubmission } | { ok: false; error: string }> {
  const normalizado = telefono.replace(/\D/g, '')
  if (normalizado.length < 7 || normalizado.length > 15) {
    return { ok: false, error: 'Ingresa un número válido (solo dígitos).' }
  }
  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { data, error } = await supabase
    .from('genius_conecta_submissions')
    .select('*')
    .eq('telefono', normalizado)
    .maybeSingle()

  if (error || !data) {
    return {
      ok: false,
      error:
        'No encontramos tu registro. Completa primero el formulario en www.genius.snrg.lat.',
    }
  }

  return { ok: true, submission: data as GeniusConectaSubmission }
}

export async function getGeniusPerfil(
  submissionId: string
): Promise<{ nombreCompleto: string } | null> {
  const supabase = createAdminClient()
  if (!supabase) return null
  const { data } = await supabase
    .from('genius_conecta_submissions')
    .select('nombre_completo')
    .eq('id', submissionId)
    .maybeSingle()
  if (!data) return null
  return { nombreCompleto: data.nombre_completo }
}

export type GeniusConexionUsuario = {
  id: string
  nombreCompleto: string
  identidad: string
  mundo: string | null
  valorHumano: string
  telefono: string
  matchedAt: string
}

export async function getGeniusConexiones(
  submissionId: string,
  ronda: 1 | 2
): Promise<GeniusConexionUsuario[]> {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data: matches } = await supabase
    .from('match_genius')
    .select('matched_submission_id, created_at')
    .eq('submission_id', submissionId)
    .eq('ronda', ronda)
    .order('created_at', { ascending: true })

  const ids = matches?.map((m) => m.matched_submission_id) ?? []
  if (ids.length === 0) return []

  const { data: people } = await supabase
    .from('genius_conecta_submissions')
    .select('id, nombre_completo, identidad, mundo, valor_humano, telefono')
    .in('id', ids)

  const peopleMap = new Map((people ?? []).map((p) => [p.id, p]))

  const out: GeniusConexionUsuario[] = []
  for (const m of matches ?? []) {
    const p = peopleMap.get(m.matched_submission_id)
    if (!p) continue
    out.push({
      id: p.id,
      nombreCompleto: p.nombre_completo,
      identidad: p.identidad,
      mundo: p.mundo,
      valorHumano: p.valor_humano,
      telefono: p.telefono,
      matchedAt: m.created_at,
    })
  }
  return out
}

export async function guardarFeedbackGeniusNetworking(
  submissionId: string,
  rating: number,
  comment: string | null
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  if (rating < 1 || rating > 5) {
    return { ok: false, error: 'La calificación debe ser entre 1 y 5.' }
  }

  const trimmed = comment?.trim() ?? ''
  const { error } = await supabase.from('genius_networking_feedback').insert({
    submission_id: submissionId,
    rating,
    comment: trimmed.length > 0 ? trimmed.slice(0, 2000) : null,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
