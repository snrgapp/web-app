'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'

export async function crearHackathonEquipo(input: {
  numero: number
  nombre?: string
  cuposMax?: number
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Sin conexión' }
  if (!Number.isFinite(input.numero) || input.numero < 1) {
    return { ok: false, error: 'Número de equipo inválido' }
  }
  const cupos = input.cuposMax ?? 5
  if (cupos < 1 || cupos > 20) return { ok: false, error: 'Cupos entre 1 y 20' }

  const { data, error } = await supabase
    .from('hackaton_equipos')
    .insert({
      numero: input.numero,
      nombre: input.nombre?.trim() || '',
      cupos_max: cupos,
    })
    .select('id')
    .single()

  if (error) {
    if (error.code === '23505') {
      return { ok: false, error: 'Ya existe un equipo con ese número' }
    }
    return { ok: false, error: error.message }
  }
  revalidatePath('/panel/hackathon')
  return { ok: true, id: data.id }
}

export async function asignarHackathonMiembro(input: {
  equipoId: string
  submissionId: string
  ronda: 1 | 2
  orden?: number
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Sin conexión' }

  const { data: equipo } = await supabase
    .from('hackaton_equipos')
    .select('cupos_max')
    .eq('id', input.equipoId)
    .maybeSingle()

  const max = equipo?.cupos_max ?? 5

  const { data: ya } = await supabase
    .from('hackaton_equipo_miembros')
    .select('equipo_id')
    .eq('submission_id', input.submissionId)
    .eq('ronda', input.ronda)
    .maybeSingle()

  if (ya?.equipo_id === input.equipoId) {
    revalidatePath('/panel/hackathon')
    return { ok: true }
  }

  const { count: destCount, error: cErr } = await supabase
    .from('hackaton_equipo_miembros')
    .select('*', { count: 'exact', head: true })
    .eq('equipo_id', input.equipoId)
    .eq('ronda', input.ronda)

  if (cErr) return { ok: false, error: cErr.message }

  if ((destCount ?? 0) >= max) {
    return { ok: false, error: 'El equipo ya completó los cupos' }
  }

  await supabase
    .from('hackaton_equipo_miembros')
    .delete()
    .eq('submission_id', input.submissionId)
    .eq('ronda', input.ronda)

  const { error } = await supabase.from('hackaton_equipo_miembros').insert({
    equipo_id: input.equipoId,
    submission_id: input.submissionId,
    ronda: input.ronda,
    orden: input.orden ?? 0,
  })

  if (error) {
    return { ok: false, error: error.message }
  }
  revalidatePath('/panel/hackathon')
  return { ok: true }
}

export async function quitarHackathonMiembro(input: {
  equipoId: string
  submissionId: string
  ronda: 1 | 2
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createAdminClient()
  if (!supabase) return { ok: false, error: 'Sin conexión' }
  const { error } = await supabase
    .from('hackaton_equipo_miembros')
    .delete()
    .eq('equipo_id', input.equipoId)
    .eq('submission_id', input.submissionId)
    .eq('ronda', input.ronda)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/panel/hackathon')
  return { ok: true }
}
