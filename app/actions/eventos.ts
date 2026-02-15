'use server'

import { createServerClient } from '@/utils/supabase/server'
import type { Evento } from '@/types/database.types'
import type { FormWithParsedFields } from '@/lib/forms'
import type { FormFieldConfig } from '@/types/form.types'

export type EventoConFormulario = {
  evento: Evento
  form: FormWithParsedFields | null
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

export async function getEventoConFormularioBySlug(
  slug: string
): Promise<EventoConFormulario | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const { data: evento, error: evError } = await supabase
    .from('eventos')
    .select('*')
    .eq('checkin_slug', slug)
    .single()

  if (evError || !evento) return null

  const { data: form } = await supabase
    .from('forms')
    .select('*')
    .eq('evento_id', evento.id)
    .eq('activo', true)
    .limit(1)
    .maybeSingle()

  const formParsed: FormWithParsedFields | null = form
    ? {
        ...form,
        campos: parseCampos(form.campos),
        brevo_list_id: (form as Record<string, unknown>).brevo_list_id as number | null ?? null,
      }
    : null

  return {
    evento: evento as Evento,
    form: formParsed,
  }
}
