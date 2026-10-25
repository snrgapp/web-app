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
  politicaReembolso: string | null
  ocupados: number
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
  const [{ data: campos }, { data: ajustes }, { count: ocupados }] = await Promise.all([
    db
      .from('evento_form_campos')
      .select('id, label, tipo, obligatorio, opciones, orden')
      .eq('evento_id', evento.id)
      .order('orden'),
    db
      .from('evento_ajustes')
      .select('whatsapp_pagos, politica_reembolso')
      .eq('organizacion_id', orgId)
      .maybeSingle(),
    db
      .from('asistentes')
      .select('id', { count: 'exact', head: true })
      .eq('evento_id', evento.id)
      .not('estado_pago', 'in', '(rechazado,lista_espera)'),
  ])
  const aj = ajustes as { whatsapp_pagos?: string | null; politica_reembolso?: string | null } | null

  return {
    evento: evento as EventoPublico['evento'],
    campos: (campos ?? []) as CampoEvento[],
    whatsappPagos: aj?.whatsapp_pagos?.trim() || null,
    politicaReembolso: aj?.politica_reembolso?.trim() || null,
    ocupados: ocupados ?? 0,
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
