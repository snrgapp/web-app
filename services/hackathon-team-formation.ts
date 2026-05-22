/**
 * Formación de equipos del hackathon: union-find por matches mutuos,
 * exclusiones por "pass", tamaños 3–5, anclas por líder/desafío y SMS opcional.
 */

import { createAdminClient } from '@/utils/supabase/admin'
import { getInalambriaBalance } from '@/lib/inalambria'
import { hackathonOnEquipoFormado } from '@/lib/hackathon-eventos'

const FORMACION_RONDA = 1 as const
const MIN_TEAM = 3
const MAX_TEAM = 5

const EQUIPO_NOMBRES = [
  'Equipo Alfa',
  'Equipo Beta',
  'Equipo Gamma',
  'Equipo Delta',
  'Equipo Épsilon',
  'Equipo Zeta',
  'Equipo Eta',
  'Equipo Theta',
  'Equipo Iota',
  'Equipo Kappa',
]

export type HackathonParticipantRow = {
  id: string
  nombre_completo: string
  telefono: string
  perfil: string
}

class UnionFind {
  parent = new Map<string, string>()

  constructor(ids: Iterable<string>) {
    for (const id of ids) this.parent.set(id, id)
  }

  find(x: string): string {
    let p = this.parent.get(x)
    if (!p) {
      this.parent.set(x, x)
      return x
    }
    if (p !== x) {
      const r = this.find(p)
      this.parent.set(x, r)
      return r
    }
    return p
  }

  union(a: string, b: string) {
    const ra = this.find(a)
    const rb = this.find(b)
    if (ra !== rb) this.parent.set(ra, rb)
  }

  clusters(): Map<string, string[]> {
    const m = new Map<string, string[]>()
    for (const id of this.parent.keys()) {
      const r = this.find(id)
      if (!m.has(r)) m.set(r, [])
      m.get(r)!.push(id)
    }
    return m
  }
}

function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

function loadExclusionSet(rows: { from_id: string; to_id: string }[]): Set<string> {
  const s = new Set<string>()
  for (const r of rows) {
    s.add(pairKey(r.from_id, r.to_id))
    // ambas direcciones implícitas en pairKey al comparar
  }
  return s
}

