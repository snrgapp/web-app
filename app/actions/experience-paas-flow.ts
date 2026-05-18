'use server'

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'

export type VerifyPhoneResult =
  | { ok: true; submissionId: string }
  | { ok: false; error: string }

type RpcRow = { submission_id: string; experience_form_id: string }

export async function verifyExperienceSubmissionByPhoneAction(
  publicSlug: string,
  phone: string
): Promise<VerifyPhoneResult> {
  const orgId = await getDefaultOrgId()
  if (!orgId) return { ok: false, error: 'Evento no disponible.' }

  const supabase = await createServerClient()
  if (!supabase) return { ok: false, error: 'Sin conexión.' }

  const { data, error } = await supabase.rpc('verify_experience_submission_by_phone', {
    p_public_slug: publicSlug,
    p_organizacion_id: orgId,
    p_phone: phone.trim(),
  })

  if (error) {
    return { ok: false, error: error.message }
  }

  const rows = data as RpcRow[] | null
  const first = rows?.[0]
  if (!first?.submission_id) {
    return { ok: false, error: 'No encontramos una inscripción con ese teléfono.' }
  }

  return { ok: true, submissionId: first.submission_id }
}
