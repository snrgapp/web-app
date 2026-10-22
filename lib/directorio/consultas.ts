import { createClient } from '@supabase/supabase-js'
import {
  EVENTO_DIRECTORIO,
  MENSAJE_CARGA,
  MENSAJE_CERRADO,
  MENSAJE_NO_ESTA,
  MENSAJE_SIN_CONEXION,
  MENSAJE_SIN_TABLA,
} from '@/lib/directorio/config'
import {
  estiloTarjeta,
  limpiarTexto,
  presentarPersona,
  sectoresUnicos,
  textoDisponibilidad,
  tituloDirectorio,
} from '@/lib/directorio/presentar'
import { leerSesionDirectorio } from '@/lib/directorio/sesion'
import { enlaceCorreo, enlaceWhatsapp, mostrarCelular, normalizarCelularColombia } from '@/lib/directorio/telefono'
import type { TarjetaDirectorio } from '@/lib/directorio/tipos'

type Fila = {
  id: string
  nombre: string
  apellido: string
  empresa: string
  sector: string
  soluciones: string
  desafios: string
  telefono: string
  correo: string | null
  visible: boolean
  access_expires_at: string
}

type Fallo = { ok: false; motivo: 'sin_conexion' | 'sin_tabla' | 'no_esta' | 'cerrado' | 'error'; mensaje: string }

export type EstadoDirectorio =
  | { tipo: 'puerta'; mensaje?: string }
  | { tipo: 'aviso'; mensaje: string }
  | {
      tipo: 'lista'
      tarjetas: TarjetaDirectorio[]
      titulo: string
      aviso: string
      sectores: string[]
    }

function cliente() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '')
    .trim()
    .replace(/\/$/, '')
  const key = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

function motivoDeError(error: { code?: string; message?: string }): 'sin_tabla' | 'error' {
  const code = error.code ?? ''
  const msg = (error.message ?? '').toLowerCase()
  if (
    code === '42P01' ||
    code === 'PGRST205' ||
    code === 'PGRST204' ||
    msg.includes('does not exist') ||
    msg.includes('schema cache') ||
    msg.includes('could not find the table')
  ) {
    return 'sin_tabla'
  }
  return 'error'
}

function mensajeDeMotivo(motivo: 'sin_tabla' | 'error'): string {
  return motivo === 'sin_tabla' ? MENSAJE_SIN_TABLA : MENSAJE_CARGA
}

const COLUMNAS =
  'id, nombre, apellido, empresa, sector, soluciones, desafios, telefono, correo, visible, access_expires_at'

export async function buscarAsistente(entrada: string): Promise<{ ok: true; fila: Fila } | Fallo> {
  const telefono = normalizarCelularColombia(entrada)
  if (!telefono) return { ok: false, motivo: 'no_esta', mensaje: MENSAJE_NO_ESTA }

  const supabase = cliente()
  if (!supabase) return { ok: false, motivo: 'sin_conexion', mensaje: MENSAJE_SIN_CONEXION }

  const { data, error } = await supabase
    .from('directory_attendees')
    .select(COLUMNAS)
    .eq('event_slug', EVENTO_DIRECTORIO)
    .eq('telefono', telefono)
    .maybeSingle()

  if (error) {
    const motivo = motivoDeError(error)
    console.error('[directorio] acceso', error.code ?? 'sin_codigo')
    return { ok: false, motivo, mensaje: mensajeDeMotivo(motivo) }
  }
  if (!data) return { ok: false, motivo: 'no_esta', mensaje: MENSAJE_NO_ESTA }

  const fila = data as Fila
  const expira = new Date(fila.access_expires_at)
  if (Number.isNaN(expira.getTime())) {
    return { ok: false, motivo: 'error', mensaje: MENSAJE_CARGA }
  }
  if (expira.getTime() <= Date.now()) {
    return { ok: false, motivo: 'cerrado', mensaje: MENSAJE_CERRADO }
  }
  return { ok: true, fila }
}

async function listarVisibles(): Promise<{ ok: true; tarjetas: TarjetaDirectorio[] } | Fallo> {
  const supabase = cliente()
  if (!supabase) return { ok: false, motivo: 'sin_conexion', mensaje: MENSAJE_SIN_CONEXION }

  const { data, error } = await supabase
    .from('directory_attendees')
    .select(COLUMNAS)
    .eq('event_slug', EVENTO_DIRECTORIO)
    .eq('visible', true)
    .gt('access_expires_at', new Date().toISOString())

  if (error) {
    const motivo = motivoDeError(error)
    console.error('[directorio] lista', error.code ?? 'sin_codigo')
    return { ok: false, motivo, mensaje: mensajeDeMotivo(motivo) }
  }

  const filas = ((data ?? []) as Fila[])
    .filter((fila) => fila.visible)
    .sort((a, b) =>
      `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`, 'es', { sensitivity: 'base' })
    )

  const tarjetas = filas.map((fila, indice) => {
    const persona = presentarPersona(fila.nombre, fila.apellido)
    const estilo = estiloTarjeta(indice)
    const correo = limpiarTexto(fila.correo)
    return {
      id: fila.id,
      nombre: persona.nombre,
      apellido: persona.apellido,
      iniciales: persona.iniciales,
      empresa: limpiarTexto(fila.empresa),
      sector: limpiarTexto(fila.sector),
      soluciones: limpiarTexto(fila.soluciones),
      desafios: limpiarTexto(fila.desafios),
      telefonoVisible: mostrarCelular(fila.telefono),
      whatsapp: enlaceWhatsapp(fila.telefono),
      correo: correo || null,
      correoHref: enlaceCorreo(correo),
      tono: estilo.tono,
      tamano: estilo.tamano,
    }
  })

  return { ok: true, tarjetas }
}

export async function cargarDirectorio(): Promise<EstadoDirectorio> {
  const sesion = await leerSesionDirectorio()
  if (!sesion) return { tipo: 'puerta' }

  const acceso = await buscarAsistente(sesion.phone)
  if (!acceso.ok) {
    if (acceso.motivo === 'error') return { tipo: 'aviso', mensaje: acceso.mensaje }
    return { tipo: 'puerta', mensaje: acceso.mensaje }
  }

  const lista = await listarVisibles()
  if (!lista.ok) return { tipo: 'aviso', mensaje: lista.mensaje }

  return {
    tipo: 'lista',
    tarjetas: lista.tarjetas,
    titulo: tituloDirectorio(lista.tarjetas.length),
    aviso: textoDisponibilidad(acceso.fila.access_expires_at),
    sectores: sectoresUnicos(lista.tarjetas.map((tarjeta) => tarjeta.sector)),
  }
}
