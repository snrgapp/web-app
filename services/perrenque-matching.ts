/**
 * Matching Perrenque sin IA: grupos desde BD con regla 3+2 por identidad,
 * ronda 2 sin repetir parejas de la ronda 1 (mismo día), incremental con cupos,
 * y modo día 2 sin repetir parejas que ya compartieron grupo el día 1.
 */

import { createAdminClient } from '@/utils/supabase/admin'
import { getPerrenqueEventDay, type PerrenqueEventDay } from '@/lib/perrenque-event-day'

const DEFAULT_RAZON =
  'Conexión sugerida para esta ronda según tu perfil en Perrenque Creativo.'

const INSERT_CHUNK = 400
const SELECT_PAGE = 1000
const DELETE_IN_CHUNK = 100

export type RecomputeMode = 'incremental' | 'full'

export type RecomputeOptions = {
  mode?: RecomputeMode
  /** Solo día 2: borra asignaciones event_day=2 y rearma toda la cohorte sin repetir parejas del día 1 */
  matchDay2?: boolean
  /** Por defecto desde env (PERRENQUE_EVENT_DAY); día 2 fuerza 2 si matchDay2 */
  eventDay?: PerrenqueEventDay
}

interface Profile {
  id: string
  nombre_completo: string
  identidad: string
  motivacion: string
  mundo: string
  valor_humano: string
  created_at?: string
}

