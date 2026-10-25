import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { phoneDigitsCo } from '@/lib/inalambria'
import { registrarContactoEvento } from '@/lib/bird-contactos'
import {
  MAX_ARCHIVO_MB,
  camposPublicos,
  columnaDeCampo,
  opcionesCampo,
  type CampoEvento,
} from '@/lib/registro-evento'

export const dynamic = 'force-dynamic'

const TIPOS_ARCHIVO: Record<string, string> = {
  'application/pdf': 'pdf',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

function error(mensaje: string, status = 400, errores?: Record<string, string>) {
  return NextResponse.json({ ok: false, mensaje, errores }, { status })
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null)
  if (!form) return error('No pudimos leer el formulario')
  if (String(form.get('sitio_web') ?? '')) return NextResponse.json({ ok: true, estado: 'confirmado' })

  const supabase = await createServerClient()
  const orgId = await getDefaultOrgId()
  if (!supabase || !orgId) return error('Servicio no disponible', 503)
  const db = supabase as unknown as SupabaseClient

  const { data: evento } = await db
    .from('eventos')
    .select('id, titulo, ciudad, fecha, estado, capacidad, precio_cop, lista_espera, inscripcion_abierta')
    .eq('checkin_slug', String(form.get('evento') ?? ''))
    .eq('organizacion_id', orgId)
    .maybeSingle()
  if (!evento || evento.estado === 'borrador' || evento.estado === 'archivado') {
    return error('Este evento no está disponible', 404)
  }
  if (evento.inscripcion_abierta === false) return error('Las inscripciones de este evento están cerradas')

  const nombre = String(form.get('nombre') ?? '').trim()
  const correo = String(form.get('correo') ?? '').trim().toLowerCase()
  const telefono = phoneDigitsCo(String(form.get('telefono') ?? '')).slice(-10)
  const errores: Record<string, string> = {}
  if (nombre.length < 2) errores.nombre = 'Escribe tu nombre'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = 'Escribe un correo válido'
  if (telefono.length !== 10) errores.telefono = 'Escribe un celular de 10 dígitos'

  const { data: camposDb } = await db
    .from('evento_form_campos')
    .select('id, label, tipo, obligatorio, opciones, orden')
    .eq('evento_id', evento.id)
  const campos = camposPublicos((camposDb ?? []) as CampoEvento[])

  const respuestas: Record<string, string | string[]> = {}
  const columnas: Record<string, string> = {}
  const archivos: { campo: CampoEvento; archivo: File }[] = []

  for (const c of campos) {
    const clave = `campo_${c.id}`
    if (c.tipo === 'archivo') {
      const archivo = form.get(clave)
      if (archivo instanceof File && archivo.size) {
        if (!TIPOS_ARCHIVO[archivo.type]) errores[clave] = 'Sube un PDF o una imagen'
        else if (archivo.size > MAX_ARCHIVO_MB * 1024 * 1024) errores[clave] = `Máximo ${MAX_ARCHIVO_MB} MB`
        else archivos.push({ campo: c, archivo })
      } else if (c.obligatorio) errores[clave] = 'Este archivo es obligatorio'
      continue
    }
    if (c.tipo === 'multiple') {
      const permitidas = opcionesCampo(c)
      const elegidas = form.getAll(clave).map(String).filter((v) => permitidas.includes(v))
      if (elegidas.length) respuestas[c.label] = elegidas
      else if (c.obligatorio) errores[clave] = 'Elige al menos una opción'
      continue
    }
    let valor = String(form.get(clave) ?? '').trim().slice(0, 2000)
    if (c.tipo === 'si_no') valor = valor === 'si' ? 'Sí' : valor === 'no' ? 'No' : ''
    if (c.tipo === 'unica' && valor && !opcionesCampo(c).includes(valor)) valor = ''
    if (!valor) {
      if (c.obligatorio) errores[clave] = 'Este campo es obligatorio'
      continue
    }
    respuestas[c.label] = valor
    const col = columnaDeCampo(c.label)
    if (col) columnas[col] = valor
  }

  if (Object.keys(errores).length) return error('Revisa los campos marcados', 400, errores)

  const { data: previo } = await db
    .from('asistentes')
    .select('id')
    .eq('evento_id', evento.id)
    .or(`correo.eq."${correo}",telefono.eq."${telefono}"`)
    .limit(1)
    .maybeSingle()
  if (previo) return NextResponse.json({ ok: true, estado: 'ya_inscrito' })

  let estado = Number(evento.precio_cop) > 0 ? 'pago_pendiente' : 'confirmado'
  const capacidad = Number(evento.capacidad) || 0
  if (capacidad) {
    const { count } = await db
      .from('asistentes')
      .select('id', { count: 'exact', head: true })
      .eq('evento_id', evento.id)
      .not('estado_pago', 'in', '(rechazado,lista_espera)')
    if ((count ?? 0) >= capacidad) {
      if (!evento.lista_espera) return error('Los cupos de este evento están agotados')
      estado = 'lista_espera'
    }
  }

  for (const { campo, archivo } of archivos) {
    const ruta = `eventos/${evento.id}/${crypto.randomUUID()}.${TIPOS_ARCHIVO[archivo.type]}`
    const { error: subida } = await db.storage.from('formularios').upload(ruta, archivo, { contentType: archivo.type })
    if (subida) return error(`No pudimos subir el archivo de “${campo.label}”`, 502)
    respuestas[campo.label] = db.storage.from('formularios').getPublicUrl(ruta).data.publicUrl
  }

  const { error: alta } = await db.from('asistentes').insert({
    evento_id: evento.id,
    nombre,
    correo,
    telefono,
    ...columnas,
    respuestas,
    estado_pago: estado,
    origen_registro: 'formulario',
  })
  if (alta) return error('No pudimos registrar tu inscripción. Intenta de nuevo.', 500)

  const bird = await registrarContactoEvento({ email: correo, nombre, evento })
  if (!bird.success) console.warn(`[Bird] No se pudo registrar contacto: ${bird.error}`)

  return NextResponse.json({ ok: true, estado })
}
