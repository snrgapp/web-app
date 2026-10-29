import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { phoneDigitsCo, sendInalambriaSmsBroadcast } from '@/lib/inalambria'
import { sendBirdEmail } from '@/lib/bird-email'
import { debeConfirmarPago, enviarConfirmacionPago } from '@/lib/pago-confirmacion'
import { enviarPasesEvento, htmlStaffEmail, puertaUrl } from '@/lib/pase'

export const dynamic = 'force-dynamic'

type Tabla = 'eventos' | 'asistentes' | 'evento_form_campos' | 'evento_mensajes' | 'evento_pagos' | 'evento_staff'

const COLUMNAS: Record<Tabla, string[]> = {
  eventos: [
    'titulo', 'fecha', 'ciudad', 'lugar', 'formato', 'estado', 'capacidad', 'precio_cop',
    'hora_inicio', 'hora_fin', 'acerca_del_evento', 'image_url', 'checkin_slug', 'inscripcion_abierta',
    'agenda', 'lista_espera', 'patrocinadores', 'incluye', 'pase_recordatorio',
  ],
  asistentes: [
    'evento_id', 'nombre', 'apellido', 'telefono', 'correo', 'empresa', 'sector', 'cargo', 'tipo_ticket',
    'estado_pago', 'checked_in_at', 'origen_registro', 'genero', 'rango_edad', 'tamano_equipo',
    'antiguedad', 'formalizada', 'soluciones', 'desafios',
  ],
  evento_form_campos: ['evento_id', 'label', 'tipo', 'obligatorio', 'opciones', 'orden'],
  evento_mensajes: [
    'evento_id', 'canal', 'titulo', 'asunto', 'cuerpo', 'tipo', 'disparador', 'activo', 'programado_at', 'estado',
  ],
  evento_pagos: [
    'evento_id', 'asistente_id', 'pagador', 'correo', 'correo_origen_pago', 'monto_cop', 'estado', 'canal',
    'comprobante_url', 'notas', 'referencia', 'entradas', 'concepto',
  ],
  evento_staff: ['evento_id', 'email', 'nombre', 'rol'],
}

const TABLAS_CON_ORG: Tabla[] = ['eventos', 'evento_form_campos', 'evento_mensajes', 'evento_pagos', 'evento_staff']

function limpiar(tabla: Tabla, valores: Record<string, unknown>) {
  const out: Record<string, unknown> = {}
  for (const k of COLUMNAS[tabla]) {
    if (!(k in valores)) continue
    const v = valores[k]
    out[k] = v === '' ? null : v
  }
  return out
}

function slugify(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
}

async function contexto() {
  const supabase = await createServerClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null
  const orgId = await getDefaultOrgId()
  if (!orgId) return null
  return { db: supabase as unknown as SupabaseClient, orgId, user: data.user }
}

async function idsEventos(db: SupabaseClient, orgId: string) {
  const { data } = await db.from('eventos').select('id').eq('organizacion_id', orgId)
  return (data ?? []).map((e: { id: string }) => e.id)
}

async function eventoDeLaOrg(db: SupabaseClient, orgId: string, eventoId: unknown) {
  if (typeof eventoId !== 'string' || !eventoId) return false
  const { data } = await db.from('eventos').select('id').eq('id', eventoId).eq('organizacion_id', orgId).maybeSingle()
  return Boolean(data)
}

async function convitarStaff(db: SupabaseClient, staff: Record<string, unknown>) {
  const { data: evento } = await db.from('eventos').select('*').eq('id', staff.evento_id).maybeSingle()
  const url = puertaUrl(String(staff.invite_token || ''))
  const mail = await sendBirdEmail({
    to: [{ email: String(staff.email), name: String(staff.nombre || '') || undefined }],
    subject: `Invitación de puerta · ${evento?.titulo || 'Synergy'}`,
    html: htmlStaffEmail({ evento: evento || {}, rol: String(staff.rol || 'puerta'), urlPuerta: url }),
    text: `Te invitaron a la puerta de ${evento?.titulo || 'un evento Synergy'}. Enlace: ${url}`,
    category: 'transactional',
    tags: { tipo: 'staff_puerta' },
  })
  return { ok: mail.success, error: mail.error, url }
}

