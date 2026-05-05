/**
 * Recomputa grupos y matches para perrenque_conecta_submissions.
 * - incremental (por defecto): solo quienes aún no tienen fila en ronda 1 y 2; no toca grupos existentes.
 * - full: vacía tablas y vuelve a armar todo (p. ej. corrección masiva).
 * Groq solo para el lote que se procesa y si ese lote tiene entre 2 y 40 personas (~800 totales ⇒ casi siempre reparto local).
 */

import { createAdminClient } from '@/utils/supabase/admin'

const DEFAULT_RAZON =
  'Conexión sugerida para esta ronda según tu perfil en Perrenque Creativo.'

const GROQ_MAX_COHORT = 40
const INSERT_CHUNK = 400
const SELECT_PAGE = 1000
const DELETE_IN_CHUNK = 100

export type RecomputeMode = 'incremental' | 'full'

export type RecomputeOptions = {
  mode?: RecomputeMode
}

interface Profile {
  id: string
  nombre_completo: string
  identidad: string
  motivacion: string
  mundo: string
  valor_humano: string
}

interface GroqGrupoResponse {
  grupos_ronda1: string[][]
  grupos_ronda2?: string[][]
  razones?: Array<{
    viewer: string
    matched: string
    ronda: 1 | 2
    texto: string
  }>
}

/** Parte en bloques y evita un grupo de 1 persona (une la “sobra” al penúltimo). */
function chunkGroupsAvoidSingleton(ids: string[], targetSize: number): string[][] {
  if (ids.length === 0) return []
  const size = Math.min(Math.max(2, targetSize), ids.length)
  const groups: string[][] = []
  for (let i = 0; i < ids.length; i += size) {
    groups.push(ids.slice(i, i + size))
  }
  if (groups.length >= 2 && groups[groups.length - 1]!.length === 1) {
    const orphan = groups.pop()!
    groups[groups.length - 1]!.push(orphan[0]!)
  }
  return groups
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
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

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

function pairsMetInRound1(r1: string[][]): Set<string> {
  const set = new Set<string>()
  for (const g of r1) {
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        set.add(pairKey(g[i]!, g[j]!))
      }
    }
  }
  return set
}

function canAddToGroup(id: string, group: string[], met: Set<string>): boolean {
  for (const x of group) {
    if (met.has(pairKey(id, x))) return false
  }
  return true
}

function buildR2AvoidingR1(r1: string[][]): string[][] {
  const met = pairsMetInRound1(r1)
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
        if (canAddToGroup(s, gr, met)) {
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
    const idx = singles.findIndex((b) => !met.has(pairKey(a, b)))
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

function r2RepeatsR1Pairs(r1: string[][], r2: string[][]): boolean {
  const met = pairsMetInRound1(r1)
  for (const g of r2) {
    for (let i = 0; i < g.length; i++) {
      for (let j = i + 1; j < g.length; j++) {
        if (met.has(pairKey(g[i]!, g[j]!))) return true
      }
    }
  }
  return false
}

function fallbackR1(ids: string[]): string[][] {
  const n = ids.length
  if (n <= 2) return [[...ids]]
  if (n === 3) return [[ids[0]!, ids[1]!], [ids[2]!]]
  if (n === 4) return [[ids[0]!, ids[1]!], [ids[2]!, ids[3]!]]
  if (n === 5) return [[ids[0]!, ids[1]!, ids[2]!], [ids[3]!, ids[4]!]]
  const targetSize = n >= 10 ? 4 : 3
  return chunkGroupsAvoidSingleton([...ids], targetSize)
}

async function callGroqForGroups(profiles: Profile[]): Promise<GroqGrupoResponse | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || profiles.length < 2) return null

  const payload = profiles.map((p) => ({
    id: p.id,
    nombre: p.nombre_completo,
    identidad: p.identidad,
    motivacion: p.motivacion,
    mundo: p.mundo,
    valor: p.valor_humano.slice(0, 200),
  }))

  const prompt = `Eres el organizador de grupos de networking para "Perrenque Creativo".
Participantes:
${JSON.stringify(payload)}

Reglas (solo ronda 1):
- Parte en grupos de 3 a 5 personas (o 2 si hay pocos). Cada id debe aparecer exactamente una vez en grupos_ronda1.
- La ronda 2 se calcula en el servidor: nadie vuelve a quedar en el mismo equipo que alguien con quien compartió grupo en ronda 1.
- Usa solo los UUID listados en "id".
Devuelve SOLO JSON válido, sin markdown:
{"grupos_ronda1":[["uuid",...],...],"razones":[{"viewer":"uuid","matched":"uuid","ronda":1,"texto":"frase corta es"}]}

Opcional "razones": máximo 20 pares viewer/matched del mismo grupo, ronda 1.`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4096,
        temperature: 0.35,
      }),
    })
    if (!response.ok) {
      const errText = await response.text().catch(() => '')
      console.error('Groq perrenque:', response.status, errText.slice(0, 500))
      return null
    }
    const data = (await response.json()) as { choices: Array<{ message: { content: string } }> }
    let text = data.choices[0]?.message?.content?.trim() ?? ''
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '')
    const parsed = JSON.parse(text) as GroqGrupoResponse
    return parsed
  } catch (e) {
    console.error('recomputePerrenqueMatches Groq parse:', e)
    return null
  }
}

