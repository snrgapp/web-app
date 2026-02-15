'use server'

import { createServerClient } from '@/utils/supabase/server'
import type { Asistente, Evento } from '@/types/database.types'

// ─── Eventos ──────────────────────────────────────────────────

export async function getEventoByCheckinSlug(slug: string): Promise<Evento | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const { data } = await supabase
    .from('eventos')
    .select('*')
    .eq('checkin_slug', slug)
    .single()

  return data as Evento | null
}

/** Obtiene el evento legacy (checkin_slug = 'legacy') para flujo sin ?event= */
export async function getEventoLegacy(): Promise<Evento | null> {
  return getEventoByCheckinSlug('legacy')
}

/** Evento con conteo de asistentes para dashboard */
export interface EventoConCount {
  id: string
  titulo: string | null
  image_url: string
  checkin_slug: string | null
  count: number
}

export async function getEventosConCountAsistentes(): Promise<EventoConCount[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data: eventos } = await supabase
    .from('eventos')
    .select('id, titulo, image_url, checkin_slug')
    .order('orden', { ascending: true })
    .order('created_at', { ascending: false })

  if (!eventos?.length) return []

  const { data: counts } = await supabase
    .from('asistentes')
    .select('evento_id')

  const byEvent: Record<string, number> = {}
  ;(counts ?? []).forEach((r: { evento_id: string | null }) => {
    const id = r.evento_id ?? '_sin_evento'
    byEvent[id] = (byEvent[id] ?? 0) + 1
  })

  return eventos
    .map((e) => ({
      id: e.id,
      titulo: e.titulo,
      image_url: e.image_url ?? '',
      checkin_slug: e.checkin_slug,
      count: byEvent[e.id] ?? 0,
    }))
    .filter((e) => e.count > 0)
}

// ─── Verificación ─────────────────────────────────────────────

export async function verificarAsistente(
  telefono: string,
  eventoId: string | null = null
): Promise<{ ok: true; asistente: Asistente } | { ok: false; error: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const normalizado = telefono.replace(/[\s\-]/g, '')

  let query = supabase
    .from('asistentes')
    .select('*')
    .eq('telefono', normalizado)

  if (eventoId) {
    query = query.eq('evento_id', eventoId)
  } else {
    const legacy = await getEventoLegacy()
    if (legacy) {
      query = query.eq('evento_id', legacy.id)
    }
  }

  const { data, error } = await query.single()

  if (error || !data) {
    return { ok: false, error: 'No estás registrado para este evento.' }
  }

  return { ok: true, asistente: data as Asistente }
}

export async function getAsistenteById(id: string): Promise<Asistente | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const { data } = await supabase
    .from('asistentes')
    .select('*')
    .eq('id', id)
    .single()

  return data as Asistente | null
}

// ─── Mesas ────────────────────────────────────────────────────

export async function getAsistentesPorMesa(
  mesa: string,
  ronda: 1 | 2,
  eventoId?: string | null
): Promise<Asistente[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const column = ronda === 1 ? 'mesa' : 'mesa_ronda2'

  let query = supabase
    .from('asistentes')
    .select('*')
    .eq(column, mesa)
    .order('nombre', { ascending: true })
    .limit(5)

  if (eventoId) {
    query = query.eq('evento_id', eventoId)
  } else {
    const legacy = await getEventoLegacy()
    if (legacy) {
      query = query.eq('evento_id', legacy.id)
    }
  }

  const { data } = await query
  return (data ?? []) as Asistente[]
}

// ─── Feedback ───────────────────────────────────────────────────

export async function guardarFeedbackNetworking(
  asistenteId: string,
  rating: number
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  if (rating < 1 || rating > 5) {
    return { ok: false, error: 'La calificación debe ser entre 1 y 5.' }
  }

  const { error } = await supabase.from('feedback_networking').insert({
    asistente_id: asistenteId,
    rating,
  })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export interface FeedbackConAsistente {
  id: string
  asistente_id: string
  rating: number
  created_at: string
  asistentes: {
    nombre: string | null
    apellido: string | null
    empresa: string | null
    telefono: string | null
  } | null
}

export async function getFeedbackNetworking(): Promise<FeedbackConAsistente[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('feedback_networking')
    .select(`
      id,
      asistente_id,
      rating,
      created_at,
      asistentes (
        nombre,
        apellido,
        empresa,
        telefono
      )
    `)
    .order('created_at', { ascending: false })

  return (data ?? []) as unknown as FeedbackConAsistente[]
}