function isExcluded(a: string, b: string, exclusions: Set<string>): boolean {
  return exclusions.has(pairKey(a, b))
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/** Divide un grupo grande en equipos de 3–5 (orden estable por id). */
function splitLargeCluster(
  ids: string[],
  _byId: Map<string, HackathonParticipantRow>
): string[][] {
  const sorted = [...ids].sort((a, b) => a.localeCompare(b))
  const teams: string[][] = []
  let i = 0
  while (i < sorted.length) {
    const rest = sorted.length - i
    let take = Math.min(MAX_TEAM, rest)
    if (rest > MAX_TEAM && rest - take > 0 && rest - take < MIN_TEAM) {
      take = rest - MIN_TEAM
      take = Math.max(MIN_TEAM, Math.min(MAX_TEAM, take))
    }
    if (take <= 0) take = Math.min(MAX_TEAM, rest)
    teams.push(sorted.slice(i, i + take))
    i += take
  }
  const last = teams[teams.length - 1]
  if (last && last.length > 0 && last.length < MIN_TEAM && teams.length >= 2) {
    const prev = teams[teams.length - 2]!
    prev.push(...last)
    teams.pop()
  }
  return teams
}

function teamChallengeId(_members: string[], _byId: Map<string, HackathonParticipantRow>): string | null {
  return null
}

function teamLeaderId(members: string[], _byId: Map<string, HackathonParticipantRow>): string | null {
  if (members.length === 0) return null
  return [...members].sort((a, b) => a.localeCompare(b))[0] ?? null
}

/** Heurística de afinidad para meter un candidato en un equipo con huecos. */
function affinityScore(
  candidateId: string,
  team: string[],
  byId: Map<string, HackathonParticipantRow>
): number {
  const p = byId.get(candidateId)
  if (!p) return 0
  let score = 0
  const needProfiles = new Set(['frontend', 'backend', 'full_stack', 'data_analyst'])
  for (const id of team) needProfiles.delete(byId.get(id)?.perfil ?? '')
  if (needProfiles.has(p.perfil)) score += 6
  return score
}

function pickBestTeamForOrphan(
  orphanId: string,
  teams: string[][],
  byId: Map<string, HackathonParticipantRow>
): number {
  let bestI = -1
  let bestS = -1
  for (let i = 0; i < teams.length; i++) {
    const t = teams[i]!
    if (t.length >= MAX_TEAM) continue
    const s = affinityScore(orphanId, t, byId)
    const tieBreak = MAX_TEAM - t.length
    const total = s * 100 + tieBreak
    if (total > bestS) {
      bestS = total
      bestI = i
    }
  }
  return bestI
}

function mergeUndersizedTeams(draftTeams: string[][], messages: string[]): string[][] {
  let teams = draftTeams.filter((g) => g.length > 0)
  let guard = 0
  while (guard++ < teams.length + 50) {
    const idx = teams.findIndex((g) => g.length > 0 && g.length < MIN_TEAM)
    if (idx < 0) return teams
    const small = teams[idx]!
    let dest = -1
    let bestCap = -1
    for (let j = 0; j < teams.length; j++) {
      if (j === idx) continue
      const cap = MAX_TEAM - teams[j]!.length
      if (cap > bestCap) {
        bestCap = cap
        dest = j
      }
    }
    if (dest < 0 || bestCap <= 0) {
      messages.push(
        'Advertencia: no se pudo fusionar un equipo incompleto; revisa el número de inscritos o el panel.'
      )
      return teams
    }
    teams[dest] = [...teams[dest]!, ...small]
    teams.splice(idx, 1)
    if (teams[dest]!.length > MAX_TEAM) {
      messages.push('Nota: un equipo superó el cupo ideal por fusión.')
    }
  }
  return teams
}

export type HackathonFormationResult = {
  ok: boolean
  teamsCreated: number
  participantsAssigned: number
  messages: string[]
  smsAttempted: boolean
  smsOk?: boolean
}

export async function runHackathonTeamFormation(options?: {
  skipSms?: boolean
  skipBalanceCheck?: boolean
}): Promise<HackathonFormationResult> {
  const messages: string[] = []
  const skipSms = Boolean(options?.skipSms)
  const skipBalanceCheck = Boolean(options?.skipBalanceCheck)

  const supabase = createAdminClient()
  if (!supabase) {
    return { ok: false, teamsCreated: 0, participantsAssigned: 0, messages: ['Sin cliente Supabase admin.'], smsAttempted: false }
  }

  const { data: subsRaw, error: eSub } = await supabase
    .from('hackaton_submissions')
    .select('id, nombre_completo, telefono, perfil')
    .order('created_at', { ascending: true })

  if (eSub || !subsRaw?.length) {
    messages.push(eSub?.message ?? 'Sin inscripciones.')
    return {
      ok: false,
      teamsCreated: 0,
      participantsAssigned: 0,
      messages,
      smsAttempted: false,
    }
  }

  const submissions = subsRaw as HackathonParticipantRow[]
  const byId = new Map(submissions.map((s) => [s.id, s]))
  const allIds = submissions.map((s) => s.id)

  const { data: mutual } = await supabase.from('v_hackaton_mutual_matches').select('from_id, to_id')
  const { data: exRows } = await supabase.from('v_hackaton_exclusions').select('from_id, to_id')

  const exclusions = loadExclusionSet((exRows ?? []) as { from_id: string; to_id: string }[])

  const uf = new UnionFind(allIds)
  for (const row of mutual ?? []) {
    const a = row.from_id as string
    const b = row.to_id as string
    if (!byId.has(a) || !byId.has(b)) continue
    if (isExcluded(a, b, exclusions)) continue
    uf.union(a, b)
  }

  let draftTeams: string[][] = []
  const orphanSingles: string[] = []

  const clusters = [...uf.clusters().values()].map((g) => shuffle(g))

  for (const cluster of clusters) {
    const n = cluster.length
    if (n >= MIN_TEAM && n <= MAX_TEAM) {
      draftTeams.push(cluster)
      continue
    }
    if (n > MAX_TEAM) {
      draftTeams.push(...splitLargeCluster(cluster, byId))
      messages.push(`Grupo de ${n} personas dividido en equipos más pequeños.`)
      continue
    }
    if (n === 2) {
      draftTeams.push(cluster)
      continue
    }
    orphanSingles.push(...cluster)
  }

  // Fusionar equipos de 2 personas si hay demasiados y huecos
  const twos = draftTeams.filter((t) => t.length === 2)
  const nonTwos = draftTeams.filter((t) => t.length !== 2)
  draftTeams = [...nonTwos, ...twos]

  for (const oid of orphanSingles) {
    const idx = pickBestTeamForOrphan(oid, draftTeams, byId)
    if (idx >= 0) draftTeams[idx]!.push(oid)
    else draftTeams.push([oid])
  }

  // Reparto de equipos < 3 absorbiendo en otros si cabe
  let guard = 0
  while (guard++ < allIds.length * 2) {
    const smallIdx = draftTeams.findIndex((t) => t.length > 0 && t.length < MIN_TEAM)
    if (smallIdx < 0) break
    const small = draftTeams[smallIdx]!
    if (small.length === 0) {
      draftTeams.splice(smallIdx, 1)
      continue
    }
    let merged = false
    for (let i = 0; i < draftTeams.length; i++) {
      if (i === smallIdx) continue
      const t = draftTeams[i]!
      if (t.length + small.length <= MAX_TEAM && t.length + small.length >= MIN_TEAM) {
        draftTeams[i] = [...t, ...small]
        draftTeams.splice(smallIdx, 1)
        merged = true
        break
      }
    }
    if (!merged) {
      const donorIdx = draftTeams.findIndex(
        (t, i) => i !== smallIdx && t.length > small.length && t.length > MIN_TEAM
      )
      if (donorIdx < 0) break
      const need = MIN_TEAM - small.length
      const donor = draftTeams[donorIdx]!
      small.push(...donor.splice(-need, need))
      merged = true
    }
    if (!merged) break
  }

  // Si queda algún equipo imposible (<3), unir al más afín con espacio aunque pase de 5 (último recurso)
  for (let i = 0; i < draftTeams.length; i++) {
    const t = draftTeams[i]!
    if (t.length >= MIN_TEAM || t.length === 0) continue
    const joinIdx = pickBestTeamForOrphan(t[0]!, draftTeams.filter((_, j) => j !== i), byId)
    const flatOthers = draftTeams.filter((_, j) => j !== i)
    if (joinIdx >= 0 && flatOthers[joinIdx]) {
      flatOthers[joinIdx]!.push(...t)
      draftTeams.splice(i, 1)
      i--
      messages.push('Algunos equipos se equilibraron sobre el tamaño ideal por disponibilidad.')
    }
  }

  draftTeams = mergeUndersizedTeams(draftTeams, messages)

  const challengeNames = new Map<string, string>()
  const { data: challRows } = await supabase.from('hackaton_challenges').select('id, name')
  challRows?.forEach((r) => challengeNames.set(r.id as string, r.name as string))

  await supabase.from('hackaton_equipos').delete().eq('auto_formed', true)
  await supabase.from('hackaton_equipo_miembros').delete().eq('ronda', FORMACION_RONDA)

  const { data: maxRow } = await supabase
    .from('hackaton_equipos')
    .select('numero')
    .order('numero', { ascending: false })
    .limit(1)
    .maybeSingle()

  let nextNum = (maxRow?.numero as number | undefined) ?? 0

  const smsRecipients: {
    telefono: string
    nombre: string
    equipo: string
    desafio: string
    companeros: string
    mesa: string
  }[] = []

  let teamsCreated = 0

  for (let ti = 0; ti < draftTeams.length; ti++) {
    const members = draftTeams[ti]!.filter(Boolean)
    if (members.length === 0) continue

    nextNum += 1
    const nombreEq = EQUIPO_NOMBRES[teamsCreated] ?? `Equipo ${nextNum}`
    const mesa = `Mesa ${nextNum}`
    const challengeId = teamChallengeId(members, byId)
    const leaderId = teamLeaderId(members, byId)
    const desafioNombre =
      (challengeId && challengeNames.get(challengeId)) || 'Por definir'

    const { data: equipoIns, error: eqErr } = await supabase
      .from('hackaton_equipos')
      .insert({
        numero: nextNum,
        nombre: nombreEq,
        cupos_max: MAX_TEAM,
        challenge_id: challengeId,
        leader_submission_id: leaderId,
        mesa,
        status: 'confirmed',
        auto_formed: true,
      })
      .select('id')
      .single()

    if (eqErr || !equipoIns) {
      messages.push(`Error creando equipo: ${eqErr?.message ?? 'desconocido'}`)
      continue
    }

    teamsCreated++
    const equipoId = equipoIns.id as string

    let orden = 0
    for (const sid of members) {
      await supabase.from('hackaton_equipo_miembros').insert({
        equipo_id: equipoId,
        submission_id: sid,
        ronda: FORMACION_RONDA,
        orden: orden++,
      })
    }

    const nombresOtros = (sid: string) =>
      members.filter((m) => m !== sid).map((id) => byId.get(id)?.nombre_completo ?? '?')

    for (const sid of members) {
      const self = byId.get(sid)
      if (!self) continue
      const peers = nombresOtros(sid).join(', ')
      smsRecipients.push({
        telefono: self.telefono,
        nombre: self.nombre_completo,
        equipo: nombreEq,
        desafio: desafioNombre,
        companeros: peers || '—',
        mesa,
      })
    }
  }

  const participantsAssigned = draftTeams.reduce((acc, t) => acc + t.filter(Boolean).length, 0)

  let smsOk = false
  let smsAttempted = false
  if (!skipSms && smsRecipients.length > 0) {
    smsAttempted = true
    if (!skipBalanceCheck) {
      const bal = await getInalambriaBalance()
      if (!bal.ok) {
        messages.push(`SMS no enviado: no se pudo validar balance (${bal.error}).`)
      } else {
        const smsRes = await hackathonOnEquipoFormado(smsRecipients)
        smsOk = smsRes.ok === true
        if (!smsOk && 'error' in smsRes) messages.push(`SMS: ${String(smsRes.error)}`)
      }
    } else {
      const smsRes = await hackathonOnEquipoFormado(smsRecipients)
      smsOk = smsRes.ok === true
      if (!smsOk && 'error' in smsRes) messages.push(`SMS: ${String(smsRes.error)}`)
    }
  }

  messages.push(
    `Formación lista: ${teamsCreated} equipos, ${participantsAssigned} participantes en ronda ${FORMACION_RONDA}.`
  )

  return {
    ok: teamsCreated > 0,
    teamsCreated,
    participantsAssigned,
    messages,
    smsAttempted,
    smsOk,
  }
}
