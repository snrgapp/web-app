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

export async function registrarWaClick(
  submissionId: string,
  clickedSubmissionId: string,
  ronda: 1 | 2
): Promise<void> {
  if (!submissionId || !clickedSubmissionId) return
  const supabase = createAdminClient()
  if (!supabase) return
  await supabase.from('genius_networking_wa_clicks').insert({
    submission_id: submissionId,
    clicked_submission_id: clickedSubmissionId,
    ronda,
  })
}

export async function guardarFeedbackGeniusNetworking(
  submissionId: string,
  rating: number,
  comment: string | null,
  conexionesCount: number | null
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
    conexiones_count: conexionesCount,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function getGeniusDashboardData() {
  const supabase = createAdminClient()
  if (!supabase) return null

  const [
    { data: registros },
    { data: matches },
    { data: waClicks },
    { data: feedbacks },
  ] = await Promise.all([
    supabase.from('genius_conecta_submissions').select('id, identidad, created_at'),
    supabase.from('match_genius').select('id, ronda'),
    supabase.from('genius_networking_wa_clicks').select('id, ronda, created_at'),
    supabase.from('genius_networking_feedback').select('rating, conexiones_count, created_at'),
  ])

  const arquetipos: Record<string, number> = {}
  for (const r of registros ?? []) {
    arquetipos[r.identidad] = (arquetipos[r.identidad] ?? 0) + 1
  }

  const matchesPorRonda = { 1: 0, 2: 0 }
  for (const m of matches ?? []) {
    if (m.ronda === 1 || m.ronda === 2) matchesPorRonda[m.ronda]++
  }

  const clicksPorRonda = { 1: 0, 2: 0 }
  for (const c of waClicks ?? []) {
    if (c.ronda === 1 || c.ronda === 2) clicksPorRonda[c.ronda]++
  }

  const conexionesDist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 }
  let totalConexiones = 0
  let countConConexiones = 0
  for (const f of feedbacks ?? []) {
    if (f.conexiones_count !== null) {
      const k = Math.min(f.conexiones_count, 3)
      conexionesDist[k] = (conexionesDist[k] ?? 0) + 1
      totalConexiones += f.conexiones_count
      countConConexiones++
    }
  }

  const registrosPorHora: Record<string, number> = {}
  for (const r of registros ?? []) {
    const h = new Date(r.created_at).toISOString().slice(0, 13) + ':00'
    registrosPorHora[h] = (registrosPorHora[h] ?? 0) + 1
  }

  const avgRating =
    (feedbacks ?? []).length > 0
      ? (feedbacks ?? []).reduce((s, f) => s + f.rating, 0) / (feedbacks ?? []).length
      : null

  return {
    totalRegistros: (registros ?? []).length,
    totalMatches: (matches ?? []).length,
    totalWaClicks: (waClicks ?? []).length,
    totalFeedbacks: (feedbacks ?? []).length,
    avgRating,
    avgConexiones: countConConexiones > 0 ? totalConexiones / countConConexiones : null,
    arquetipos,
    matchesPorRonda,
    clicksPorRonda,
    conexionesDist,
    registrosPorHora,
  }
}