function normIdentidad(s: string): string {
  return s.trim().toLowerCase()
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

/** Pares que compartieron grupo en una misma ronda (lista de grupos = arrays de ids). */
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

function canAddToGroup(id: string, group: string[], forbiddenPairs: Set<string>): boolean {
  for (const x of group) {
    if (forbiddenPairs.has(pairKey(id, x))) return false
  }
  return true
}

/** Ronda 2: nadie comparte pareja prohibida dentro del mismo grupo (típicamente parejas de R1 mismo día). */
function buildRound2AvoidingPairs(r1: string[][], forbiddenPairs: Set<string>): string[][] {
  const buckets = r1.map((g) => shuffle([...g]))
  const draft: string[][] = []
  while (buckets.some((b) => b.length > 0)) {
    const g: string[] = []
    for (const b of buckets) {
      if (b.length > 0) g.push(b.shift()!)
    }
    if (g.length > 0) draft.push(g)
  }

  const groups: string[][] = draft.filter((gr) => gr.length > 1)
  let singles = draft.filter((gr) => gr.length === 1).map((gr) => gr[0]!)

  let changed = true
  while (changed) {
    changed = false
    for (let i = singles.length - 1; i >= 0; i--) {
      const s = singles[i]!
      for (const gr of groups) {
        if (canAddToGroup(s, gr, forbiddenPairs)) {
          gr.push(s)
          singles.splice(i, 1)
          changed = true
          break
        }
      }
    }
  }

  while (singles.length >= 2) {
    const a = singles.pop()!
    const idx = singles.findIndex((b) => !forbiddenPairs.has(pairKey(a, b)))
    if (idx >= 0) {
      const b = singles.splice(idx, 1)[0]!
      groups.push([a, b])
    } else {
      groups.push([a])
    }
  }
  if (singles.length === 1) groups.push([singles[0]!])

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

function isValid532(ids: string[], byId: Map<string, Profile>): boolean {
  if (ids.length !== 5) return false
  const idsNorm = ids.map((id) => normIdentidad(byId.get(id)?.identidad ?? ''))
  const counts = new Map<string, number>()
  for (const idn of idsNorm) counts.set(idn, (counts.get(idn) ?? 0) + 1)
  for (const [maj, c] of counts) {
    if (c === 3) {
      const others = idsNorm.filter((x) => x !== maj)
      return others.length === 2 && others.every((o) => o !== maj)
    }
  }
  return false
}

function tryTake532(pool: Profile[]): Profile[] | null {
  const identities = shuffle([...new Set(pool.map((p) => normIdentidad(p.identidad)))])
  for (const maj of identities) {
    const majors = pool.filter((p) => normIdentidad(p.identidad) === maj)
    if (majors.length < 3) continue
    const trio = majors.slice(0, 3)
    const trioIds = new Set(trio.map((p) => p.id))
    const outsiders = shuffle(pool.filter((p) => !trioIds.has(p.id) && normIdentidad(p.identidad) !== maj))
    if (outsiders.length >= 2) return [trio[0]!, trio[1]!, trio[2]!, outsiders[0]!, outsiders[1]!]
  }
  return null
}

function removeProfiles(pool: Profile[], take: Profile[]): void {
  const ids = new Set(take.map((p) => p.id))
  let i = 0
  while (i < pool.length) {
    if (ids.has(pool[i]!.id)) pool.splice(i, 1)
    else i++
  }
}

/** Grupos de 5 con 3 misma identidad + 2 con identidad distinta a la mayoría; resto en último grupo parcial. */
function buildGroups532(profiles: Profile[], messages: string[]): string[][] {
  let pool = shuffle([...profiles])
  const byId = new Map(profiles.map((p) => [p.id, p]))
  const groups: string[][] = []

  while (pool.length >= 5) {
    let chunk: Profile[] | null = null
    for (let attempt = 0; attempt < 20; attempt++) {
      chunk = tryTake532(pool)
      if (chunk) break
      shuffle(pool)
    }
    if (!chunk) {
      messages.push(
        'Aviso: no se encontró quinteto 3+2 estricto; se forma grupo de 5 por disponibilidad.'
      )
      chunk = pool.slice(0, 5)
    }
    removeProfiles(pool, chunk)
    groups.push(chunk.map((p) => p.id))
    if (!isValid532(groups[groups.length - 1]!, byId)) {
      messages.push('Aviso: un grupo de 5 no cumple regla 3+2 estricta tras relajar selección.')
    }
  }
  if (pool.length) groups.push(pool.map((p) => p.id))
  return groups
}

function tryTake532AvoidForbidden(
  pool: Profile[],
  forbidden: Set<string>,
  byId: Map<string, Profile>
): Profile[] | null {
  for (let attempt = 0; attempt < 35; attempt++) {
    const chunk = tryTake532(pool)
    if (!chunk) continue
    const ids = chunk.map((p) => p.id)
    let bad = false
    for (let i = 0; i < ids.length && !bad; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        if (forbidden.has(pairKey(ids[i]!, ids[j]!))) {
          bad = true
          break
        }
      }
    }
    if (!bad && isValid532(ids, byId)) return chunk
    shuffle(pool)
  }
  return null
}

/** Día 2: quintetos 3+2 sin parejas que ya compartieron grupo el día 1. */
function buildGroups532Day2(
  profiles: Profile[],
  forbiddenDay1: Set<string>,
  messages: string[]
): string[][] {
  let pool = shuffle([...profiles])
  const byId = new Map(profiles.map((p) => [p.id, p]))
  const groups: string[][] = []

  while (pool.length >= 5) {
    let chunk = tryTake532AvoidForbidden(pool, forbiddenDay1, byId)
    if (!chunk) {
      chunk = tryTake532(pool)
      if (chunk) {
        const ids = chunk.map((p) => p.id)
        let violated = false
        for (let i = 0; i < ids.length && !violated; i++) {
          for (let j = i + 1; j < ids.length; j++) {
            if (forbiddenDay1.has(pairKey(ids[i]!, ids[j]!))) violated = true
          }
        }
        if (violated) {
          messages.push(
            'Día 2: no fue posible un quinteto 3+2 sin solapamiento con día 1; se relaja el aislamiento de parejas.'
          )
        }
      }
    }
    if (!chunk) {
      messages.push('Día 2: quinteto por disponibilidad sin regla 3+2.')
      chunk = pool.slice(0, 5)
    }
    removeProfiles(pool, chunk)
    groups.push(chunk.map((p) => p.id))
  }
  if (pool.length) groups.push(pool.map((p) => p.id))
  return groups
}

async function clearMatchingTablesForDay(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  eventDay: PerrenqueEventDay
) {
  await supabase.from('match_perrenque').delete().eq('event_day', eventDay)
  await supabase.from('perrenque_grupo_ronda').delete().eq('event_day', eventDay)
}

async function fetchAllGrupoRondaRows(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  eventDay: PerrenqueEventDay
): Promise<{ submission_id: string; ronda: number; grupo_numero: number }[]> {
  const out: { submission_id: string; ronda: number; grupo_numero: number }[] = []
  let from = 0
  for (;;) {
    const { data, error } = await supabase
      .from('perrenque_grupo_ronda')
      .select('submission_id, ronda, grupo_numero')
      .eq('event_day', eventDay)
      .range(from, from + SELECT_PAGE - 1)

    if (error) {
      console.error('fetch perrenque_grupo_ronda:', error)
      throw error
    }
    if (!data?.length) break
    out.push(...(data as { submission_id: string; ronda: number; grupo_numero: number }[]))
    if (data.length < SELECT_PAGE) break
    from += SELECT_PAGE
  }
  return out
}

async function fetchPairsFromAssignments(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  eventDay: PerrenqueEventDay
): Promise<Set<string>> {
  const rows = await fetchAllGrupoRondaRows(supabase, eventDay)
  const byKey = new Map<string, string[]>()
  for (const row of rows) {
    const key = `${row.ronda}:${row.grupo_numero}`
    if (!byKey.has(key)) byKey.set(key, [])
    byKey.get(key)!.push(row.submission_id)
  }
  const pairs = new Set<string>()
  for (const members of byKey.values()) {
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        pairs.add(pairKey(members[i]!, members[j]!))
      }
    }
  }
  return pairs
}