function rellenar(texto: string, a: Record<string, unknown>, ev: Record<string, unknown> | null) {
  const nombre = String(a.nombre ?? '').trim() || 'Hola'
  return texto
    .replaceAll('{Nombre}', nombre)
    .replaceAll('{primer_nombre}', nombre.split(' ')[0])
    .replaceAll('{Tipo_Ticket}', String(a.tipo_ticket ?? 'General'))
    .replaceAll('{Fecha_Evento}', String(ev?.fecha ?? ''))
    .replaceAll('{Ubicacion_Mapa}', String(ev?.lugar ?? ev?.ciudad ?? ''))
    .replaceAll('{Link_QR}', a.ticket_token ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.snrg.lat'}/pase/${a.ticket_token}` : (ev?.checkin_slug ? `snrg.lat/evento/${ev.checkin_slug}` : 'snrg.lat'))
}

export async function GET() {
  const ctx = await contexto()
  if (!ctx) return NextResponse.json({ ok: false, error: 'Inicia sesión en el panel' }, { status: 401 })
  const { db, orgId, user } = ctx

  const [eventos, campos, mensajes, pagos, ajustes, miembros, staff] = await Promise.all([
    db.from('eventos').select('*').eq('organizacion_id', orgId).order('fecha', { ascending: false }),
    db.from('evento_form_campos').select('*').eq('organizacion_id', orgId).order('orden'),
    db.from('evento_mensajes').select('*').eq('organizacion_id', orgId).order('created_at', { ascending: false }),
    db.from('evento_pagos').select('*').eq('organizacion_id', orgId).order('created_at', { ascending: false }),
    db.from('evento_ajustes').select('*').eq('organizacion_id', orgId).maybeSingle(),
    db.from('organizacion_miembros').select('user_id, rol').eq('organizacion_id', orgId),
    db.from('evento_staff').select('*').eq('organizacion_id', orgId).order('created_at', { ascending: false }),
  ])

  const ids = (eventos.data ?? []).map((e: { id: string }) => e.id)
  const asistentes = ids.length
    ? await db.from('asistentes').select('*').in('evento_id', ids).order('created_at', { ascending: false })
    : { data: [] }

  return NextResponse.json({
    ok: true,
    usuario: { id: user.id, email: user.email },
    eventos: eventos.data ?? [],
    asistentes: asistentes.data ?? [],
    campos: campos.data ?? [],
    mensajes: mensajes.data ?? [],
    pagos: pagos.data ?? [],
    ajustes: ajustes.data ?? null,
    miembros: miembros.data ?? [],
    staff: staff.data ?? [],
  })
}

export async function POST(req: NextRequest) {
  const ctx = await contexto()
  if (!ctx) return NextResponse.json({ ok: false, error: 'Inicia sesión en el panel' }, { status: 401 })
  const { db, orgId } = ctx

  const body = (await req.json().catch(() => ({}))) as {
    op?: string
    tabla?: Tabla
    id?: string
    valores?: Record<string, unknown>
    telefono?: string
    texto?: string
  }
  const op = body.op

  if (op === 'crear' || op === 'editar' || op === 'eliminar') {
    const tabla = body.tabla
    if (!tabla || !(tabla in COLUMNAS)) return NextResponse.json({ ok: false, error: 'Tabla no permitida' }, { status: 400 })
    const valores = limpiar(tabla, body.valores ?? {})

    if (tabla !== 'eventos' && 'evento_id' in valores && valores.evento_id && !(await eventoDeLaOrg(db, orgId, valores.evento_id))) {
      return NextResponse.json({ ok: false, error: 'Evento no válido' }, { status: 400 })
    }

    if (tabla === 'asistentes' && body.id) {
      const ids = await idsEventos(db, orgId)
      const { data } = await db.from('asistentes').select('evento_id').eq('id', body.id).maybeSingle()
      if (!data || !ids.includes(data.evento_id)) {
        return NextResponse.json({ ok: false, error: 'Asistente no encontrado' }, { status: 404 })
      }
    }

    if (op === 'crear') {
      if (tabla === 'eventos') {
        const titulo = String(valores.titulo ?? '').trim()
        if (!titulo) return NextResponse.json({ ok: false, error: 'Ponle nombre al evento' }, { status: 400 })
        const base = slugify(String(valores.checkin_slug || titulo)) || 'evento'
        valores.checkin_slug = `${base}-${Math.random().toString(36).slice(2, 6)}`
        valores.image_url = valores.image_url ?? ''
        valores.orden = 0
        valores.estado = valores.estado ?? 'borrador'
        valores.inscripcion_abierta = valores.inscripcion_abierta ?? true
      }
      if (tabla === 'asistentes') {
        if (!valores.evento_id) return NextResponse.json({ ok: false, error: 'Elige el evento' }, { status: 400 })
        if (typeof valores.telefono === 'string') valores.telefono = phoneDigitsCo(valores.telefono).slice(-10)
        valores.origen_registro = valores.origen_registro ?? 'panel'
      }
      if (tabla === 'evento_staff') {
        const email = String(valores.email ?? '').trim().toLowerCase()
        if (!email.includes('@')) return NextResponse.json({ ok: false, error: 'Escribe un correo válido' }, { status: 400 })
        valores.email = email
        valores.rol = ['cohost', 'puerta', 'viewer', 'checkin'].includes(String(valores.rol))
          ? (valores.rol === 'checkin' ? 'puerta' : valores.rol)
          : 'puerta'
        valores.nombre = String(valores.nombre ?? '').trim() || email.split('@')[0]
      }
      if (TABLAS_CON_ORG.includes(tabla)) valores.organizacion_id = orgId
      let { data, error } = await db.from(tabla).insert(valores).select().single()
      if (error && tabla === 'evento_staff') {
        const { data: previo } = await db
          .from('evento_staff')
          .select('*')
          .eq('evento_id', valores.evento_id)
          .eq('email', valores.email)
          .maybeSingle()
        if (previo) {
          const { data: upd } = await db
            .from('evento_staff')
            .update({ rol: valores.rol, nombre: valores.nombre })
            .eq('id', previo.id)
            .select()
            .single()
          data = upd
          error = null
        }
      }
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
      if (tabla === 'eventos' && data?.id) {
        await db.from('evento_form_campos').insert({
          evento_id: data.id,
          organizacion_id: orgId,
          label: 'Nombre',
          tipo: 'nombre',
          obligatorio: true,
          orden: 0,
        })
      }
      if (tabla === 'evento_pagos' && debeConfirmarPago(data)) {
        const c = await enviarConfirmacionPago(db, data)
        return NextResponse.json({ ok: true, fila: c.fila, confirmacion: { ok: c.ok, error: c.error, correo: c.correo } })
      }
      if (tabla === 'evento_staff' && data) {
        const convite = await convitarStaff(db, data)
        return NextResponse.json({ ok: true, fila: data, convite })
      }
      return NextResponse.json({ ok: true, fila: data })
    }

    if (!body.id) return NextResponse.json({ ok: false, error: 'Falta id' }, { status: 400 })

    if (op === 'editar') {
      if (tabla === 'eventos' && 'image_url' in valores && valores.image_url == null) valores.image_url = ''
      if (tabla === 'asistentes' && typeof valores.telefono === 'string') {
        valores.telefono = phoneDigitsCo(valores.telefono).slice(-10)
      }
      let q = db.from(tabla).update(valores).eq('id', body.id)
      if (TABLAS_CON_ORG.includes(tabla)) q = q.eq('organizacion_id', orgId)
      const { data, error } = await q.select().single()
      if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
      if (tabla === 'evento_pagos' && debeConfirmarPago(data)) {
        const c = await enviarConfirmacionPago(db, data)
        return NextResponse.json({ ok: true, fila: c.fila, confirmacion: { ok: c.ok, error: c.error, correo: c.correo } })
      }
      return NextResponse.json({ ok: true, fila: data })
    }

    let q = db.from(tabla).delete().eq('id', body.id)
    if (TABLAS_CON_ORG.includes(tabla)) q = q.eq('organizacion_id', orgId)
    const { error } = await q
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true })
  }

  if (op === 'duplicar_evento') {
    const { data: ev } = await db.from('eventos').select('*').eq('id', body.id).eq('organizacion_id', orgId).maybeSingle()
    if (!ev) return NextResponse.json({ ok: false, error: 'Evento no encontrado' }, { status: 404 })
    const copia = limpiar('eventos', ev)
    copia.titulo = `${ev.titulo ?? 'Evento'} (copia)`
    copia.estado = 'borrador'
    copia.checkin_slug = `${slugify(String(ev.titulo ?? 'evento'))}-${Math.random().toString(36).slice(2, 6)}`
    copia.image_url = ev.image_url ?? ''
    const { data, error } = await db
      .from('eventos')
      .insert({ ...copia, organizacion_id: orgId, orden: 0 })
      .select()
      .single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    const { data: campos } = await db.from('evento_form_campos').select('*').eq('evento_id', ev.id)
    if (campos?.length) {
      await db.from('evento_form_campos').insert(
        campos.map((c: Record<string, unknown>) => ({
          ...limpiar('evento_form_campos', c),
          evento_id: data.id,
          organizacion_id: orgId,
        }))
      )
    }
    return NextResponse.json({ ok: true, fila: data })
  }

  if (op === 'reenviar_confirmacion') {
    const { data: pago } = await db.from('evento_pagos').select('*').eq('id', body.id).eq('organizacion_id', orgId).maybeSingle()
    if (!pago) return NextResponse.json({ ok: false, error: 'Pago no encontrado' }, { status: 404 })
    if (pago.estado !== 'aprobado') return NextResponse.json({ ok: false, error: 'Solo se confirma un pago aprobado' }, { status: 400 })
    const c = await enviarConfirmacionPago(db, pago)
    return NextResponse.json({ ok: c.ok, fila: c.fila, error: c.error, correo: c.correo })
  }

  if (op === 'sms_prueba') {
    const tel = phoneDigitsCo(String(body.telefono ?? ''))
    const texto = String(body.texto ?? '').trim()
    if (tel.length < 10) return NextResponse.json({ ok: false, error: 'Escribe un celular de 10 dígitos' }, { status: 400 })
    if (!texto) return NextResponse.json({ ok: false, error: 'El mensaje está vacío' }, { status: 400 })
    const r = await sendInalambriaSmsBroadcast(texto, [tel.slice(-10)])
    if (!r.ok) return NextResponse.json({ ok: false, error: r.error }, { status: 502 })
    return NextResponse.json({ ok: true })
  }

  if (op === 'enviar_mensaje') {
    const { data: msg } = await db.from('evento_mensajes').select('*').eq('id', body.id).eq('organizacion_id', orgId).maybeSingle()
    if (!msg) return NextResponse.json({ ok: false, error: 'Mensaje no encontrado' }, { status: 404 })
    if (!msg.evento_id) return NextResponse.json({ ok: false, error: 'El mensaje no tiene evento asignado' }, { status: 400 })

    const { data: ev } = await db.from('eventos').select('*').eq('id', msg.evento_id).maybeSingle()
    const { data: asist } = await db.from('asistentes').select('*').eq('evento_id', msg.evento_id)
    const lista = (asist ?? []) as Record<string, unknown>[]
    const canal = String(msg.canal ?? 'sms')
    let enviados = 0
    let fallidos = 0
    const errores: string[] = []

    if (canal === 'sms' || canal === 'email_sms') {
      const conTel = lista.filter((a) => phoneDigitsCo(String(a.telefono ?? '')).length >= 10)
      for (const a of conTel) {
        const r = await sendInalambriaSmsBroadcast(rellenar(String(msg.cuerpo), a, ev), [
          phoneDigitsCo(String(a.telefono)).slice(-10),
        ])
        if (r.ok) enviados++
        else {
          fallidos++
          if (r.error) errores.push(r.error)
        }
      }
    }
    if (canal === 'email' || canal === 'email_sms') {
      const conCorreo = lista.filter((a) => String(a.correo ?? '').includes('@'))
      for (const a of conCorreo) {
        const cuerpo = rellenar(String(msg.cuerpo), a, ev)
        const r = await sendBirdEmail({
          to: [{ email: String(a.correo), name: String(a.nombre ?? '') || undefined }],
          subject: rellenar(String(msg.asunto || msg.titulo || ev?.titulo || 'Synergy'), a, ev),
          text: cuerpo,
          html: `<p>${cuerpo.replace(/\n/g, '<br>')}</p>`,
        })
        if (r.success) enviados++
        else {
          fallidos++
          if (r.error) errores.push(r.error)
        }
      }
    }

    const estado = enviados > 0 ? (fallidos > 0 ? 'parcial' : 'enviado') : 'error'
    const { data: fila } = await db
      .from('evento_mensajes')
      .update({
        estado,
        enviados,
        fallidos,
        destinatarios: enviados + fallidos,
        enviado_at: new Date().toISOString(),
        error: errores[0] ?? null,
      })
      .eq('id', msg.id)
      .select()
      .single()
    return NextResponse.json({ ok: enviados > 0, fila, enviados, fallidos, error: errores[0] })
  }

  if (op === 'enviar_pases') {
    if (!body.id || !(await eventoDeLaOrg(db, orgId, body.id))) {
      return NextResponse.json({ ok: false, error: 'Evento no válido' }, { status: 400 })
    }
    const r = await enviarPasesEvento(db, body.id, { forzar: true })
    return NextResponse.json({ ...r, ok: r.ok })
  }

  if (op === 'ajustes') {
    const v = body.valores ?? {}
    const permitido = ['whatsapp_pagos', 'notificar_email', 'notificar_whatsapp', 'politica_reembolso', 'cuenta_dispersion', 'dia_dispersion']
    const fila: Record<string, unknown> = { organizacion_id: orgId, updated_at: new Date().toISOString() }
    for (const k of permitido) if (k in v) fila[k] = v[k] === '' ? null : v[k]
    const { data, error } = await db.from('evento_ajustes').upsert(fila).select().single()
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
    return NextResponse.json({ ok: true, fila: data })
  }

  return NextResponse.json({ ok: false, error: 'Operación desconocida' }, { status: 400 })
}
