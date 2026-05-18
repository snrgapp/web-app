'use server'

import {
  validateSubmissionData,
  normalizeFormData,
  type FormFieldConfig,
  type FormSubmissionData,
} from '@/types/form.types'
import {
  getExperienceFormBySlug,
  createExperienceFormSubmission,
  listExperienceFormsForOrg,
} from '@/lib/experience-forms/repository'
import { mergePaasFormFields, PAAS_RESERVED_FIELD_KEYS } from '@/lib/experience-forms/paas-default-fields'
import { addContactToBrevoList, type BrevoContactData } from '@/lib/brevo'
import { revalidatePath } from 'next/cache'
import { getDefaultOrgId } from '@/lib/org-resolver'
import type { Json } from '@/types/database.types'
import { createServerClient } from '@/utils/supabase/server'

export type SubmitExperienceFormResult = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

function extractContactData(data: FormSubmissionData): BrevoContactData | null {
  const email = String(data.email ?? '').trim()
  if (!email) return null
  const nombreRaw = [String(data.nombre ?? '').trim(), String(data.apellido ?? '').trim()]
    .filter(Boolean)
    .join(' ')
    .trim()
  const nombre = nombreRaw || null
  const telefono = String(data.whatsapp ?? '').trim() || null
  return { email, nombre, telefono }
}

export async function submitExperienceFormAction(
  formSlug: string,
  formData: FormData
): Promise<SubmitExperienceFormResult> {
  const form = await getExperienceFormBySlug(formSlug)
  if (!form) {
    return { success: false, message: 'Formulario no encontrado' }
  }

  const customFields = form.campos as FormFieldConfig[]
  const fields = mergePaasFormFields(customFields)
  const data: FormSubmissionData = normalizeFormData(formData, fields)
  const { valid, errors } = validateSubmissionData(data, fields)
  if (!valid) {
    return { success: false, message: 'Revisa los campos marcados', errors }
  }

  const { success, error } = await createExperienceFormSubmission(form.id, data as Record<string, unknown>)
  if (!success) {
    return { success: false, message: error ?? 'Error al registrar la inscripción' }
  }

  const brevoListId = form.brevo_list_id ?? null
  if (brevoListId) {
    const contact = extractContactData(data)
    if (contact) {
      const brevoResult = await addContactToBrevoList(contact, brevoListId)
      if (!brevoResult.success) {
        console.warn(`[Brevo] No se pudo enviar contacto (experience_forms): ${brevoResult.error}`)
      }
    }
  }

  return { success: true, message: '¡Inscripción registrada correctamente!' }
}

export async function listExperienceFormsForPanelAction() {
  return listExperienceFormsForOrg()
}

export async function updateExperienceFormCamposAction(
  formId: string,
  campos: FormFieldConfig[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  const orgId = await getDefaultOrgId()
  if (!orgId) return { ok: false, error: 'No se pudo resolver la organización.' }

  for (const f of campos) {
    if (!f.key?.trim() || !f.label?.trim()) {
      return { ok: false, error: 'Cada pregunta debe tener clave y etiqueta.' }
    }
    if (PAAS_RESERVED_FIELD_KEYS.has(f.key.trim())) {
      return { ok: false, error: `La clave «${f.key}» está reservada para datos de contacto.` }
    }
  }

  const supabase = await createServerClient()
  if (!supabase) return { ok: false, error: 'Sin conexión a Supabase.' }

  const { data: row, error: fetchErr } = await supabase
    .from('experience_forms')
    .select('id, slug')
    .eq('id', formId)
    .eq('organizacion_id', orgId)
    .maybeSingle()

  if (fetchErr || !row) return { ok: false, error: 'Formulario no encontrado.' }

  const { error } = await supabase
    .from('experience_forms')
    .update({ campos: campos as unknown as Json, updated_at: new Date().toISOString() })
    .eq('id', formId)
    .eq('organizacion_id', orgId)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/panel/formulario')
  revalidatePath('/panel/plantillas')
  revalidatePath(`/inscripcion-exp/${row.slug}`)
  return { ok: true }
}
