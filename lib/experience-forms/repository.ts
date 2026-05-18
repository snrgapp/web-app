/**
 * Formularios de inscripción PaaS (tabla experience_forms), aislados de `forms`.
 */

import type { FormFieldConfig } from '@/types/form.types'
import type { Json } from '@/types/database.types'
import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { filterCustomPaasCampos } from '@/lib/experience-forms/paas-default-fields'

export type ExperienceFormWithFields = {
  id: string
  organizacion_id: string
  slug: string
  titulo: string
  descripcion: string | null
  icon_url: string | null
  cover_url: string | null
  campos: FormFieldConfig[]
  activo: boolean
  brevo_list_id: number | null
  created_at: string
  updated_at: string
}

function parseCampos(campos: unknown): FormFieldConfig[] {
  if (!Array.isArray(campos)) return []
  const raw = campos.filter(
    (c): c is FormFieldConfig =>
      typeof c === 'object' &&
      c !== null &&
      typeof (c as FormFieldConfig).key === 'string' &&
      typeof (c as FormFieldConfig).label === 'string' &&
      typeof (c as FormFieldConfig).type === 'string'
  )
  return filterCustomPaasCampos(raw)
}

export async function getExperienceFormBySlug(slug: string): Promise<ExperienceFormWithFields | null> {
  const supabase = await createServerClient()
  if (!supabase) return null
  const orgId = await getDefaultOrgId()
  if (!orgId) return null

  const { data, error } = await supabase
    .from('experience_forms')
    .select('*')
    .eq('slug', slug)
    .eq('organizacion_id', orgId)
    .eq('activo', true)
    .maybeSingle()

  if (error || !data) return null
  return {
    ...data,
    campos: parseCampos(data.campos),
    brevo_list_id: ((data as Record<string, unknown>).brevo_list_id as number | null) ?? null,
  }
}

export async function createExperienceFormSubmission(
  experienceFormId: string,
  datos: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  if (!supabase) return { success: false, error: 'Supabase no configurado' }

  const { error } = await supabase.from('experience_form_submissions').insert({
    experience_form_id: experienceFormId,
    datos: datos as Json,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function listExperienceFormsForOrg(): Promise<ExperienceFormWithFields[]> {
  const supabase = await createServerClient()
  if (!supabase) return []
  const orgId = await getDefaultOrgId()
  if (!orgId) return []

  const { data, error } = await supabase
    .from('experience_forms')
    .select('*')
    .eq('organizacion_id', orgId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data.map((row) => ({
    ...row,
    campos: parseCampos(row.campos),
    brevo_list_id: ((row as Record<string, unknown>).brevo_list_id as number | null) ?? null,
  }))
}
