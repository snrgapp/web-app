'use server'

import { createServerClient } from '@/utils/supabase/server'
import type { Asistente } from '@/types/database.types'

// ─── Verificación ─────────────────────────────────────────────

export async function verificarAsistente(
  telefono: string
): Promise<{ ok: true; asistente: Asistente } | { ok: false; error: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const normalizado = telefono.replace(/[\s\-]/g, '')

  const { data, error } = await supabase
    .from('asistentes')
    .select('*')
    .eq('telefono', normalizado)
    .single()

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
  ronda: 1 | 2
): Promise<Asistente[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const column = ronda === 1 ? 'mesa' : 'mesa_ronda2'

  const { data } = await supabase
    .from('asistentes')
    .select('*')
    .eq(column, mesa)
    .order('nombre', { ascending: true })
    .limit(5)

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
