'use server'

/**
 * Server Actions para formularios de inscripción.
 * Lógica de negocio: validación + persistencia + integración Brevo.
 */

import {
  validateSubmissionData,
  normalizeFormData,
  type FormFieldConfig,
  type FormSubmissionData,
} from '@/types/form.types'
import { createFormSubmission, getFormBySlug } from '@/lib/forms'
import { addContactToBrevoList, type BrevoContactData } from '@/lib/brevo'

export type SubmitFormResult = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

/**
 * Extrae email, nombre y teléfono de los datos del formulario.
 * Busca por key convencional o por tipo de campo.
 */
function extractContactData(
  data: FormSubmissionData,
  fields: FormFieldConfig[]
): BrevoContactData | null {
  // Buscar email: primero por tipo, luego por key
  const emailField = fields.find((f) => f.type === 'email') ?? fields.find((f) => /^(email|correo)$/i.test(f.key))
  const email = emailField ? String(data[emailField.key] ?? '').trim() : ''
  if (!email) return null

  // Buscar nombre: por key
  const nombreField = fields.find((f) => /^(nombre|name|nombre_completo|full_name)$/i.test(f.key))
  const nombre = nombreField ? String(data[nombreField.key] ?? '').trim() : null

  // Buscar teléfono: primero por tipo, luego por key
  const telField = fields.find((f) => f.type === 'tel') ?? fields.find((f) => /^(telefono|phone|tel|celular|whatsapp)$/i.test(f.key))
  const telefono = telField ? String(data[telField.key] ?? '').trim() : null

  return { email, nombre, telefono }
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

  // Enviar contacto a Brevo si el formulario tiene brevo_list_id
  const brevoListId = form.brevo_list_id ?? null
  if (brevoListId) {
    const contact = extractContactData(data, fields)
    if (contact) {
      const brevoResult = await addContactToBrevoList(contact, brevoListId)
      if (!brevoResult.success) {
        console.warn(`[Brevo] No se pudo enviar contacto: ${brevoResult.error}`)
      }
    }
  }

  return {
    success: true,
    message: '¡Inscripción registrada correctamente!',
  }
}