function submissionIdsFullyAssigned(
  rows: { submission_id: string; ronda: number }[],
  eventDay: PerrenqueEventDay
): Set<string> {
  void eventDay
  const m = new Map<string, Set<number>>()
  for (const row of rows) {
    if (!m.has(row.submission_id)) m.set(row.submission_id, new Set())
    m.get(row.submission_id)!.add(row.ronda)
  }
  const complete = new Set<string>()
  for (const [id, s] of m) {
    if (s.has(1) && s.has(2)) complete.add(id)
  }
  return complete
}

async function maxGrupoNumero(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  ronda: number,
  eventDay: PerrenqueEventDay
): Promise<number> {
  const { data } = await supabase
    .from('perrenque_grupo_ronda')
    .select('grupo_numero')
    .eq('ronda', ronda)
    .eq('event_day', eventDay)
    .order('grupo_numero', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data?.grupo_numero ?? 0
}

async function deleteAssignmentsForSubmissions(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  submissionIds: string[],
  eventDay: PerrenqueEventDay
) {
  if (submissionIds.length === 0) return
  for (let i = 0; i < submissionIds.length; i += DELETE_IN_CHUNK) {
    const part = submissionIds.slice(i, i + DELETE_IN_CHUNK)
    await supabase
      .from('match_perrenque')
      .delete()
      .eq('event_day', eventDay)
      .in('submission_id', part)
    await supabase
      .from('match_perrenque')
      .delete()
      .eq('event_day', eventDay)
      .in('matched_submission_id', part)
    await supabase
      .from('perrenque_grupo_ronda')
      .delete()
      .eq('event_day', eventDay)
      .in('submission_id', part)
  }
}

async function insertChunks<T extends Record<string, unknown>>(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  table: 'perrenque_grupo_ronda' | 'match_perrenque',
  rows: T[]
): Promise<{ error: Error | null }> {
  for (let i = 0; i < rows.length; i += INSERT_CHUNK) {
    const chunk = rows.slice(i, i + INSERT_CHUNK) as T[]
    const { error } = await supabase.from(table).insert(chunk as never)
    if (error) return { error: new Error(error.message) }
  }
  return { error: null }
}

function maxMapKey(m: Map<number, string[]>): number {
  let mx = 0
  for (const k of m.keys()) if (k > mx) mx = k
  return mx
}

function findGrupoNumForMember(memberId: string, m: Map<number, string[]>): number {
  for (const [num, members] of m) {
    if (members.includes(memberId)) return num
  }
  return -1
}

type GrupoInsert = {
  submission_id: string
  ronda: number
  grupo_numero: number
  event_day: number
}

type MatchInsert = {
  submission_id: string
  matched_submission_id: string
  ronda: number
  razon: string
  event_day: number
}

function buildMatchEdgesForGroups(
  groups: string[][],
  ronda: number,
  eventDay: PerrenqueEventDay,
  newcomerSet: Set<string> | null
): MatchInsert[] {
  const rows: MatchInsert[] = []
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
        razon: DEFAULT_RAZON,
        event_day: eventDay,
      })
    }
    if (!edge.has(k2)) {
      edge.add(k2)
      rows.push({
        submission_id: b,
        matched_submission_id: a,
        ronda,
        razon: DEFAULT_RAZON,
        event_day: eventDay,
      })
    }
  }

  for (const g of groups) {
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        const a = g[i]!
        const b = g[j]!
        if (newcomerSet && !newcomerSet.has(a) && !newcomerSet.has(b)) continue
        pushBi(a, b)
      }
    }
  }
  return rows
}

