import { createAdminClient } from '@/utils/supabase/admin'
import { hackathonOnIntencionInterested } from '@/lib/hackathon-eventos'
import { phoneDigitsCo } from '@/lib/inalambria'

export async function upsertHackathonIntention(input: {
  telefonoDigits: string
  fromSubmissionId: string
  toSubmissionId: string
  type: 'interested' | 'pass'
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const tel = phoneDigitsCo(input.telefonoDigits)
  if (tel.length < 7 || tel.length > 15) {
    return { ok: false, error: 'Teléfono inválido.' }
  }
  if (input.fromSubmissionId === input.toSubmissionId) {
    return { ok: false, error: 'No puedes elegirte a ti mismo.' }
  }

  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Sin conexión.' }

  const { data: owner, error: e1 } = await supabase
    .from('hackaton_submissions')
    .select('id, telefono')
    .eq('id', input.fromSubmissionId)
    .maybeSingle()

  if (e1 || !owner || phoneDigitsCo(owner.telefono as string) !== tel) {
    return { ok: false, error: 'No autorizado para esta acción.' }
  }

  const { data: target, error: e2 } = await supabase
    .from('hackaton_submissions')
    .select('id')
    .eq('id', input.toSubmissionId)
    .maybeSingle()

  if (e2 || !target) {
    return { ok: false, error: 'Participante no encontrado.' }
  }

  const { error: delErr } = await supabase
    .from('hackaton_intentions')
    .delete()
    .eq('from_submission_id', input.fromSubmissionId)
    .eq('to_submission_id', input.toSubmissionId)

  if (delErr) {
    return { ok: false, error: delErr.message }
  }

  const { error: e3 } = await supabase.from('hackaton_intentions').insert({
    from_submission_id: input.fromSubmissionId,
    to_submission_id: input.toSubmissionId,
    type: input.type,
  })

  if (e3) {
    return { ok: false, error: e3.message }
  }

  if (input.type === 'interested') {
    try {
      await hackathonOnIntencionInterested(tel)
    } catch {
      /* SMS opcional */
    }
  }

  return { ok: true }
}

export async function fetchMisIntenciones(
  telefonoDigits: string,
  fromSubmissionId: string
): Promise<Record<string, 'interested' | 'pass'>> {
  const tel = phoneDigitsCo(telefonoDigits)
  const supabase = createAdminClient()
  if (!supabase || tel.length < 7) return {}

  const { data: owner } = await supabase
    .from('hackaton_submissions')
    .select('id, telefono')
    .eq('id', fromSubmissionId)
    .maybeSingle()

  if (!owner || phoneDigitsCo(owner.telefono as string) !== tel) return {}

  const { data: rows } = await supabase
    .from('hackaton_intentions')
    .select('to_submission_id, type')
    .eq('from_submission_id', fromSubmissionId)

  const out: Record<string, 'interested' | 'pass'> = {}
  rows?.forEach((r) => {
    const t = r.type as string
    if (t === 'interested' || t === 'pass') out[r.to_submission_id as string] = t
  })
  return out
}
