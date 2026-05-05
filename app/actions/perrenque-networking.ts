'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import type { PerrenqueConectaSubmission, PerrenquePregunta } from '@/types/database.types'

export async function verificarPerrenquePorTelefono(
  telefono: string
): Promise<
  { ok: true; submission: PerrenqueConectaSubmission } | { ok: false; error: string }
> {
  const normalizado = telefono.replace(/\D/g, '')
  if (normalizado.length < 7 || normalizado.length > 15) {
    return { ok: false, error: 'Ingresa un número válido (solo dígitos).' }
  }
  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { data, error } = await supabase
    .from('perrenque_conecta_submissions')
    .select('*')
    .eq('telefono', normalizado)
    .maybeSingle()

  if (error || !data) {
    return {
      ok: false,
      error:
        'No encontramos tu registro. Completa primero el formulario del evento (Perrenque).',
    }
  }

  return { ok: true, submission: data as PerrenqueConectaSubmission }
}

export async function getPerrenqueGrupoScreenData(
  submissionId: string,
  ronda: 1 | 2
): Promise<{
  grupoNumero: number | null
  companeros: PerrenqueConectaSubmission[]
}> {
  const supabase = createAdminClient()
  if (!supabase) return { grupoNumero: null, companeros: [] }

  const { data: mine } = await supabase
    .from('perrenque_grupo_ronda')
    .select('grupo_numero')
    .eq('submission_id', submissionId)
    .eq('ronda', ronda)
    .maybeSingle()

  const grupoNumero = mine?.grupo_numero ?? null
  if (grupoNumero == null) {
    return { grupoNumero: null, companeros: [] }
  }

  const { data: peerRows } = await supabase
    .from('perrenque_grupo_ronda')
    .select('submission_id')
    .eq('ronda', ronda)
    .eq('grupo_numero', grupoNumero)

  const peerIds =
    peerRows?.map((r) => r.submission_id).filter((id) => id !== submissionId) ?? []
  if (peerIds.length === 0) {
    return { grupoNumero, companeros: [] }
  }

  const { data: people } = await supabase
    .from('perrenque_conecta_submissions')
    .select('*')
    .in('id', peerIds)
    .order('nombre_completo', { ascending: true })

  return {
    grupoNumero,
    companeros: (people ?? []) as PerrenqueConectaSubmission[],
  }
}

export async function getPerrenqueQuestions(ronda: 1 | 2): Promise<PerrenquePregunta[]> {
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('perrenque_preguntas')
    .select('*')
    .eq('ronda', ronda)
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (error) {
    console.error('getPerrenqueQuestions:', error)
    return []
  }

  return (data ?? []) as PerrenquePregunta[]
}

export async function guardarFeedbackPerrenque(
  submissionId: string,
  rating: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }
  if (rating < 1 || rating > 5) {
    return { ok: false, error: 'La calificación debe ser entre 1 y 5.' }
  }

  const { error } = await supabase.from('feedback_perrenque').upsert(
    { submission_id: submissionId, rating },
    { onConflict: 'submission_id' }
  )

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}
