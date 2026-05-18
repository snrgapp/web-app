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
} from '@/lib/experience-forms/repository'
import { addContactToBrevoList, type BrevoContactData } from '@/lib/brevo'

export type SubmitExperienceFormResult = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

function extractContactData(
  data: FormSubmissionData,
  fields: FormFieldConfig[]
): BrevoContactData | null {
  const emailField = fields.find((f) => f.type === 'email') ?? fields.find((f) => /^(email|correo)$/i.test(f.key))
  const email = emailField ? String(data[emailField.key] ?? '').trim() : ''
  if (!email) return null
  const nombreField = fields.find((f) => /^(nombre|name|nombre_completo|full_name)$/i.test(f.key))
  const nombre = nombreField ? String(data[nombreField.key] ?? '').trim() : null
  const telField =
    fields.find((f) => f.type === 'tel') ??
    fields.find((f) => /^(telefono|phone|tel|celular|whatsapp)$/i.test(f.key))
  const telefono = telField ? String(data[telField.key] ?? '').trim() : null
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

  const fields = form.campos as FormFieldConfig[]
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
    const contact = extractContactData(data, fields)
    if (contact) {
      const brevoResult = await addContactToBrevoList(contact, brevoListId)
      if (!brevoResult.success) {
        console.warn(`[Brevo] No se pudo enviar contacto (experience_forms): ${brevoResult.error}`)
      }
    }
  }

  return { success: true, message: '¡Inscripción registrada correctamente!' }
}
