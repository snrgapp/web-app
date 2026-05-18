/**
 * Matching IEEE networking sin IA: misma estrategia que Genius FEST, diversidad por
 * la primera área de interés (orden del formulario).
 */

import { createAdminClient } from '@/utils/supabase/admin'

const INSERT_CHUNK = 400
const MAX_GROUP = 5
const TARGET_MAX_SAME_IDENTIDAD = 2

const DEFAULT_RAZON =
  'Grupo IEEE: perfiles mixtos por área de interés (idealmente hasta 2 con la misma primera área).'

const FALLBACK_DIVERSITY = 'General'

type IeeeProfile = {
  id: string
  /** Primera área en el orden enviado desde el formulario */
  diversity_key: string
  nombre_completo: string
  created_at?: string
}

type MatchRow = {
  submission_id: string
  matched_submission_id: string
  ronda: number
  razon: string | null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

function pairsMetInGroups(groups: string[][]): Set<string> {
  const set = new Set<string>()
  for (const g of groups) {
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        set.add(pairKey(g[i]!, g[j]!))
      }
    }
  }
  return set
}

function canAddToGroup(id: string, group: string[], forbiddenPairs: Set<string>): boolean {
  for (const x of group) {
    if (forbiddenPairs.has(pairKey(id, x))) return false
  }
  return true
}

function buildRound2AvoidingPairs(r1: string[][], forbiddenPairs: Set<string>): string[][] {
  let pool = shuffle(r1.flat())
  if (pool.length === 0) return []

  const groups: string[][] = []

  while (pool.length > 0) {
    const g: string[] = []
    let grew = true
    while (grew && g.length < MAX_GROUP && pool.length > 0) {
      grew = false
      for (let i = 0; i < pool.length && g.length < MAX_GROUP; i++) {
        const cand = pool[i]!
        if (canAddToGroup(cand, g, forbiddenPairs)) {
          g.push(cand)
          pool.splice(i, 1)
          grew = true
          break
        }
      }
    }
    if (g.length === 0) {
      g.push(pool.shift()!)
    }
    groups.push(g)
  }

  return groups
}

function r2ViolatesForbidden(r2: string[][], forbiddenPairs: Set<string>): boolean {
  for (const g of r2) {
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        if (forbiddenPairs.has(pairKey(g[i]!, g[j]!))) return true
      }
    }
  }
  return false
}

function validatePartition(ids: string[], groups: string[][]): boolean {
  if (!groups.length && ids.length > 0) return false
  const flat = groups.flat()
  if (flat.length !== ids.length) return false
  const idSet = new Set(ids)
  const counts = new Map<string, number>()
  for (const id of flat) {
    if (!idSet.has(id)) return false
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }
  if (counts.size !== ids.length) return false
  for (const id of ids) {
    if (counts.get(id) !== 1) return false
  }
  return true
}

function buildRound1Groups(profiles: IeeeProfile[], messages: string[]): string[][] {
  let pool = shuffle([...profiles])
  const groups: string[][] = []
  let relajo = false

  while (pool.length > 0) {
    const group: IeeeProfile[] = []
    const counts = new Map<string, number>()

    while (group.length < MAX_GROUP && pool.length > 0) {
      let placed = false
      for (
        let ceiling = TARGET_MAX_SAME_IDENTIDAD;
        ceiling <= MAX_GROUP && !placed;
        ceiling++
      ) {
        if (ceiling > TARGET_MAX_SAME_IDENTIDAD) relajo = true
        for (let i = 0; i < pool.length; i++) {
          const p = pool[i]!
          if ((counts.get(p.diversity_key) ?? 0) < ceiling) {
            group.push(p)
            pool.splice(i, 1)
            counts.set(p.diversity_key, (counts.get(p.diversity_key) ?? 0) + 1)
            placed = true
            break
          }
        }
        if (placed) break
      }
      if (!placed) break
    }

    if (group.length === 0 && pool.length > 0) {
      const p = pool.shift()!
      groups.push([p.id])
      continue
    }
    groups.push(group.map((p) => p.id))
  }

  if (relajo) {
    messages.push(
      'Aviso IEEE: en algunos grupos hubo más de 2 personas con la misma primera área de interés por falta de diversidad.'
    )
  }
  return groups
}

function buildMatchEdges(groups: string[][], ronda: number, razon: string): MatchRow[] {
  const rows: MatchRow[] = []
  const edge = new Set<string>()
  const pushBi = (a: string, b: string) => {
    const k1 = `${a}|${b}|${ronda}`
    const k2 = `${b}|${a}|${ronda}`
    if (!edge.has(k1)) {
      edge.add(k1)
      rows.push({
        submission_id: a,
        matched_submission_id: b,
        ronda,
        razon,
      })
    }
    if (!edge.has(k2)) {
      edge.add(k2)
      rows.push({
        submission_id: b,
        matched_submission_id: a,
        ronda,
        razon,
      })
    }
  }

  for (const g of groups) {
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        pushBi(g[i]!, g[j]!)
      }
    }
  }
  return rows
}

