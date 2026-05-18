'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import type { IeeeNetworkingSubmission } from '@/types/database.types'

export async function verificarIeeePorTelefono(
  telefono: string
): Promise<{ ok: true; submission: IeeeNetworkingSubmission } | { ok: false; error: string }> {
  const normalizado = telefono.replace(/\D/g, '')
  if (normalizado.length < 7 || normalizado.length > 15) {
    return { ok: false, error: 'Ingresa un número válido (solo dígitos).' }
  }
  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { data, error } = await supabase
    .from('ieee_networking_submissions')
    .select('*')
    .eq('telefono', normalizado)
    .maybeSingle()

  if (error || !data) {
    return {
      ok: false,
      error:
        'No encontramos tu registro. Completa primero el formulario en ieee.snrg.lat.',
    }
  }

  return { ok: true, submission: data as IeeeNetworkingSubmission }
}

export async function getIeeeResumenParticipante(
  submissionId: string
): Promise<{ nombreCompleto: string; telefono: string } | null> {
  const supabase = createAdminClient()
  if (!supabase) return null
  const { data } = await supabase
    .from('ieee_networking_submissions')
    .select('nombre_completo, telefono')
    .eq('id', submissionId)
    .maybeSingle()
  if (!data) return null
  return {
    nombreCompleto: data.nombre_completo,
    telefono: data.telefono,
  }
}

export type IeeeConexionUsuario = {
  id: string
  nombreCompleto: string
  areasInteres: string[]
  telefono: string
  matchedAt: string
}

export async function getIeeeConexiones(
  submissionId: string,
  ronda: 1 | 2
): Promise<IeeeConexionUsuario[]> {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data: matches } = await supabase
    .from('match_ieee')
    .select('matched_submission_id, created_at')
    .eq('submission_id', submissionId)
    .eq('ronda', ronda)
    .order('created_at', { ascending: true })

  const ids = matches?.map((m) => m.matched_submission_id) ?? []
  if (ids.length === 0) return []

  const { data: people } = await supabase
    .from('ieee_networking_submissions')
    .select('id, nombre_completo, areas_interes, telefono')
    .in('id', ids)

  const peopleMap = new Map((people ?? []).map((p) => [p.id, p]))

  const out: IeeeConexionUsuario[] = []
  for (const m of matches ?? []) {
    const p = peopleMap.get(m.matched_submission_id)
    if (!p) continue
    out.push({
      id: p.id,
      nombreCompleto: p.nombre_completo,
      areasInteres: (p.areas_interes as string[]) ?? [],
      telefono: p.telefono,
      matchedAt: m.created_at,
    })
  }
  return out
}

export async function guardarFeedbackIeeeNetworking(
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
  const { error } = await supabase.from('ieee_networking_feedback').insert({
    submission_id: submissionId,
    rating,
    comment: trimmed.length > 0 ? trimmed.slice(0, 2000) : null,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
