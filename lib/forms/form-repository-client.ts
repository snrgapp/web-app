/**
 * Repositorio de formularios para uso en Client Components (panel admin).
 * Usa el cliente de Supabase del navegador.
 */

import { supabase } from '@/utils/supabase/client'
import type { FormFieldConfig } from '@/types/form.types'
import type { Json } from '@/types/database.types'

export type FormWithParsedFields = {
  id: string
  evento_id: string | null
  slug: string
  titulo: string
  descripcion: string | null
  icon_url: string | null
  cover_url: string | null
  campos: FormFieldConfig[]
  brevo_list_id: number | null
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

export async function getAllFormsClient(orgId?: string | null): Promise<FormWithParsedFields[]> {
  if (!supabase) return []
  if (!orgId) return []

  const { data, error } = await supabase
    .from('forms')
    .select('*')
    .eq('organizacion_id', orgId)
    .order('created_at', { ascending: false })

  if (error) return []

  return (data ?? []).map((row) => ({
    ...row,
    campos: parseCampos(row.campos),
    brevo_list_id: (row as Record<string, unknown>).brevo_list_id as number | null ?? null,
  }))
}

export type FormInsertInput = {
  evento_id?: string | null
  slug: string
  titulo: string
  descripcion?: string | null
  icon_url?: string | null
  cover_url?: string | null
  campos: FormFieldConfig[]
  brevo_list_id?: number | null
  activo?: boolean
}

export async function createFormClient(
  input: FormInsertInput,
  orgId: string | null
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase no configurado' }
  if (!orgId) return { success: false, error: 'Organización no configurada' }

  const { data, error } = await supabase
    .from('forms')
    .insert({
      evento_id: input.evento_id ?? null,
      organizacion_id: orgId,
      slug: input.slug,
      titulo: input.titulo,
      descripcion: input.descripcion ?? null,
      icon_url: input.icon_url ?? null,
      cover_url: input.cover_url ?? null,
      campos: input.campos as unknown as Json,
      brevo_list_id: input.brevo_list_id ?? null,
      activo: input.activo ?? true,
    })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, id: data?.id }
}

export async function getSubmissionCountClient(formId: string): Promise<number> {
  if (!supabase) return 0

  const { count, error } = await supabase
    .from('form_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('form_id', formId)

  if (error) return 0
  return count ?? 0
}

export type FormSubmissionWithForm = {
  id: string
  form_id: string
  datos: Record<string, unknown>
  created_at: string
  form?: FormWithParsedFields
}

/** Obtiene las inscripciones de un formulario con sus datos JSON */
export async function getSubmissionsByFormIdClient(
  formId: string
): Promise<FormSubmissionWithForm[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('form_submissions')
    .select('*')
    .eq('form_id', formId)
    .order('created_at', { ascending: false })

  if (error) return []

  return (data ?? []) as FormSubmissionWithForm[]
}

/** Registros por día del mes (para gráfico Total Asistentes) */
export async function getSubmissionsByDayForMonth(
  year: number,
  month: number,
  orgId?: string | null
): Promise<{ day: number; value: number }[]> {
  if (!supabase) return []
  if (!orgId) return []

  const forms = await getAllFormsClient(orgId)
  const formIds = forms.map((f) => f.id)
  if (formIds.length === 0) return []

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)
  const startStr = startDate.toISOString().slice(0, 10)
  const endStr = endDate.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('form_submissions')
    .select('created_at')
    .in('form_id', formIds)
    .gte('created_at', startStr)
    .lte('created_at', endStr + 'T23:59:59.999Z')

  if (error) return []

  const daysInMonth = endDate.getDate()
  const counts: Record<number, number> = {}
  for (let d = 1; d <= daysInMonth; d++) counts[d] = 0

  ;(data ?? []).forEach((row: { created_at: string }) => {
    const day = new Date(row.created_at).getDate()
    counts[day] = (counts[day] ?? 0) + 1
  })

  return Object.entries(counts).map(([day, value]) => ({
    day: Number(day),
    value,
  }))
}

/** Inscritos por segmento: agrupa submissions donde el form tiene un campo "segmento" (select/radio) */
export type SegmentoCount = { segmento: string; count: number }

export async function getSubmissionsBySegment(orgId?: string | null): Promise<SegmentoCount[]> {
  if (!supabase) return []
  if (!orgId) return []

  const forms = await getAllFormsClient(orgId)
  const formIdsWithSegmento = forms
    .filter(
      (f) =>
        f.campos.some(
          (c) =>
            (c.key === 'segmento' || c.key === 'segment') &&
            (c.type === 'select' || c.type === 'radio')
        )
    )
    .map((f) => f.id)

  if (formIdsWithSegmento.length === 0) return []

  const { data: submissions, error } = await supabase
    .from('form_submissions')
    .select('form_id, datos')
    .in('form_id', formIdsWithSegmento)

  if (error) return []

  const counts: Record<string, number> = {}
  for (const row of submissions ?? []) {
    const datos = row.datos as Record<string, unknown>
    const val = datos?.segmento ?? datos?.segment
    const segmento = typeof val === 'string' ? val.trim() : String(val ?? '').trim()
    if (segmento) {
      counts[segmento] = (counts[segmento] ?? 0) + 1
    }
  }

  return Object.entries(counts)
    .map(([segmento, count]) => ({ segmento, count }))
    .sort((a, b) => b.count - a.count)
}

/** Formularios con su cantidad de inscripciones (para Registro por eventos) */
export async function getFormsWithSubmissionCount(orgId?: string | null): Promise<
  { id: string; titulo: string; count: number }[]
> {
  if (!supabase) return []
  if (!orgId) return []

  const forms = await getAllFormsClient(orgId)
  const result: { id: string; titulo: string; count: number }[] = []

  for (const form of forms) {
    const count = await getSubmissionCountClient(form.id)
    result.push({ id: form.id, titulo: form.titulo, count })
  }

  return result.sort((a, b) => b.count - a.count)
}

/** Actualiza un formulario existente */
export async function updateFormClient(
  id: string,
  input: Partial<FormInsertInput>
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase no configurado' }

  const updateData: Record<string, unknown> = {}
  if (input.titulo !== undefined) updateData.titulo = input.titulo
  if (input.slug !== undefined) updateData.slug = input.slug
  if (input.evento_id !== undefined) updateData.evento_id = input.evento_id
  if (input.descripcion !== undefined) updateData.descripcion = input.descripcion
  if (input.icon_url !== undefined) updateData.icon_url = input.icon_url
  if (input.cover_url !== undefined) updateData.cover_url = input.cover_url
  if (input.campos !== undefined) updateData.campos = input.campos as unknown as Json
  if (input.brevo_list_id !== undefined) updateData.brevo_list_id = input.brevo_list_id
  if (input.activo !== undefined) updateData.activo = input.activo

  const { error } = await supabase.from('forms').update(updateData).eq('id', id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

/** Elimina un formulario (y sus inscripciones por CASCADE) */
export async function deleteFormClient(
  id: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Supabase no configurado' }

  const { error } = await supabase.from('forms').delete().eq('id', id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