function buildGrupoRowsFromPartition(
  groups: string[][],
  ronda: number,
  baseNum: number,
  eventDay: PerrenqueEventDay
): GrupoInsert[] {
  const rows: GrupoInsert[] = []
  for (let gi = 0; gi < groups.length; gi++) {
    const num = gi + 1 + baseNum
    for (const sid of groups[gi]!) {
      rows.push({ submission_id: sid, ronda, grupo_numero: num, event_day: eventDay })
    }
  }
  return rows
}

export type RecomputePerrenqueResult = {
  ok: boolean
  mode: RecomputeMode
  eventDay: PerrenqueEventDay
  matchDay2: boolean
  profileCount: number
  alreadyAssignedCount: number
  processedCount: number
  groqAttempted: boolean
  groqPartitionOk: boolean
  usedFallback: boolean
  grupoRowsWritten: number
  matchRowsWritten: number
  messages: string[]
}

export async function recomputePerrenqueMatches(
  options: RecomputeOptions = {}
): Promise<RecomputePerrenqueResult> {
  const matchDay2 = Boolean(options.matchDay2)
  const eventDay: PerrenqueEventDay = matchDay2 ? 2 : (options.eventDay ?? getPerrenqueEventDay())
  const mode: RecomputeMode = options.mode ?? 'incremental'

  const messages: string[] = []
  const fail = (
    extra?: Partial<Omit<RecomputePerrenqueResult, 'ok' | 'messages'>>
  ): RecomputePerrenqueResult => {
    const e = extra ?? {}
    return {
      ok: false,
      mode,
      eventDay,
      matchDay2,
      profileCount: e.profileCount ?? 0,
      alreadyAssignedCount: e.alreadyAssignedCount ?? 0,
      processedCount: e.processedCount ?? 0,
      groqAttempted: false,
      groqPartitionOk: false,
      usedFallback: e.usedFallback ?? false,
      grupoRowsWritten: e.grupoRowsWritten ?? 0,
      matchRowsWritten: e.matchRowsWritten ?? 0,
      messages: [...messages],
    }
  }

  const supabase = createAdminClient()
  if (!supabase) {
    messages.push('Sin cliente admin: revisa NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.')
    return fail({})
  }

  const { data: rows, error } = await supabase
    .from('perrenque_conecta_submissions')
    .select('id, nombre_completo, identidad, motivacion, mundo, valor_humano, created_at')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('recomputePerrenqueMatches fetch:', error)
    messages.push(`Error leyendo inscritos: ${error.message}`)
    return fail({ profileCount: 0 })
  }

  const profiles = (rows ?? []) as Profile[]
  const ids = profiles.map((p) => p.id)
  const profileCount = ids.length

  if (matchDay2) {
    return runMatchDay2Flow({
      supabase,
      profiles,
      ids,
      profileCount,
      messages,
      fail,
      mode,
    })
  }

  if (ids.length < 2) {
    if (mode === 'full') {
      await clearMatchingTablesForDay(supabase, eventDay)
      messages.push(
        'Menos de 2 inscritos: tablas de match vaciadas para este día. No hay asignaciones hasta el segundo registro.'
      )
    } else {
      messages.push('Menos de 2 inscritos: no hay asignaciones incrementales posibles.')
    }
    return {
      ok: true,
      mode,
      eventDay,
      matchDay2: false,
      profileCount: ids.length,
      alreadyAssignedCount: 0,
      processedCount: 0,
      groqAttempted: false,
      groqPartitionOk: false,
      usedFallback: false,
      grupoRowsWritten: 0,
      matchRowsWritten: 0,
      messages,
    }
  }

  if (mode === 'full') {
    await clearMatchingTablesForDay(supabase, eventDay)
    messages.push(`Modo completo: se vaciaron grupos y matches del día ${eventDay}.`)
    return runFullPartitionFlow({
      supabase,
      profiles,
      ids,
      profileCount,
      eventDay,
      messages,
      fail,
      mode,
      alreadyAssignedCount: 0,
      usedFallbackHint: false,
    })
  }

  /* incremental */
  let grupoRowsDb: { submission_id: string; ronda: number }[] = []
  try {
    grupoRowsDb = await fetchAllGrupoRondaRows(supabase, eventDay)
  } catch {
    return fail({ profileCount })
  }

  const assigned = submissionIdsFullyAssigned(grupoRowsDb, eventDay)
  const unassignedIds = ids.filter((id) => !assigned.has(id))
  const alreadyAssignedCount = profileCount - unassignedIds.length

  if (unassignedIds.length === 0) {
    messages.push(
      `Incremental (día ${eventDay}): los ${profileCount} inscritos ya tienen grupo en ronda 1 y 2.`
    )
    return {
      ok: true,
      mode,
      eventDay,
      matchDay2: false,
      profileCount,
      alreadyAssignedCount,
      processedCount: 0,
      groqAttempted: false,
      groqPartitionOk: false,
      usedFallback: false,
      grupoRowsWritten: 0,
      matchRowsWritten: 0,
      messages,
    }
  }

  await deleteAssignmentsForSubmissions(supabase, unassignedIds, eventDay)

  let rowsAfter: { submission_id: string; ronda: number; grupo_numero: number }[] = []
  try {
    rowsAfter = await fetchAllGrupoRondaRows(supabase, eventDay)
  } catch {
    return fail({ profileCount })
  }

  const r1Map = new Map<number, string[]>()
  const r2Map = new Map<number, string[]>()
  for (const row of rowsAfter) {
    const m = row.ronda === 1 ? r1Map : r2Map
    if (!m.has(row.grupo_numero)) m.set(row.grupo_numero, [])
    m.get(row.grupo_numero)!.push(row.submission_id)
  }

  const newcomerSet = new Set(unassignedIds)
  const newcomersOrdered = profiles.filter((p) => unassignedIds.includes(p.id))

  for (const p of newcomersOrdered) {
    const u = p.id
    const incomplete = [...r1Map.entries()]
      .filter(([, members]) => members.length > 0 && members.length < 5)
      .sort((a, b) => a[0] - b[0])
    let placed = false
    for (const [, members] of incomplete) {
      if (members.length < 5) {
        members.push(u)
        placed = true
        break
      }
    }
    if (!placed) {
      const nn = maxMapKey(r1Map) + 1
      r1Map.set(nn, [u])
    }
  }

  // Actualizar pares R1 tras incorporar recién llegados
  const metR1After = pairsMetInGroups([...r1Map.values()].filter((g) => g.length > 0))

  for (const p of newcomersOrdered) {
    const u = p.id
    const incompleteR2 = [...r2Map.entries()]
      .filter(([, members]) => members.length > 0 && members.length < 5)
      .sort((a, b) => a[0] - b[0])
    let placed = false
    for (const [, members] of incompleteR2) {
      if (members.length >= 5) continue
      let ok = true
      for (const v of members) {
        if (metR1After.has(pairKey(u, v))) {
          ok = false
          break
        }
      }
      if (ok) {
        members.push(u)
        placed = true
        break
      }
    }
    if (!placed) {
      const nn = maxMapKey(r2Map) + 1
      r2Map.set(nn, [u])
    }
  }

  const r1Arrays = [...r1Map.entries()].sort((a, b) => a[0] - b[0]).map(([, g]) => g)
  const r2Arrays = [...r2Map.entries()].sort((a, b) => a[0] - b[0]).map(([, g]) => g)

  const grupoRows: GrupoInsert[] = []
  for (const p of newcomersOrdered) {
    const u = p.id
    const n1 = findGrupoNumForMember(u, r1Map)
    const n2 = findGrupoNumForMember(u, r2Map)
    if (n1 < 0 || n2 < 0) {
      messages.push(`Error ubicando grupo para ${u}`)
      return fail({
        profileCount,
        alreadyAssignedCount,
        processedCount: unassignedIds.length,
      })
    }
    grupoRows.push({ submission_id: u, ronda: 1, grupo_numero: n1, event_day: eventDay })
    grupoRows.push({ submission_id: u, ronda: 2, grupo_numero: n2, event_day: eventDay })
  }

  const matchRows: MatchInsert[] = [
    ...buildMatchEdgesForGroups(r1Arrays, 1, eventDay, newcomerSet),
    ...buildMatchEdgesForGroups(r2Arrays, 2, eventDay, newcomerSet),
  ]

  messages.push(
    `Incremental (día ${eventDay}): ${unassignedIds.length} inscritos ubicados en cupos abiertos o grupos nuevos; ${alreadyAssignedCount} ya estaban completos.`
  )
  messages.push(
    'Ronda 2 (recién llegados): sin repetir pareja de la misma persona ya asignada en ronda 1 (mismo día).'
  )

  let grupoRowsWritten = 0
  let matchRowsWritten = 0
  let insertFailed = false

  if (grupoRows.length) {
    const { error: e1 } = await insertChunks(supabase, 'perrenque_grupo_ronda', grupoRows)
    if (e1) {
      console.error('insert perrenque_grupo_ronda:', e1)
      messages.push(`insert perrenque_grupo_ronda: ${e1.message}`)
      insertFailed = true
    } else grupoRowsWritten = grupoRows.length
  }
  if (matchRows.length && !insertFailed) {
    const { error: e2 } = await insertChunks(supabase, 'match_perrenque', matchRows)
    if (e2) {
      console.error('insert match_perrenque:', e2)
      messages.push(`insert match_perrenque: ${e2.message}`)
      insertFailed = true
    } else matchRowsWritten = matchRows.length
  }

  if (insertFailed) {
    return fail({
      profileCount,
      alreadyAssignedCount,
      processedCount: unassignedIds.length,
      grupoRowsWritten,
      matchRowsWritten,
    })
  }

  return {
    ok: true,
    mode,
    eventDay,
    matchDay2: false,
    profileCount,
    alreadyAssignedCount,
    processedCount: unassignedIds.length,
    groqAttempted: false,
    groqPartitionOk: false,
    usedFallback: false,
    grupoRowsWritten,
    matchRowsWritten,
    messages,
  }
}

