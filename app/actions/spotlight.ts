'use server'

import { createServerClient } from '@/utils/supabase/server'
import { Founder, Votante, Voto } from '@/types/database.types'

// ─── Votantes ───────────────────────────────────────────────

export async function verificarVotante(whatsapp: string): Promise<{ ok: true; votante: Votante } | { ok: false; error: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  // Normalizar: quitar espacios y guiones
  const normalizado = whatsapp.replace(/[\s\-]/g, '')

  const { data, error } = await supabase
    .from('votantes')
    .select('*')
    .eq('whatsapp', normalizado)
    .single()

  if (error || !data) {
    return { ok: false, error: 'No estás registrado para este evento.' }
  }

  return { ok: true, votante: data }
}

export async function getVotantes(): Promise<Votante[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('votantes')
    .select('*')
    .order('created_at', { ascending: false })

  return data ?? []
}

export async function crearVotante(votante: { whatsapp: string; nombre?: string; categoria: 'espectador' | 'jurado' }): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const normalizado = votante.whatsapp.replace(/[\s\-]/g, '')

  const { error } = await supabase
    .from('votantes')
    .insert({ ...votante, whatsapp: normalizado })

  if (error) {
    if (error.code === '23505') return { ok: false, error: 'Este WhatsApp ya está registrado.' }
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

export async function actualizarVotante(id: string, datos: { nombre?: string; categoria?: 'espectador' | 'jurado'; whatsapp?: string }): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  if (datos.whatsapp) {
    datos.whatsapp = datos.whatsapp.replace(/[\s\-]/g, '')
  }

  const { error } = await supabase
    .from('votantes')
    .update(datos)
    .eq('id', id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function eliminarVotante(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { error } = await supabase
    .from('votantes')
    .delete()
    .eq('id', id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// ─── Founders ───────────────────────────────────────────────

export async function getFoundersActivos(): Promise<Founder[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('founders')
    .select('*')
    .eq('activo', true)
    .order('pitch_order', { ascending: true })

  return data ?? []
}

export async function getAllFounders(): Promise<Founder[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('founders')
    .select('*')
    .order('pitch_order', { ascending: true })

  return data ?? []
}

export async function crearFounder(founder: {
  nombre: string
  startup_nombre: string
  image_url?: string
  pitch_order: number
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { error } = await supabase.from('founders').insert(founder)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function actualizarFounder(id: string, datos: {
  nombre?: string
  startup_nombre?: string
  image_url?: string | null
  pitch_order?: number
  activo?: boolean
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { error } = await supabase
    .from('founders')
    .update(datos)
    .eq('id', id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export async function eliminarFounder(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { error } = await supabase
    .from('founders')
    .delete()
    .eq('id', id)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

// ─── Votos ──────────────────────────────────────────────────

export async function getVotosDeVotante(votanteId: string): Promise<Voto[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data } = await supabase
    .from('votos')
    .select('*')
    .eq('votante_id', votanteId)

  return data ?? []
}

export async function guardarVoto(
  votanteId: string,
  founderId: string,
  scores: { score_innovacion: number; score_claridad: number; score_qa: number }
): Promise<{ ok: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { error } = await supabase.from('votos').insert({
    votante_id: votanteId,
    founder_id: founderId,
    ...scores,
  })

  if (error) {
    if (error.code === '23505') return { ok: false, error: 'Ya votaste por este founder.' }
    return { ok: false, error: error.message }
  }

  return { ok: true }
}

// ─── Resultados (Dashboard) ─────────────────────────────────

export interface FounderResultado {
  founder_id: string
  nombre: string
  startup_nombre: string
  image_url: string | null
  total_ponderado: number
  promedio_innovacion: number
  promedio_claridad: number
  promedio_qa: number
  total_votos: number
}

export async function getResultadosSpotlight(): Promise<FounderResultado[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  // Obtener todos los founders activos
  const { data: founders } = await supabase
    .from('founders')
    .select('*')
    .eq('activo', true)
    .order('pitch_order', { ascending: true })

  if (!founders || founders.length === 0) return []

  // Obtener todos los votos con info del votante
  const { data: votos } = await supabase
    .from('votos')
    .select('*, votantes(categoria)')

  if (!votos) {
    return founders.map((f) => ({
      founder_id: f.id,
      nombre: f.nombre,
      startup_nombre: f.startup_nombre,
      image_url: f.image_url,
      total_ponderado: 0,
      promedio_innovacion: 0,
      promedio_claridad: 0,
      promedio_qa: 0,
      total_votos: 0,
    }))
  }

  return founders.map((f) => {
    const votosFounder = votos.filter((v) => v.founder_id === f.id)
    const totalVotos = votosFounder.length

    if (totalVotos === 0) {
      return {
        founder_id: f.id,
        nombre: f.nombre,
        startup_nombre: f.startup_nombre,
        image_url: f.image_url,
        total_ponderado: 0,
        promedio_innovacion: 0,
        promedio_claridad: 0,
        promedio_qa: 0,
        total_votos: 0,
      }
    }

    let totalPonderado = 0
    let sumInno = 0
    let sumClaridad = 0
    let sumQa = 0

    for (const v of votosFounder) {
      const puntajeBase =
        v.score_innovacion * 0.40 +
        v.score_claridad * 0.35 +
        v.score_qa * 0.25

      const votanteData = v.votantes as unknown as { categoria: string } | null
      const multiplicador = votanteData?.categoria === 'jurado' ? 1.5 : 1.0

      totalPonderado += puntajeBase * multiplicador
      sumInno += v.score_innovacion
      sumClaridad += v.score_claridad
      sumQa += v.score_qa
    }

    return {
      founder_id: f.id,
      nombre: f.nombre,
      startup_nombre: f.startup_nombre,
      image_url: f.image_url,
      total_ponderado: Math.round(totalPonderado * 100) / 100,
      promedio_innovacion: Math.round((sumInno / totalVotos) * 100) / 100,
      promedio_claridad: Math.round((sumClaridad / totalVotos) * 100) / 100,
      promedio_qa: Math.round((sumQa / totalVotos) * 100) / 100,
      total_votos: totalVotos,
    }
  })
}

export async function getParticipacion(): Promise<{ votaron: number; total: number }> {
  const supabase = createServerClient()
  if (!supabase) return { votaron: 0, total: 0 }

  const { count: total } = await supabase
    .from('votantes')
    .select('*', { count: 'exact', head: true })

  const { data: votantesConVoto } = await supabase
    .from('votos')
    .select('votante_id')

  const uniqueVotantes = new Set(votantesConVoto?.map((v) => v.votante_id) ?? [])

  return { votaron: uniqueVotantes.size, total: total ?? 0 }
}
