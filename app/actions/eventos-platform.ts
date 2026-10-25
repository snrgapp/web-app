'use server'

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { revalidatePath } from 'next/cache'

export type EventoPlat = {
  id: string
  titulo: string | null
  fecha: string | null
  ciudad: string | null
  checkin_slug: string | null
  estado: string
  formato: string
  capacidad: number | null
  precio_cop: number
  hora_inicio: string | null
  hora_fin: string | null
  lugar: string | null
  image_url: string | null
  acerca_del_evento: string | null
  asistentes: number
  checkins: number
}

export type AsistentePlat = {
  id: string
  nombre: string | null
  apellido: string | null
  telefono: string | null
  correo: string | null
  empresa: string | null
  evento_id: string | null
  checked_in_at: string | null
  estado_pago: string
  created_at: string | null
}

async function org() {
  const supabase = await createServerClient()
  const orgId = await getDefaultOrgId()
  return { supabase, orgId }
}

export async function listarEventosPlat(): Promise<EventoPlat[]> {
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) return []

  const { data: eventos } = await supabase
    .from('eventos')
    .select(
      'id, titulo, fecha, ciudad, checkin_slug, estado, formato, capacidad, precio_cop, hora_inicio, hora_fin, lugar, image_url, acerca_del_evento'
    )
    .eq('organizacion_id', orgId)
    .order('fecha', { ascending: false })

  const { data: counts } = await supabase
    .from('asistentes')
    .select('evento_id, checked_in_at')

  return (eventos ?? []).map((e) => {
    const rows = (counts ?? []).filter((c) => c.evento_id === e.id)
    return {
      ...e,
      estado: e.estado ?? 'activo',
      formato: e.formato ?? 'presencial',
      precio_cop: e.precio_cop ?? 0,
      asistentes: rows.length,
      checkins: rows.filter((r) => r.checked_in_at).length,
    } as EventoPlat
  })
}

export async function resumenDashboard() {
  const eventos = await listarEventosPlat()
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) {
    return {
      eventosActivos: 0,
      totalAsistentes: 0,
      ingresos: 0,
      checkinPct: 0,
      eventos,
    }
  }

  const { data: asistentes } = await supabase
    .from('asistentes')
    .select('id, checked_in_at, estado_pago, evento_id')

  const total = asistentes?.length ?? 0
  const checkins = (asistentes ?? []).filter((a) => a.checked_in_at).length
  const activos = eventos.filter((e) => e.estado !== 'finalizado').length
  const ingresos = eventos.reduce((sum, e) => {
    const pagados = (asistentes ?? []).filter(
      (a) => a.evento_id === e.id && a.estado_pago !== 'pendiente'
    ).length
    return sum + pagados * (e.precio_cop || 0)
  }, 0)

  return {
    eventosActivos: activos,
    totalAsistentes: total,
    ingresos,
    checkinPct: total ? Math.round((checkins / total) * 100) : 0,
    eventos,
  }
}

export async function crearEventoPlat(input: {
  titulo: string
  checkin_slug: string
  fecha: string
  ciudad: string
  formato: string
  capacidad: number | null
  precio_cop: number
  hora_inicio: string
  hora_fin: string
  lugar: string
  acerca_del_evento: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) return { ok: false, error: 'Sin organización' }

  const slug = input.checkin_slug.trim().toLowerCase().replace(/\s+/g, '-')
  if (!/^[a-z0-9-]+$/.test(slug)) return { ok: false, error: 'Slug inválido' }

  const { error } = await supabase.from('eventos').insert({
    titulo: input.titulo.trim(),
    checkin_slug: slug,
    fecha: input.fecha || null,
    ciudad: input.ciudad.trim() || null,
    formato: input.formato,
    capacidad: input.capacidad,
    precio_cop: input.precio_cop,
    hora_inicio: input.hora_inicio || null,
    hora_fin: input.hora_fin || null,
    lugar: input.lugar.trim() || null,
    acerca_del_evento: input.acerca_del_evento.trim() || null,
    estado: 'activo',
    organizacion_id: orgId,
    orden: 0,
    image_url: '',
    inscripcion_abierta: true,
  })

  if (error) return { ok: false, error: error.message }
  revalidatePath('/panel')
  revalidatePath('/panel/eventos')
  return { ok: true }
}

export async function listarAsistentesPlat(eventoId?: string | null): Promise<AsistentePlat[]> {
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) return []

  const { data: eventos } = await supabase.from('eventos').select('id').eq('organizacion_id', orgId)
  const ids = (eventos ?? []).map((e) => e.id)
  if (!ids.length) return []

  let q = supabase
    .from('asistentes')
    .select('id, nombre, apellido, telefono, correo, empresa, evento_id, checked_in_at, estado_pago, created_at')
    .in('evento_id', ids)
    .order('created_at', { ascending: false })

  if (eventoId) q = q.eq('evento_id', eventoId)

  const { data } = await q
  return (data ?? []) as AsistentePlat[]
}

export async function toggleCheckin(asistenteId: string): Promise<{ ok: boolean }> {
  const { supabase } = await org()
  if (!supabase) return { ok: false }
  const { data } = await supabase
    .from('asistentes')
    .select('checked_in_at')
    .eq('id', asistenteId)
    .maybeSingle()
  const next = data?.checked_in_at ? null : new Date().toISOString()
  const { error } = await supabase.from('asistentes').update({ checked_in_at: next }).eq('id', asistenteId)
  if (!error) {
    revalidatePath('/panel/asistentes')
    revalidatePath('/panel')
  }
  return { ok: !error }
}

