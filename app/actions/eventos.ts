'use server'

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId, getOrgIdBySlug } from '@/lib/org-resolver'
import type { Evento } from '@/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { CampoEvento } from '@/lib/registro-evento'

export type EventoPublico = {
  evento: Evento & { estado?: string | null }
  campos: CampoEvento[]
  whatsappPagos: string | null
}

export async function getEventoPublicoBySlug(
  slug: string,
  orgSlug?: string | null
): Promise<EventoPublico | null> {
  const supabase = await createServerClient()
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

  const db = supabase as unknown as SupabaseClient
  const [{ data: campos }, { data: ajustes }] = await Promise.all([
    db
      .from('evento_form_campos')
      .select('id, label, tipo, obligatorio, opciones, orden')
      .eq('evento_id', evento.id)
      .order('orden'),
    db.from('evento_ajustes').select('whatsapp_pagos').eq('organizacion_id', orgId).maybeSingle(),
  ])

  return {
    evento: evento as EventoPublico['evento'],
    campos: (campos ?? []) as CampoEvento[],
    whatsappPagos: (ajustes as { whatsapp_pagos?: string | null } | null)?.whatsapp_pagos ?? null,
  }
}

/** Lista eventos para la página pública /eventos. Filtra por org actual. */
export async function getEventosParaListado(): Promise<Evento[]> {
  const supabase = await createServerClient()
  if (!supabase) return []

  let orgId = await getDefaultOrgId()
  if (!orgId) {
    const { data: firstOrg } = await supabase
      .from('organizaciones')
      .select('id')
      .limit(1)
      .maybeSingle()
    orgId = firstOrg?.id ?? null
  }
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
