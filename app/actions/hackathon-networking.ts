'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import type { HackatonSubmission } from '@/types/database.types'
import {
  inicialesDesdeNombre,
  perfilHackathonLabel,
  perfilToRoleClass,
  type HackathonRoleClass,
} from '@/lib/hackathon-display'

export type { HackathonRoleClass } from '@/lib/hackathon-display'

export async function verificarHackathonPorTelefono(
  telefono: string
): Promise<{ ok: true; submission: HackatonSubmission } | { ok: false; error: string }> {
  const normalizado = telefono.replace(/\D/g, '')
  if (normalizado.length < 7 || normalizado.length > 15) {
    return { ok: false, error: 'Ingresa un número válido (solo dígitos).' }
  }
  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { data, error } = await supabase
    .from('hackaton_submissions')
    .select('*')
    .eq('telefono', normalizado)
    .maybeSingle()

  if (error || !data) {
    return {
      ok: false,
      error:
        'No encontramos tu registro. Completa primero el formulario del hackathon (hackaton.snrg.lat).',
    }
  }

  return { ok: true, submission: data as HackatonSubmission }
}

export type HackathonBadgePayload = {
  nombreCompleto: string
  nombreDisplay: string
  perfil: string
  perfilLabel: string
  badgeId: string
  iniciales: string
  roleClass: HackathonRoleClass
}

export async function getHackathonBadgePayload(
  submissionId: string
): Promise<HackathonBadgePayload | null> {
  const supabase = createAdminClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('hackaton_submissions')
    .select('*')
    .eq('id', submissionId)
    .maybeSingle()
  if (error || !data) return null
  const row = data as HackatonSubmission
  return {
    nombreCompleto: row.nombre_completo,
    nombreDisplay: row.nombre_completo.toUpperCase(),
    perfil: row.perfil,
    perfilLabel: perfilHackathonLabel(row.perfil),
    badgeId: row.badge_id,
    iniciales: inicialesDesdeNombre(row.nombre_completo),
    roleClass: perfilToRoleClass(row.perfil),
  }
}

export type HackathonConexionUsuario = {
  id: string
  nombreCompleto: string
  telefono: string
  perfil: string
  perfilLabel: string
  roleClass: HackathonRoleClass
  matchedAt: string
}

export async function getHackathonConexiones(
  submissionId: string,
  ronda: 1 | 2
): Promise<HackathonConexionUsuario[]> {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data: matches } = await supabase
    .from('match_hackaton')
    .select('matched_submission_id, created_at')
    .eq('submission_id', submissionId)
    .eq('ronda', ronda)
    .order('created_at', { ascending: true })

  const ids = matches?.map((m) => m.matched_submission_id) ?? []
  if (ids.length === 0) return []

  const { data: people } = await supabase
    .from('hackaton_submissions')
    .select('id, nombre_completo, perfil, telefono')
    .in('id', ids)

  const peopleMap = new Map((people ?? []).map((p) => [p.id, p]))

  const out: HackathonConexionUsuario[] = []
  for (const m of matches ?? []) {
    const p = peopleMap.get(m.matched_submission_id)
    if (!p) continue
    const perfil = p.perfil
    out.push({
      id: p.id,
      nombreCompleto: p.nombre_completo,
      telefono: (p.telefono as string) ?? '',
      perfil,
      perfilLabel: perfilHackathonLabel(perfil),
      roleClass: perfilToRoleClass(perfil),
      matchedAt: m.created_at,
    })
  }
  return out
}