async function insertMatchChunks(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  rows: MatchRow[]
): Promise<{ error: Error | null }> {
  for (let i = 0; i < rows.length; i += INSERT_CHUNK) {
    const chunk = rows.slice(i, i + INSERT_CHUNK)
    const { error } = await supabase.from('match_ieee').insert(chunk as never)
    if (error) return { error: new Error(error.message) }
  }
  return { error: null }
}

export type RecomputeIeeeResult = {
  ok: boolean
  profileCount: number
  matchRowsWritten: number
  ronda1Groups: number
  ronda2Groups: number
  messages: string[]
}

export async function recomputeIeeeMatches(): Promise<RecomputeIeeeResult> {
  const messages: string[] = []

  const fail = (extra?: Partial<Omit<RecomputeIeeeResult, 'ok' | 'messages'>>) => ({
    ok: false as const,
    profileCount: extra?.profileCount ?? 0,
    matchRowsWritten: extra?.matchRowsWritten ?? 0,
    ronda1Groups: extra?.ronda1Groups ?? 0,
    ronda2Groups: extra?.ronda2Groups ?? 0,
    messages: [...messages],
  })

  const supabase = createAdminClient()
  if (!supabase) {
    messages.push('Sin cliente admin: revisa NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.')
    return fail({})
  }

  const { data: rows, error } = await supabase
    .from('ieee_networking_submissions')
    .select('id, nombre_completo, areas_interes, created_at')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('recomputeIeeeMatches fetch:', error)
    messages.push(`Error leyendo inscritos: ${error.message}`)
    return fail({})
  }

  const profiles: IeeeProfile[] = (rows ?? []).map((r) => {
    const areas = (r as { areas_interes?: string[] }).areas_interes ?? []
    const diversity_key =
      Array.isArray(areas) && areas.length > 0 && typeof areas[0] === 'string'
        ? areas[0]!
        : FALLBACK_DIVERSITY
    return {
      id: (r as { id: string }).id,
      diversity_key,
      nombre_completo: (r as { nombre_completo: string }).nombre_completo,
      created_at: (r as { created_at?: string }).created_at,
    }
  })

  const ids = profiles.map((p) => p.id)

  const sentinelUuid = '00000000-0000-0000-0000-000000000000'
  const { error: delErr } = await supabase.from('match_ieee').delete().neq('id', sentinelUuid)
  if (delErr) {
    messages.push(`No se pudo vaciar match_ieee: ${delErr.message}`)
    return fail({ profileCount: ids.length })
  }

  if (ids.length < 2) {
    messages.push('Menos de 2 inscritos IEEE: sin sugerencias hasta el siguiente registro.')
    return {
      ok: true,
      profileCount: ids.length,
      matchRowsWritten: 0,
      ronda1Groups: 0,
      ronda2Groups: 0,
      messages: [...messages],
    }
  }

  const r1 = buildRound1Groups(profiles, messages)
  const pairsR1 = pairsMetInGroups(r1)
  const r2 = buildRound2AvoidingPairs(r1, pairsR1)

  if (!validatePartition(ids, r2)) {
    messages.push('Error: partición ronda 2 inválida.')
    return fail({ profileCount: ids.length })
  }
  if (r2ViolatesForbidden(r2, pairsR1)) {
    messages.push('Error: ronda 2 repite parejas de ronda 1.')
    return fail({ profileCount: ids.length })
  }

  messages.push(
    'Matching IEEE: grupos de hasta 5 con diversidad por primera área de interés; ronda 2 sin repetir parejas de ronda 1.'
  )

  const matchRows: MatchRow[] = [
    ...buildMatchEdges(r1, 1, DEFAULT_RAZON),
    ...buildMatchEdges(r2, 2, DEFAULT_RAZON),
  ]

  const { error: insErr } = await insertMatchChunks(supabase, matchRows)
  if (insErr) {
    console.error('insert match_ieee:', insErr)
    messages.push(insErr.message)
    return fail({
      profileCount: ids.length,
      ronda1Groups: r1.length,
      ronda2Groups: r2.length,
    })
  }

  return {
    ok: true,
    profileCount: ids.length,
    matchRowsWritten: matchRows.length,
    ronda1Groups: r1.length,
    ronda2Groups: r2.length,
    messages: [...messages],
  }
}