async function clearMatchingTables(supabase: NonNullable<ReturnType<typeof createAdminClient>>) {
  await supabase
    .from('match_perrenque')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase
    .from('perrenque_grupo_ronda')
    .delete()
    .neq('submission_id', '00000000-0000-0000-0000-000000000000')
}

async function fetchAllGrupoRondaRows(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>
): Promise<{ submission_id: string; ronda: number }[]> {
  const out: { submission_id: string; ronda: number }[] = []
  let from = 0
  for (;;) {
    const { data, error } = await supabase
      .from('perrenque_grupo_ronda')
      .select('submission_id, ronda')
      .range(from, from + SELECT_PAGE - 1)

    if (error) {
      console.error('fetch perrenque_grupo_ronda:', error)
      throw error
    }
    if (!data?.length) break
    out.push(...(data as { submission_id: string; ronda: number }[]))
    if (data.length < SELECT_PAGE) break
    from += SELECT_PAGE
  }
  return out
}

function submissionIdsFullyAssigned(
  rows: { submission_id: string; ronda: number }[]
): Set<string> {
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
  ronda: number
): Promise<number> {
  const { data } = await supabase
    .from('perrenque_grupo_ronda')
    .select('grupo_numero')
    .eq('ronda', ronda)
    .order('grupo_numero', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data?.grupo_numero ?? 0
}

async function deleteAssignmentsForSubmissions(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
  submissionIds: string[]
) {
  if (submissionIds.length === 0) return
  for (let i = 0; i < submissionIds.length; i += DELETE_IN_CHUNK) {
    const part = submissionIds.slice(i, i + DELETE_IN_CHUNK)
    await supabase.from('match_perrenque').delete().in('submission_id', part)
    await supabase.from('match_perrenque').delete().in('matched_submission_id', part)
    await supabase.from('perrenque_grupo_ronda').delete().in('submission_id', part)
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

export type RecomputePerrenqueResult = {
  ok: boolean
  mode: RecomputeMode
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
  const mode: RecomputeMode = options.mode ?? 'incremental'
  const messages: string[] = []
  const fail = (
    extra: Partial<Omit<RecomputePerrenqueResult, 'ok' | 'messages'>>
  ): RecomputePerrenqueResult => ({
    ok: false,
    mode,
    profileCount: extra.profileCount ?? 0,
    alreadyAssignedCount: extra.alreadyAssignedCount ?? 0,
    processedCount: extra.processedCount ?? 0,
    groqAttempted: extra.groqAttempted ?? false,
    groqPartitionOk: extra.groqPartitionOk ?? false,
    usedFallback: extra.usedFallback ?? false,
    grupoRowsWritten: extra.grupoRowsWritten ?? 0,
    matchRowsWritten: extra.matchRowsWritten ?? 0,
    messages: [...messages],
  })

  const supabase = createAdminClient()
  if (!supabase) {
    messages.push('Sin cliente admin: revisa NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.')
    return fail({})
  }

  const { data: rows, error } = await supabase
    .from('perrenque_conecta_submissions')
    .select('id, nombre_completo, identidad, motivacion, mundo, valor_humano')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('recomputePerrenqueMatches fetch:', error)
    messages.push(`Error leyendo inscritos: ${error.message}`)
    return fail({ profileCount: 0 })
  }

  const profiles = (rows ?? []) as Profile[]
  const ids = profiles.map((p) => p.id)
  const profileCount = ids.length

  if (mode === 'full') {
    await clearMatchingTables(supabase)
    messages.push('Modo completo: se vaciaron grupos y matches previos.')
  }

  if (ids.length < 2) {
    if (mode === 'full') {
      messages.push(
        'Menos de 2 inscritos: tablas de match vaciadas. No hay pares posibles hasta el segundo registro.'
      )
    } else {
      messages.push('Menos de 2 inscritos: no hay asignaciones incrementales posibles.')
    }
    return {
      ok: true,
      mode,
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

  let targetIds: string[]
  let targetProfiles: Profile[]
  let baseGrupoR1 = 0
  let baseGrupoR2 = 0
  let alreadyAssignedCount = 0

  if (mode === 'full') {
    targetIds = [...ids]
    targetProfiles = [...profiles]
    alreadyAssignedCount = 0
  } else {
    let grupoRowsDb: { submission_id: string; ronda: number }[] = []
    try {
      grupoRowsDb = await fetchAllGrupoRondaRows(supabase)
    } catch {
      return fail({ profileCount })
    }
    const assigned = submissionIdsFullyAssigned(grupoRowsDb)
    const unassigned = ids.filter((id) => !assigned.has(id))
    alreadyAssignedCount = profileCount - unassigned.length

    if (unassigned.length === 0) {
      messages.push(
        `Incremental: los ${profileCount} inscritos ya tienen grupo en ronda 1 y 2. Nada que hacer.`
      )
      return {
        ok: true,
        mode,
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

    await deleteAssignmentsForSubmissions(supabase, unassigned)
    baseGrupoR1 = await maxGrupoNumero(supabase, 1)
    baseGrupoR2 = await maxGrupoNumero(supabase, 2)

    targetIds = unassigned
    targetProfiles = profiles.filter((p) => unassigned.includes(p.id))
    messages.push(
      `Incremental: ${unassigned.length} inscritos sin grupo completo; ${alreadyAssignedCount} ya asignados no se modifican. Nuevos números de grupo empiezan en ${baseGrupoR1 + 1} (r1) y ${baseGrupoR2 + 1} (r2).`
    )
  }

  const processedCount = targetIds.length

  if (processedCount < 1) {
    messages.push('Nada que procesar.')
    return {
      ok: true,
      mode,
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

  let r1: string[][] = []
  let r2: string[][] = []
  let razones: GroqGrupoResponse['razones'] = []

  const groqAttempted =
    targetProfiles.length >= 2 &&
    targetProfiles.length <= GROQ_MAX_COHORT &&
    Boolean(process.env.GROQ_API_KEY?.trim())
  const groq = groqAttempted ? await callGroqForGroups(targetProfiles) : null

  let groqPartitionOk = Boolean(
    groq?.grupos_ronda1?.length && validatePartition(targetIds, groq.grupos_ronda1)
  )

  if (groqAttempted && !groqPartitionOk) {
    messages.push(
      groq
        ? 'Groq respondió pero la partición no es válida (o JSON inválido); se usa reparto local.'
        : 'Groq no disponible (error HTTP, parse o sin respuesta); se usa reparto local.'
    )
  }

  if (targetProfiles.length > GROQ_MAX_COHORT && process.env.GROQ_API_KEY?.trim()) {
    messages.push(
      `Este lote tiene ${targetProfiles.length} personas (> ${GROQ_MAX_COHORT}): se usa solo reparto local (escala evento grande).`
    )
  }

  if (groqPartitionOk && groq) {
    r1 = groq.grupos_ronda1
    razones = groq.razones ?? []
    messages.push('Grupos de ronda 1 desde Groq.')
  }

  const usedFallback = !groqPartitionOk
  if (!r1.length) {
    r1 = fallbackR1(targetIds)
    if (usedFallback) {
      messages.push(
        'Reparto local (ronda 1): bloques 3–4 en cohortes grandes; reglas especiales si el lote es pequeño.'
      )
    }
  }

  r2 = buildR2AvoidingR1(r1)
  if (!validatePartition(targetIds, r2)) {
    messages.push('Error: partición ronda 2 inválida tras generar sin repeticiones.')
    return fail({
      profileCount,
      alreadyAssignedCount,
      processedCount,
      groqAttempted,
      groqPartitionOk,
      usedFallback,
    })
  }
  if (r2RepeatsR1Pairs(r1, r2)) {
    messages.push('Inconsistencia: se detectaron pares repetidos entre rondas (revisar lógica).')
    return fail({
      profileCount,
      alreadyAssignedCount,
      processedCount,
      groqAttempted,
      groqPartitionOk,
      usedFallback,
    })
  }
  messages.push(
    'Ronda 2: nadie comparte grupo en esta cohorte con quien ya compartió grupo en ronda 1 (solo entre los recién asignados; incremental no mezcla con antiguos).'
  )

  const razonMap = new Map<string, string>()
  for (const r of razones ?? []) {
    if (!r?.viewer || !r?.matched) continue
    razonMap.set(`${r.viewer}|${r.matched}|${r.ronda}`, r.texto.slice(0, 500))
  }

  const grupoRows: { submission_id: string; ronda: number; grupo_numero: number }[] = []
  const matchRows: { submission_id: string; matched_submission_id: string; ronda: number; razon: string }[] =
    []

  for (let gi = 0; gi < r1.length; gi++) {
    const g = r1[gi]!
    const num = gi + 1 + baseGrupoR1
    for (const sid of g) {
      grupoRows.push({ submission_id: sid, ronda: 1, grupo_numero: num })
      for (const other of g) {
        if (other === sid) continue
        const rx =
          razonMap.get(`${sid}|${other}|1`) ?? razonMap.get(`${other}|${sid}|1`) ?? DEFAULT_RAZON
        matchRows.push({ submission_id: sid, matched_submission_id: other, ronda: 1, razon: rx })
      }
    }
  }

  for (let gi = 0; gi < r2.length; gi++) {
    const g = r2[gi]!
    const num = gi + 1 + baseGrupoR2
    for (const sid of g) {
      grupoRows.push({ submission_id: sid, ronda: 2, grupo_numero: num })
      for (const other of g) {
        if (other === sid) continue
        const rx =
          razonMap.get(`${sid}|${other}|2`) ?? razonMap.get(`${other}|${sid}|2`) ?? DEFAULT_RAZON
        matchRows.push({ submission_id: sid, matched_submission_id: other, ronda: 2, razon: rx })
      }
    }
  }

  let grupoRowsWritten = 0
  let matchRowsWritten = 0
  let insertFailed = false

  if (grupoRows.length) {
    const { error: e1 } = await insertChunks(supabase, 'perrenque_grupo_ronda', grupoRows)
    if (e1) {
      console.error('insert perrenque_grupo_ronda:', e1)
      messages.push(`insert perrenque_grupo_ronda: ${e1.message}`)
      insertFailed = true
    } else {
      grupoRowsWritten = grupoRows.length
    }
  }
  if (matchRows.length && !insertFailed) {
    const { error: e2 } = await insertChunks(supabase, 'match_perrenque', matchRows)
    if (e2) {
      console.error('insert match_perrenque:', e2)
      messages.push(`insert match_perrenque: ${e2.message}`)
      insertFailed = true
    } else {
      matchRowsWritten = matchRows.length
    }
  }

  console.info(
    '[perrenque-match]',
    JSON.stringify({
      mode,
      profileCount,
      processedCount,
      groqAttempted,
      groqPartitionOk,
      usedFallback,
      grupoRowsWritten,
      matchRowsWritten,
    })
  )

  if (insertFailed) {
    return fail({
      profileCount,
      alreadyAssignedCount,
      processedCount,
      groqAttempted,
      groqPartitionOk,
      usedFallback,
      grupoRowsWritten,
      matchRowsWritten,
    })
  }

  return {
    ok: true,
    mode,
    profileCount,
    alreadyAssignedCount,
    processedCount,
    groqAttempted,
    groqPartitionOk,
    usedFallback,
    grupoRowsWritten,
    matchRowsWritten,
    messages,
  }
}

/** Vacía todo y vuelve a calcular (casos excepcionales). */
export async function recomputePerrenqueMatchesFull(): Promise<RecomputePerrenqueResult> {
  return recomputePerrenqueMatches({ mode: 'full' })
}
