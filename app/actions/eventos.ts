'use server'

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId, getOrgIdBySlug } from '@/lib/org-resolver'
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
  slug: string,
  orgSlug?: string | null
): Promise<EventoConFormulario | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const orgId = orgSlug ? await getOrgIdBySlug(orgSlug) : await getDefaultOrgId()
  if (!orgId) return null

  const { data: evento, error: evError } = await supabase
    .from('eventos')
    .select('*')
    .eq('checkin_slug', slug)
    .eq('organizacion_id', orgId)
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

/** Lista eventos para la página pública /eventos. Filtra por org actual. */
export async function getEventosParaListado(): Promise<Evento[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const orgId = await getDefaultOrgId()
  if (!orgId) return []

  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('organizacion_id', orgId)
    .order('orden', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as Evento[]
}
