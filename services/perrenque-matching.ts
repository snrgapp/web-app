/**
 * Recomputa grupos y matches para todos los inscritos en perrenque_conecta_submissions.
 * Usa Groq (si GROQ_API_KEY y N <= 40) con fallback por reparto en bloques.
 */

import { createAdminClient } from '@/utils/supabase/admin'

const DEFAULT_RAZON =
  'Conexión sugerida para esta ronda según tu perfil en Perrenque Creativo.'

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
  grupos_ronda2: string[][]
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

function fallbackGroups(ids: string[]): { r1: string[][]; r2: string[][] } {
  // 2–5 personas: un solo grupo (evita 2+1 sin conexiones como pasaba con n=3 y tamaño 2).
  if (ids.length <= 5) {
    return { r1: [[...ids]], r2: [shuffle([...ids])] }
  }
  const targetSize = ids.length >= 10 ? 4 : 3
  const r1 = chunkGroupsAvoidSingleton([...ids], targetSize)
  const r2 = chunkGroupsAvoidSingleton(shuffle([...ids]), targetSize)
  return { r1, r2 }
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

Reglas:
- Parte en grupos de 3 a 5 personas (o 2 si hay pocos). Cada id debe aparecer exactamente una vez en grupos_ronda1 y exactamente una vez en grupos_ronda2.
- En ronda 2 mezcla para que las personas conozcan otros distintos cuando sea posible.
- Usa solo los UUID listados en "id".
Devuelve SOLO JSON válido, sin markdown:
{"grupos_ronda1":[["uuid",...],...],"grupos_ronda2":[["uuid",...],...],"razones":[{"viewer":"uuid","matched":"uuid","ronda":1,"texto":"frase corta es"}]}

Opcional "razones": máximo 20 pares viewer/matched del mismo grupo y misma ronda.`

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

/** Borra matches y asignaciones previas (filtro siempre cierto para filas reales). */
async function clearMatchingTables(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>
) {
  await supabase
    .from('match_perrenque')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase
    .from('perrenque_grupo_ronda')
    .delete()
    .neq('submission_id', '00000000-0000-0000-0000-000000000000')
}

export type RecomputePerrenqueResult = {
  ok: boolean
  profileCount: number
  /** Se intentó llamar a Groq (hay API key y N≤40). */
  groqAttempted: boolean
  /** La respuesta Groq particionó bien todos los ids (si no, se usó fallback). */
  groqPartitionOk: boolean
  usedFallback: boolean
  grupoRowsWritten: number
  matchRowsWritten: number
  messages: string[]
}

export async function recomputePerrenqueMatches(): Promise<RecomputePerrenqueResult> {
  const messages: string[] = []
  const fail = (
    extra: Partial<Omit<RecomputePerrenqueResult, 'ok' | 'messages'>>
  ): RecomputePerrenqueResult => ({
    ok: false,
    profileCount: extra.profileCount ?? 0,
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

  await clearMatchingTables(supabase)

  if (ids.length < 2) {
    messages.push(
      'Menos de 2 inscritos: tablas de match vaciadas. No hay pares posibles hasta el segundo registro.'
    )
    return {
      ok: true,
      profileCount: ids.length,
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

  const groqAttempted = profiles.length <= 40 && Boolean(process.env.GROQ_API_KEY?.trim())
  const groq = groqAttempted ? await callGroqForGroups(profiles) : null

  let groqPartitionOk = Boolean(
    groq?.grupos_ronda1?.length &&
      groq.grupos_ronda2?.length &&
      validatePartition(ids, groq.grupos_ronda1) &&
      validatePartition(ids, groq.grupos_ronda2)
  )

  if (groqAttempted && !groqPartitionOk) {
    messages.push(
      groq
        ? 'Groq respondió pero la partición no es válida (o JSON inválido); se usa reparto local.'
        : 'Groq no disponible (error HTTP, parse o sin respuesta); se usa reparto local.'
    )
  }

  if (groqPartitionOk && groq) {
    r1 = groq.grupos_ronda1
    r2 = groq.grupos_ronda2
    razones = groq.razones ?? []
    messages.push('Partición de grupos tomada desde Groq.')
  }

  const usedFallback = !groqPartitionOk
  if (!r1.length) {
    const fb = fallbackGroups(ids)
    r1 = fb.r1
    r2 = fb.r2
    if (usedFallback) {
      messages.push('Reparto local (fallback): grupos sin solitarios para n≤5; chunk con merge para n>5.')
    }
  }

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
    const num = gi + 1
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
    const num = gi + 1
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
    const { error: e1 } = await supabase.from('perrenque_grupo_ronda').insert(grupoRows)
    if (e1) {
      console.error('insert perrenque_grupo_ronda:', e1)
      messages.push(`insert perrenque_grupo_ronda: ${e1.message}`)
      insertFailed = true
    } else {
      grupoRowsWritten = grupoRows.length
    }
  }
  if (matchRows.length && !insertFailed) {
    const batchSize = 80
    for (let i = 0; i < matchRows.length; i += batchSize) {
      const chunk = matchRows.slice(i, i + batchSize)
      const { error: e2 } = await supabase.from('match_perrenque').insert(chunk)
      if (e2) {
        console.error('insert match_perrenque:', e2)
        messages.push(`insert match_perrenque: ${e2.message}`)
        insertFailed = true
        break
      }
      matchRowsWritten += chunk.length
    }
  }

  console.info(
    '[perrenque-match]',
    JSON.stringify({
      profileCount: ids.length,
      groqAttempted,
      groqPartitionOk,
      usedFallback,
      grupoRowsWritten,
      matchRowsWritten,
    })
  )

  if (insertFailed) {
    return fail({
      profileCount: ids.length,
      groqAttempted,
      groqPartitionOk,
      usedFallback,
      grupoRowsWritten,
      matchRowsWritten,
    })
  }

  return {
    ok: true,
    profileCount: ids.length,
    groqAttempted,
    groqPartitionOk,
    usedFallback,
    grupoRowsWritten,
    matchRowsWritten,
    messages,
  }
}