export type FormCampo = {
  id: string
  evento_id: string
  label: string
  tipo: string
  obligatorio: boolean
  orden: number
}

export async function listarCamposForm(eventoId: string): Promise<FormCampo[]> {
  const { supabase } = await org()
  if (!supabase || !eventoId) return []
  const { data } = await supabase
    .from('evento_form_campos')
    .select('id, evento_id, label, tipo, obligatorio, orden')
    .eq('evento_id', eventoId)
    .order('orden')
  return (data ?? []) as FormCampo[]
}

export async function agregarCampoForm(input: {
  evento_id: string
  label: string
  tipo: string
  obligatorio: boolean
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) return { ok: false, error: 'Sin organización' }
  const { error } = await supabase.from('evento_form_campos').insert({
    evento_id: input.evento_id,
    organizacion_id: orgId,
    label: input.label.trim(),
    tipo: input.tipo,
    obligatorio: input.obligatorio,
    orden: 0,
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath('/panel/formularios')
  return { ok: true }
}

export async function borrarCampoForm(id: string) {
  const { supabase } = await org()
  if (!supabase) return
  await supabase.from('evento_form_campos').delete().eq('id', id)
  revalidatePath('/panel/formularios')
}

export type MensajePlat = {
  id: string
  canal: string
  asunto: string | null
  cuerpo: string
  estado: string
  destinatarios: number
  created_at: string
}

export async function listarMensajes(): Promise<MensajePlat[]> {
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) return []
  const { data } = await supabase
    .from('evento_mensajes')
    .select('id, canal, asunto, cuerpo, estado, destinatarios, created_at')
    .eq('organizacion_id', orgId)
    .order('created_at', { ascending: false })
    .limit(40)
  return (data ?? []) as MensajePlat[]
}

export async function guardarMensaje(input: {
  evento_id?: string
  canal: string
  asunto: string
  cuerpo: string
  enviar: boolean
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) return { ok: false, error: 'Sin organización' }
  if (!input.cuerpo.trim()) return { ok: false, error: 'Escribe el mensaje' }

  let dest = 0
  if (input.evento_id) {
    const { count } = await supabase
      .from('asistentes')
      .select('id', { count: 'exact', head: true })
      .eq('evento_id', input.evento_id)
    dest = count ?? 0
  }
  const { error } = await supabase.from('evento_mensajes').insert({
    organizacion_id: orgId,
    evento_id: input.evento_id || null,
    canal: input.canal,
    asunto: input.asunto.trim() || null,
    cuerpo: input.cuerpo.trim(),
    destinatarios: dest,
    estado: input.enviar ? 'enviado' : 'borrador',
    enviado_at: input.enviar ? new Date().toISOString() : null,
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath('/panel/notificaciones')
  return { ok: true }
}

export type PagoPlat = {
  id: string
  evento_id: string | null
  pagador: string | null
  correo: string | null
  correo_origen_pago: string | null
  monto_cop: number
  estado: string
  canal: string
  comprobante_url: string | null
  created_at: string
  evento_titulo?: string | null
}

export async function listarPagosPlat(): Promise<PagoPlat[]> {
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) return []
  const { data } = await supabase
    .from('evento_pagos')
    .select('id, evento_id, pagador, correo, correo_origen_pago, monto_cop, estado, canal, comprobante_url, created_at')
    .eq('organizacion_id', orgId)
    .order('created_at', { ascending: false })
    .limit(200)

  const eventos = await listarEventosPlat()
  const titles = new Map(eventos.map((e) => [e.id, e.titulo]))
  return ((data ?? []) as PagoPlat[]).map((p) => ({
    ...p,
    evento_titulo: p.evento_id ? titles.get(p.evento_id) ?? null : null,
  }))
}

export async function actualizarEstadoPago(id: string, estado: string) {
  const { supabase } = await org()
  if (!supabase) return { ok: false }
  const { error } = await supabase.from('evento_pagos').update({ estado }).eq('id', id)
  if (!error) revalidatePath('/panel/pagos')
  return { ok: !error }
}

export async function getAjustesPlat() {
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) return null
  const { data } = await supabase.from('evento_ajustes').select('*').eq('organizacion_id', orgId).maybeSingle()
  return (
    data ?? {
      organizacion_id: orgId,
      notificar_email: true,
      notificar_whatsapp: false,
      whatsapp_pagos: '',
    }
  )
}

export async function guardarAjustesPlat(input: {
  notificar_email: boolean
  notificar_whatsapp: boolean
  whatsapp_pagos: string
}) {
  const { supabase, orgId } = await org()
  if (!supabase || !orgId) return { ok: false, error: 'Sin organización' }
  const { error } = await supabase.from('evento_ajustes').upsert({
    organizacion_id: orgId,
    mp_conectado: false,
    mp_public_key: null,
    notificar_email: input.notificar_email,
    notificar_whatsapp: input.notificar_whatsapp,
    whatsapp_pagos: input.whatsapp_pagos.replace(/\D/g, '') || null,
    updated_at: new Date().toISOString(),
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath('/panel/ajustes')
  revalidatePath('/panel/pagos')
  return { ok: true }
}
