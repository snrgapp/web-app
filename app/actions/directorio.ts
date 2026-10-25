'use server'

import { createServerClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import type { Asistente, Evento } from '@/types/database.types'
import {
  DIRECTORIO_EVENT_SLUG,
  directorioAbierto,
  diasRestantesDirectorio,
} from '@/lib/directorio'
import { getEventoByCheckinSlug, verificarAsistente } from '@/app/actions/networking'

export type DirectorioMeta = {
  abierto: boolean
  diasRestantes: number
  titulo: string
  fecha: string | null
  eventoId: string
}

export type DirectorioAsistente = Pick<
  Asistente,
  | 'id'
  | 'nombre'
  | 'apellido'
  | 'telefono'
  | 'correo'
  | 'empresa'
  | 'sector'
  | 'soluciones'
  | 'desafios'
  | 'mesa'
  | 'codigo_mesa'
>

async function getEventoDirectorio(): Promise<Evento | null> {
  return getEventoByCheckinSlug(DIRECTORIO_EVENT_SLUG)
}

export async function getDirectorioMeta(): Promise<DirectorioMeta | null> {
  const evento = await getEventoDirectorio()
  if (!evento?.fecha) return null
  return {
    abierto: directorioAbierto(evento.fecha),
    diasRestantes: diasRestantesDirectorio(evento.fecha),
    titulo: evento.titulo ?? 'Synergy',
    fecha: evento.fecha,
    eventoId: evento.id,
  }
}

async function listarAsistentesEvento(eventoId: string): Promise<DirectorioAsistente[]> {
  const supabase = createAdminClient() ?? (await createServerClient())
  if (!supabase) return []

  const { data } = await supabase
    .from('asistentes')
    .select(
      'id, nombre, apellido, telefono, correo, empresa, sector, soluciones, desafios, mesa, codigo_mesa'
    )
    .eq('evento_id', eventoId)
    .order('nombre', { ascending: true })

  return (data ?? []) as DirectorioAsistente[]
}

export async function entrarDirectorio(
  telefono: string
): Promise<
  | { ok: true; asistenteId: string; eventoId: string; asistentes: DirectorioAsistente[]; diasRestantes: number }
  | { ok: false; error: string }
> {
  const evento = await getEventoDirectorio()
  if (!evento?.fecha) return { ok: false, error: 'Directorio no disponible.' }
  if (!directorioAbierto(evento.fecha)) {
    return { ok: false, error: 'El acceso de 7 días ya cerró.' }
  }

  const result = await verificarAsistente(telefono, evento.id)
  if (!result.ok) return result

  const asistentes = await listarAsistentesEvento(evento.id)
  return {
    ok: true,
    asistenteId: result.asistente.id,
    eventoId: evento.id,
    asistentes,
    diasRestantes: diasRestantesDirectorio(evento.fecha),
  }
}

export async function recargarDirectorio(
  asistenteId: string
): Promise<
  | { ok: true; asistentes: DirectorioAsistente[]; diasRestantes: number }
  | { ok: false; error: string }
> {
  const evento = await getEventoDirectorio()
  if (!evento?.fecha) return { ok: false, error: 'Directorio no disponible.' }
  if (!directorioAbierto(evento.fecha)) {
    return { ok: false, error: 'El acceso de 7 días ya cerró.' }
  }

  const supabase = createAdminClient() ?? (await createServerClient())
  if (!supabase) return { ok: false, error: 'Error de conexión' }

  const { data: yo } = await supabase
    .from('asistentes')
    .select('id')
    .eq('id', asistenteId)
    .eq('evento_id', evento.id)
    .maybeSingle()

  if (!yo) return { ok: false, error: 'Sesión no válida.' }

  const asistentes = await listarAsistentesEvento(evento.id)
  return {
    ok: true,
    asistentes,
    diasRestantes: diasRestantesDirectorio(evento.fecha),
  }
}
