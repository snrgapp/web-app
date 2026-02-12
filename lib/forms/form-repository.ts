/**
 * Repositorio: acceso a datos de formularios e inscripciones.
 * Separación clara entre capa de datos y lógica de negocio.
 */

import type { FormFieldConfig } from '@/types/form.types'
import type { Json } from '@/types/database.types'
import { createServerClient } from '@/utils/supabase/server'

export type FormWithParsedFields = {
  id: string
  evento_id: string | null
  slug: string
  titulo: string
  descripcion: string | null
  icon_url: string | null
  cover_url: string | null
  campos: FormFieldConfig[]
  activo: boolean
  created_at: string
  updated_at: string
}

function parseCampos(campos: unknown): FormFieldConfig[] {
  if (!Array.isArray(campos)) return []
  return campos.filter(
    (c): c is FormFieldConfig =>
      typeof c === 'object' &&
      c !== null &&
      typeof (c as FormFieldConfig).key === 'string' &&
      typeof (c as FormFieldConfig).label === 'string' &&
      typeof (c as FormFieldConfig).type === 'string'
  )
}

/** Obtiene un formulario por slug (solo activos) */
export async function getFormBySlug(slug: string): Promise<FormWithParsedFields | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  if (error || !data) return null

  return {
    ...data,
    campos: parseCampos(data.campos),
  }
}

/** Lista todos los formularios (para admin) */
export async function getAllForms(): Promise<FormWithParsedFields[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []

  return (data ?? []).map((row) => ({
    ...row,
    campos: parseCampos(row.campos),
  }))
}

/** Obtiene un formulario por ID (para admin) */
export async function getFormById(id: string): Promise<FormWithParsedFields | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null

  return {
    ...data,
    campos: parseCampos(data.campos),
  }
}

/** Inserta una inscripción */
export async function createFormSubmission(
  formId: string,
  datos: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: 'Supabase no configurado' }

  const { error } = await supabase.from('form_submissions').insert({
    form_id: formId,
    datos: datos as unknown as import('@/types/database.types').Json,
  })

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export type FormInsertInput = {
  evento_id?: string | null
  slug: string
  titulo: string
  descripcion?: string | null
  icon_url?: string | null
  cover_url?: string | null
  campos: FormFieldConfig[]
  activo?: boolean
}

/** Crea un nuevo formulario */
export async function createForm(
  input: FormInsertInput
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: 'Supabase no configurado' }

  const { data, error } = await supabase
    .from('forms')
    .insert({
      evento_id: input.evento_id ?? null,
      slug: input.slug,
      titulo: input.titulo,
      descripcion: input.descripcion ?? null,
      icon_url: input.icon_url ?? null,
      cover_url: input.cover_url ?? null,
      campos: input.campos as unknown as Json,
      activo: input.activo ?? true,
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, id: data?.id }
}

/** Actualiza un formulario existente */
export async function updateForm(
  id: string,
  input: Partial<FormInsertInput>
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: 'Supabase no configurado' }

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  if (input.slug !== undefined) payload.slug = input.slug
  if (input.titulo !== undefined) payload.titulo = input.titulo
  if (input.descripcion !== undefined) payload.descripcion = input.descripcion
  if (input.campos !== undefined) payload.campos = input.campos as unknown as Json
  if (input.activo !== undefined) payload.activo = input.activo
  if (input.evento_id !== undefined) payload.evento_id = input.evento_id
  if (input.icon_url !== undefined) payload.icon_url = input.icon_url
  if (input.cover_url !== undefined) payload.cover_url = input.cover_url

  const { error } = await supabase.from('forms').update(payload).eq('id', id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/** Elimina un formulario */
export async function deleteForm(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: 'Supabase no configurado' }

  const { error } = await supabase.from('forms').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/** Cuenta inscripciones por formulario */
export async function getSubmissionCount(formId: string): Promise<number> {
  const supabase = createServerClient()
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('form_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('form_id', formId)

  if (error) return 0
  return count ?? 0
}
