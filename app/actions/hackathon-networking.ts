'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import type { HackatonSubmission } from '@/types/database.types'
import {
  upsertHackathonIntention,
  fetchMisIntenciones,
} from '@/services/hackathon-intentions'
import {
  PERFIL_LABEL,
  inicialesDesdeNombre,
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
  perfil: HackatonSubmission['perfil']
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
    perfilLabel: PERFIL_LABEL[row.perfil],
    badgeId: row.badge_id,
    iniciales: inicialesDesdeNombre(row.nombre_completo),
    roleClass: perfilToRoleClass(row.perfil),
  }
}

export type HackathonConexionUsuario = {
  id: string
  nombreCompleto: string
  perfil: HackatonSubmission['perfil']
  perfilLabel: string
  roleClass: HackathonRoleClass
  equipoLabel: string | null
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
    .select('id, nombre_completo, perfil')
    .in('id', ids)

  const { data: equiposRows } = await supabase
    .from('hackaton_equipo_miembros')
    .select('submission_id, equipo_id')
    .eq('ronda', ronda)
    .in('submission_id', ids)

  const equipoIds = [...new Set(equiposRows?.map((r) => r.equipo_id) ?? [])]
  const equipoNumById = new Map<string, number>()
  if (equipoIds.length > 0) {
    const { data: equipos } = await supabase
      .from('hackaton_equipos')
      .select('id, numero')
      .in('id', equipoIds)
    equipos?.forEach((e) => equipoNumById.set(e.id, e.numero))
  }

  const submissionEquipo = new Map<string, string | null>()
  equiposRows?.forEach((r) => {
    const num = equipoNumById.get(r.equipo_id)
    submissionEquipo.set(r.submission_id, num != null ? `EQUIPO ${num}` : null)
  })

  const peopleMap = new Map((people ?? []).map((p) => [p.id, p]))

  const out: HackathonConexionUsuario[] = []
  for (const m of matches ?? []) {
    const p = peopleMap.get(m.matched_submission_id)
    if (!p) continue
    const perfil = p.perfil as HackatonSubmission['perfil']
    out.push({
      id: p.id,
      nombreCompleto: p.nombre_completo,
      perfil,
      perfilLabel: PERFIL_LABEL[perfil],
      roleClass: perfilToRoleClass(perfil),
      equipoLabel: submissionEquipo.get(p.id) ?? null,
      matchedAt: m.created_at,
    })
  }
  return out
}

export type HackathonEquipoMiembroSticky = {
  submissionId: string
  nombreCompleto: string
  iniciales: string
  roleClass: HackathonRoleClass
}

export type HackathonMiEquipoSticky = {
  grupoNumero: number | null
  grupoNombre: string
  cuposMax: number
  miembros: HackathonEquipoMiembroSticky[]
  yoEnGrupo: boolean
}

export async function getHackathonMiEquipoSticky(
  submissionId: string,
  ronda: 1 | 2
): Promise<HackathonMiEquipoSticky> {
  const empty: HackathonMiEquipoSticky = {
    grupoNumero: null,
    grupoNombre: '',
    cuposMax: 5,
    miembros: [],
    yoEnGrupo: false,
  }
  const supabase = createAdminClient()
  if (!supabase) return empty

  const { data: mine } = await supabase
    .from('hackaton_equipo_miembros')
    .select('equipo_id')
    .eq('submission_id', submissionId)
    .eq('ronda', ronda)
    .maybeSingle()

  if (!mine?.equipo_id) return empty

  const { data: equipo } = await supabase
    .from('hackaton_equipos')
    .select('id, numero, nombre, cupos_max')
    .eq('id', mine.equipo_id)
    .maybeSingle()

  if (!equipo) return empty

  const { data: miembroRows } = await supabase
    .from('hackaton_equipo_miembros')
    .select('submission_id')
    .eq('equipo_id', mine.equipo_id)
    .eq('ronda', ronda)
    .order('orden', { ascending: true })

  const peerIds = miembroRows?.map((r) => r.submission_id) ?? []
  if (peerIds.length === 0) {
    return {
      grupoNumero: equipo.numero,
      grupoNombre: equipo.nombre?.trim() || `EQUIPO ${equipo.numero}`,
      cuposMax: equipo.cupos_max,
      miembros: [],
      yoEnGrupo: false,
    }
  }

  const { data: people } = await supabase
    .from('hackaton_submissions')
    .select('id, nombre_completo, perfil')
    .in('id', peerIds)

  const byId = new Map((people ?? []).map((p) => [p.id, p]))
  const miembros: HackathonEquipoMiembroSticky[] = []
  for (const sid of peerIds) {
    const p = byId.get(sid)
    if (!p) continue
    const perfil = p.perfil as HackatonSubmission['perfil']
    miembros.push({
      submissionId: p.id,
      nombreCompleto: p.nombre_completo,
      iniciales: inicialesDesdeNombre(p.nombre_completo),
      roleClass: perfilToRoleClass(perfil),
    })
  }

  return {
    grupoNumero: equipo.numero,
    grupoNombre: equipo.nombre?.trim() || `EQUIPO ${equipo.numero}`,
    cuposMax: equipo.cupos_max,
    miembros,
    yoEnGrupo: peerIds.includes(submissionId),
  }
}