async function runFullPartitionFlow(opts: {
  supabase: NonNullable<ReturnType<typeof createAdminClient>>
  profiles: Profile[]
  ids: string[]
  profileCount: number
  eventDay: PerrenqueEventDay
  messages: string[]
  fail: (extra?: Partial<RecomputePerrenqueResult>) => RecomputePerrenqueResult
  mode: RecomputeMode
  alreadyAssignedCount: number
  usedFallbackHint: boolean
}): Promise<RecomputePerrenqueResult> {
  const {
    supabase,
    profiles,
    ids,
    profileCount,
    eventDay,
    messages,
    fail,
    mode,
    alreadyAssignedCount,
  } = opts

  let usedFallback = opts.usedFallbackHint
  const r1 = buildGroups532(profiles, messages)
  usedFallback = usedFallback || messages.some((m) => m.includes('relajar'))

  const pairsR1 = pairsMetInGroups(r1)
  const r2Built = buildRound2AvoidingPairs(r1, pairsR1)

  if (!validatePartition(ids, r2Built)) {
    messages.push('Error: partición ronda 2 inválida.')
    return fail({
      profileCount,
      alreadyAssignedCount,
      processedCount: ids.length,
      usedFallback,
    })
  }
  if (r2ViolatesForbidden(r2Built, pairsR1)) {
    messages.push('Error: ronda 2 repite parejas de ronda 1.')
    return fail({
      profileCount,
      alreadyAssignedCount,
      processedCount: ids.length,
      usedFallback,
    })
  }

  messages.push(
    'Matching sin IA: grupos de hasta 5 con regla 3+2 por identidad cuando es posible; ronda 2 sin repetir parejas de ronda 1.'
  )

  const baseR1 = 0
  const baseR2 = 0
  const grupoRows: GrupoInsert[] = [
    ...buildGrupoRowsFromPartition(r1, 1, baseR1, eventDay),
    ...buildGrupoRowsFromPartition(r2Built, 2, baseR2, eventDay),
  ]
  const newcomerAll = new Set(ids)
  const matchRows: MatchInsert[] = [
    ...buildMatchEdgesForGroups(r1, 1, eventDay, newcomerAll),
    ...buildMatchEdgesForGroups(r2Built, 2, eventDay, newcomerAll),
  ]

  let grupoRowsWritten = 0
  let matchRowsWritten = 0
  let insertFailed = false

  if (grupoRows.length) {
    const { error: e1 } = await insertChunks(supabase, 'perrenque_grupo_ronda', grupoRows)
    if (e1) {
      console.error('insert perrenque_grupo_ronda:', e1)
      messages.push(`insert perrenque_grupo_ronda: ${e1.message}`)
      insertFailed = true
    } else grupoRowsWritten = grupoRows.length
  }
  if (matchRows.length && !insertFailed) {
    const { error: e2 } = await insertChunks(supabase, 'match_perrenque', matchRows)
    if (e2) {
      console.error('insert match_perrenque:', e2)
      messages.push(`insert match_perrenque: ${e2.message}`)
      insertFailed = true
    } else matchRowsWritten = matchRows.length
  }

  if (insertFailed) {
    return fail({
      profileCount,
      alreadyAssignedCount,
      processedCount: ids.length,
      usedFallback,
      grupoRowsWritten,
      matchRowsWritten,
    })
  }

  return {
    ok: true,
    mode,
    eventDay,
    matchDay2: false,
    profileCount,
    alreadyAssignedCount,
    processedCount: ids.length,
    groqAttempted: false,
    groqPartitionOk: false,
    usedFallback,
    grupoRowsWritten,
    matchRowsWritten,
    messages,
  }
}

