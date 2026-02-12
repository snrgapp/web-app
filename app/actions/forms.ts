'use server'

/**
 * Server Actions para formularios de inscripción.
 * Lógica de negocio: validación + persistencia.
 */

import {
  validateSubmissionData,
  normalizeFormData,
  type FormFieldConfig,
  type FormSubmissionData,
} from '@/types/form.types'
import { createFormSubmission, getFormBySlug } from '@/lib/forms'

export type SubmitFormResult = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

export async function submitFormAction(
  formSlug: string,
  formData: FormData
): Promise<SubmitFormResult> {
  const form = await getFormBySlug(formSlug)
  if (!form) {
    return { success: false, message: 'Formulario no encontrado' }
  }

  const fields = form.campos as FormFieldConfig[]
  const data: FormSubmissionData = normalizeFormData(formData, fields)

  const { valid, errors } = validateSubmissionData(data, fields)
  if (!valid) {
    return {
      success: false,
      message: 'Revisa los campos marcados',
      errors,
    }
  }

  const { success, error } = await createFormSubmission(form.id, data as Record<string, unknown>)

  if (!success) {
    return {
      success: false,
      message: error ?? 'Error al registrar la inscripción',
    }
  }

  return {
    success: true,
    message: '¡Inscripción registrada correctamente!',
  }
}