export type HackathonRecienteEnEquipo = {
  nombreCorto: string
  iniciales: string
  roleClass: HackathonRoleClass
  equipoNumero: number
  createdAt: string
}

/** Últimas personas asignadas a un equipo (tira superior en la app). */
export async function getHackathonUltimasAsignaciones(
  limite: number
): Promise<HackathonRecienteEnEquipo[]> {
  const supabase = createAdminClient()
  if (!supabase) return []
  const take = Math.min(Math.max(limite, 1), 50)

  const { data: rows } = await supabase
    .from('hackaton_equipo_miembros')
    .select('submission_id, equipo_id, created_at')
    .order('created_at', { ascending: false })
    .limit(take)

  if (!rows?.length) return []

  const sids = [...new Set(rows.map((r) => r.submission_id))]
  const eids = [...new Set(rows.map((r) => r.equipo_id))]

  const [{ data: people }, { data: equipos }] = await Promise.all([
    supabase.from('hackaton_submissions').select('id, nombre_completo, perfil').in('id', sids),
    supabase.from('hackaton_equipos').select('id, numero').in('id', eids),
  ])

  const pMap = new Map((people ?? []).map((p) => [p.id, p]))
  const eMap = new Map((equipos ?? []).map((e) => [e.id, e.numero]))

  return rows.map((r) => {
    const p = pMap.get(r.submission_id)
    const perfil = (p?.perfil ?? 'full_stack') as HackatonSubmission['perfil']
    const nombre = p?.nombre_completo ?? 'Participante'
    const first = nombre.split(/\s+/)[0] ?? nombre
    return {
      nombreCorto: first,
      iniciales: p ? inicialesDesdeNombre(p.nombre_completo) : '?',
      roleClass: perfilToRoleClass(perfil),
      equipoNumero: eMap.get(r.equipo_id) ?? 0,
      createdAt: r.created_at,
    }
  })
}

export async function getHackathonChallengesList(): Promise<{ id: string; name: string }[]> {
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data } = await supabase
    .from('hackaton_challenges')
    .select('id, name')
    .order('sort_order', { ascending: true })
  return (data ?? []) as { id: string; name: string }[]
}

export async function registrarIntencionHackathon(input: {
  telefono: string
  fromSubmissionId: string
  toSubmissionId: string
  type: 'interested' | 'pass'
}): Promise<{ ok: true } | { ok: false; error: string }> {
  return upsertHackathonIntention({
    telefonoDigits: input.telefono,
    fromSubmissionId: input.fromSubmissionId,
    toSubmissionId: input.toSubmissionId,
    type: input.type,
  })
}

export async function obtenerMisIntencionesHackathon(
  telefono: string,
  fromSubmissionId: string
): Promise<Record<string, 'interested' | 'pass'>> {
  return fetchMisIntenciones(telefono, fromSubmissionId)
}