async function runMatchDay2Flow(opts: {
  supabase: NonNullable<ReturnType<typeof createAdminClient>>
  profiles: Profile[]
  ids: string[]
  profileCount: number
  messages: string[]
  fail: (extra?: Partial<RecomputePerrenqueResult>) => RecomputePerrenqueResult
  mode: RecomputeMode
}): Promise<RecomputePerrenqueResult> {
  const { supabase, profiles, ids, profileCount, messages, fail, mode } = opts
  const eventDay: PerrenqueEventDay = 2

  if (ids.length < 2) {
    messages.push('Menos de 2 inscritos: no hay matching día 2 posible.')
    return {
      ok: true,
      mode,
      eventDay,
      matchDay2: true,
      profileCount,
      alreadyAssignedCount: 0,
      processedCount: 0,
      groqAttempted: false,
      groqPartitionOk: false,
      usedFallback: false,
      grupoRowsWritten: 0,
      matchRowsWritten: 0,
      messages,
    }
  }

  let forbiddenDay1: Set<string>
  try {
    forbiddenDay1 = await fetchPairsFromAssignments(supabase, 1)
  } catch {
    return fail({ profileCount, matchDay2: true, eventDay })
  }

  await clearMatchingTablesForDay(supabase, 2)
  messages.push(
    'Matching día 2: se vaciaron asignaciones del día 2 y se generaron grupos nuevos para toda la cohorte.'
  )

  const r1 = buildGroups532Day2(profiles, forbiddenDay1, messages)
  const metR1d2 = pairsMetInGroups(r1)
  const forbiddenR2 = new Set<string>([...forbiddenDay1, ...metR1d2])
  const r2 = buildRound2AvoidingPairs(r1, forbiddenR2)

  let usedFallback =
    messages.some((m) => m.includes('relaja')) || messages.some((m) => m.includes('sin solapamiento'))

  if (!validatePartition(ids, r2)) {
    messages.push('Error: partición ronda 2 inválida (día 2).')
    return fail({
      profileCount,
      alreadyAssignedCount: 0,
      processedCount: ids.length,
      matchDay2: true,
      eventDay,
      usedFallback,
    })
  }
  if (r2ViolatesForbidden(r2, forbiddenR2)) {
    messages.push(
      'Advertencia: ronda 2 día 2 no cumple al 100% el aislamiento de parejas día 1 + ronda 1; revisa tamaños de grupo.'
    )
    usedFallback = true
  }

  messages.push(
    'Ronda 2 (día 2): se evitan parejas que ya compartieron grupo el día 1 y las de la ronda 1 del mismo día 2.'
  )

  const grupoRows: GrupoInsert[] = [
    ...buildGrupoRowsFromPartition(r1, 1, 0, eventDay),
    ...buildGrupoRowsFromPartition(r2, 2, 0, eventDay),
  ]
  const allNewcomers = new Set(ids)
  const matchRows: MatchInsert[] = [
    ...buildMatchEdgesForGroups(r1, 1, eventDay, allNewcomers),
    ...buildMatchEdgesForGroups(r2, 2, eventDay, allNewcomers),
  ]

  let grupoRowsWritten = 0
  let matchRowsWritten = 0
  let insertFailed = false

  if (grupoRows.length) {
    const { error: e1 } = await insertChunks(supabase, 'perrenque_grupo_ronda', grupoRows)
    if (e1) {
      console.error('insert perrenque_grupo_ronda:', e1)
      messages.push(`insert perrenque_grupo_ronda: ${e1.message}`)
      insertFailed = true
    } else grupoRowsWritten = grupoRows.length
  }
  if (matchRows.length && !insertFailed) {
    const { error: e2 } = await insertChunks(supabase, 'match_perrenque', matchRows)
    if (e2) {
      console.error('insert match_perrenque:', e2)
      messages.push(`insert match_perrenque: ${e2.message}`)
      insertFailed = true
    } else matchRowsWritten = matchRows.length
  }

  if (insertFailed) {
    return fail({
      profileCount,
      alreadyAssignedCount: 0,
      processedCount: ids.length,
      matchDay2: true,
      eventDay,
      usedFallback,
      grupoRowsWritten,
      matchRowsWritten,
    })
  }

  return {
    ok: true,
    mode,
    eventDay,
    matchDay2: true,
    profileCount,
    alreadyAssignedCount: 0,
    processedCount: ids.length,
    groqAttempted: false,
    groqPartitionOk: false,
    usedFallback,
    grupoRowsWritten,
    matchRowsWritten,
    messages,
  }
}

/** Vacía todo el día actual en env y vuelve a calcular (casos excepcionales). */
export async function recomputePerrenqueMatchesFull(): Promise<RecomputePerrenqueResult> {
  return recomputePerrenqueMatches({ mode: 'full' })
}
