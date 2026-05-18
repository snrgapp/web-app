/**
 * Campos de contacto obligatorios en la primera pantalla de inscripción PaaS.
 * Las claves están reservadas: no deben repetirse en `campos` del formulario.
 */

import type { FormFieldConfig } from '@/types/form.types'

export const PAAS_DEFAULT_CONTACT_FIELDS: FormFieldConfig[] = [
  {
    key: 'nombre',
    label: 'Nombre',
    type: 'text',
    required: true,
    placeholder: 'Tu nombre',
  },
  {
    key: 'apellido',
    label: 'Apellido',
    type: 'text',
    required: true,
    placeholder: 'Tu apellido',
  },
  {
    key: 'whatsapp',
    label: 'Número de WhatsApp',
    type: 'tel',
    required: true,
    placeholder: 'Ej. +57 300 123 4567',
  },
  {
    key: 'email',
    label: 'Correo electrónico',
    type: 'email',
    required: true,
    placeholder: 'correo@ejemplo.com',
  },
]

export const PAAS_RESERVED_FIELD_KEYS = new Set(
  PAAS_DEFAULT_CONTACT_FIELDS.map((f) => f.key)
)

export function mergePaasFormFields(custom: FormFieldConfig[]): FormFieldConfig[] {
  return [...PAAS_DEFAULT_CONTACT_FIELDS, ...custom]
}

/** Quita del JSON campos que chocan con los de contacto (datos legacy). */
export function filterCustomPaasCampos(campos: FormFieldConfig[]): FormFieldConfig[] {
  return campos.filter((c) => !PAAS_RESERVED_FIELD_KEYS.has(c.key))
}
