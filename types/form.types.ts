/**
 * Tipos para el sistema de formularios de inscripción.
 * Validación estricta: los datos de inscripción deben coincidir con la configuración del evento.
 */

/** Tipos de campo soportados en formularios dinámicos */
export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'url'

/** Configuración de un campo del formulario (schema en forms.campos) */
export interface FormFieldConfig {
  key: string
  label: string
  type: FormFieldType
  required?: boolean
  placeholder?: string
  /** Solo para select/radio: opciones {value, label} */
  options?: Array<{ value: string; label: string }>
  /** Validación mínima (number, text length) */
  min?: number
  /** Validación máxima (number, text length) */
  max?: number
}

/** Form completo desde la base de datos */
export interface Form {
  id: string
  evento_id: string | null
  slug: string
  titulo: string
  descripcion: string | null
  campos: FormFieldConfig[]
  activo: boolean
  created_at: string
  updated_at: string
}

/** Datos de una inscripción: objeto clave-valor donde key coincide con FormFieldConfig.key */
export type FormSubmissionData = Record<string, string | number | boolean | string[] | null>

/** Inscripción almacenada en form_submissions */
export interface FormSubmission {
  id: string
  form_id: string
  datos: FormSubmissionData
  created_at: string
}

/** Valida que los datos de inscripción cumplan con el schema del formulario */
export function validateSubmissionData(
  data: FormSubmissionData,
  fields: FormFieldConfig[]
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    const value = data[field.key]

    if (field.required && (value === undefined || value === null || value === '')) {
      errors[field.key] = `${field.label} es obligatorio`
      continue
    }

    if (value === undefined || value === null || value === '') continue

    switch (field.type) {
      case 'email':
        if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[field.key] = 'Introduce un correo válido'
        }
        break
      case 'tel':
        if (typeof value !== 'string' || !/^[\d\s\-\+\(\)]+$/.test(value)) {
          errors[field.key] = 'Introduce un teléfono válido'
        }
        break
      case 'number':
        if (typeof value !== 'number' && (typeof value !== 'string' || isNaN(Number(value)))) {
          errors[field.key] = 'Debe ser un número'
        } else {
          const n = typeof value === 'number' ? value : Number(value)
          if (field.min !== undefined && n < field.min) {
            errors[field.key] = `Mínimo ${field.min}`
          }
          if (field.max !== undefined && n > field.max) {
            errors[field.key] = `Máximo ${field.max}`
          }
        }
        break
      case 'url':
        if (typeof value !== 'string' || !/^https?:\/\/.+/.test(value)) {
          errors[field.key] = 'Introduce una URL válida'
        }
        break
      case 'date':
        if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          errors[field.key] = 'Formato de fecha inválido'
        }
        break
      case 'select':
      case 'radio':
        if (field.options && !field.options.some((o) => o.value === String(value))) {
          errors[field.key] = 'Selecciona una opción válida'
        }
        break
      case 'text':
      case 'textarea':
        const str = String(value)
        if (field.min !== undefined && str.length < field.min) {
          errors[field.key] = `Mínimo ${field.min} caracteres`
        }
        if (field.max !== undefined && str.length > field.max) {
          errors[field.key] = `Máximo ${field.max} caracteres`
        }
        break
      default:
        break
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/** Parsea y normaliza campos de un formulario HTML a FormSubmissionData */
export function normalizeFormData(
  formData: FormData,
  fields: FormFieldConfig[]
): FormSubmissionData {
  const data: FormSubmissionData = {}

  for (const field of fields) {
    const value = formData.get(field.key)
    if (value === null || value === undefined) continue

    if (field.type === 'checkbox') {
      const checkboxes = formData.getAll(field.key)
      data[field.key] = checkboxes.length > 0 ? (checkboxes as string[]) : null
    } else if (field.type === 'number') {
      const num = Number(value)
      data[field.key] = isNaN(num) ? null : num
    } else {
      data[field.key] = String(value).trim() || null
    }
  }

  return data
}
