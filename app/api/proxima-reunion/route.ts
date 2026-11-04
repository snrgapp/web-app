import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { avisarRegistroReunion } from '@/lib/reunion-aviso'

export const dynamic = 'force-dynamic'

const CIUDADES = ['Barranquilla', 'Cartagena', 'Pereira', 'Medellín', 'Bogotá', 'Cali']
const TIEMPOS = ['6m', '1y', '3y']
const FACTURACIONES = ['1-3m', '3-10m', '10m+']
const EQUIPOS = ['solo', 'small', 'medium']
const CAMARAS = ['natural', 'juridica', 'no']

function limpio(v: unknown) {
  return String(v ?? '').trim()
}

function sinTilde(v: string) {
  return v
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function ciudadOficial(v: string) {
  return CIUDADES.find((c) => sinTilde(c) === sinTilde(v)) || null
}

function correoOk(c: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)
}

export async function GET(req: NextRequest) {
  const correo = limpio(req.nextUrl.searchParams.get('correo')).toLowerCase()
  if (!correoOk(correo)) {
    return NextResponse.json({ ok: false, error: 'Escribe un correo válido' }, { status: 400 })
  }
  const db = createAdminClient()
  if (!db) return NextResponse.json({ ok: false, error: 'No hay conexión' }, { status: 500 })
  const { data } = await db
    .from('reunion_registros')
    .select('id')
    .ilike('correo', correo)
    .maybeSingle()
  return NextResponse.json({ ok: true, existe: Boolean(data) })
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const nombre = limpio(body.nombre)
  const apellido = limpio(body.apellido)
  const correo = limpio(body.correo).toLowerCase()
  const telefono = limpio(body.telefono).replace(/\D/g, '').slice(-10)
  const ciudad = ciudadOficial(limpio(body.ciudad))
  const empresa = limpio(body.empresa)
  const instagram = limpio(body.instagram).replace(/^@+/, '')
  const problema = limpio(body.problema).slice(0, 160)
  const tiempo = limpio(body.tiempo_empresa)
  const facturacion = limpio(body.facturacion)
  const equipo = limpio(body.tamano_equipo)
  const canales = Array.isArray(body.canales)
    ? body.canales.map((c) => limpio(c)).filter(Boolean)
    : []
  const camara = limpio(body.camara_comercio)
  const desafio = limpio(body.desafio).slice(0, 400)
  const terminos = body.acepto_terminos === true

  if (!nombre || !apellido) {
    return NextResponse.json({ ok: false, error: 'Nombre y apellido son obligatorios' }, { status: 400 })
  }
  if (!correoOk(correo)) {
    return NextResponse.json({ ok: false, error: 'Escribe un correo válido' }, { status: 400 })
  }
  if (!ciudad) {
    return NextResponse.json({ ok: false, error: 'Elige la ciudad de la reunión' }, { status: 400 })
  }
  if (!terminos) {
    return NextResponse.json({ ok: false, error: 'Debes aceptar los términos para postularte' }, { status: 400 })
  }

  const db = createAdminClient()
  if (!db) return NextResponse.json({ ok: false, error: 'No hay conexión' }, { status: 500 })

  const { data: previo } = await db
    .from('reunion_registros')
    .select('id')
    .ilike('correo', correo)
    .maybeSingle()
  if (previo) {
    return NextResponse.json({
      ok: false,
      duplicado: true,
      error: 'Este correo ya está registrado. Si necesitas actualizar tus datos, escríbenos.',
    }, { status: 409 })
  }

  const { data, error } = await db
    .from('reunion_registros')
    .insert({
      nombre,
      apellido,
      correo,
      telefono: telefono || null,
      ciudad,
      empresa: empresa || null,
      instagram: instagram || null,
      problema: problema || null,
      tiempo_empresa: TIEMPOS.includes(tiempo) ? tiempo : null,
      facturacion: FACTURACIONES.includes(facturacion) ? facturacion : null,
      tamano_equipo: EQUIPOS.includes(equipo) ? equipo : null,
      canales,
      camara_comercio: CAMARAS.includes(camara) ? camara : null,
      desafio: desafio || null,
      acepto_terminos: true,
    })
    .select('id')
    .single()

  if (error) {
    if (String(error.message || '').includes('reunion_registros_correo')) {
      return NextResponse.json({
        ok: false,
        duplicado: true,
        error: 'Este correo ya está registrado. Si necesitas actualizar tus datos, escríbenos.',
      }, { status: 409 })
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  }

  const mail = await avisarRegistroReunion({
    nombre,
    apellido,
    correo,
    telefono,
    ciudad,
    empresa,
    instagram,
    problema,
    tiempo_empresa: TIEMPOS.includes(tiempo) ? tiempo : null,
    facturacion: FACTURACIONES.includes(facturacion) ? facturacion : null,
    tamano_equipo: EQUIPOS.includes(equipo) ? equipo : null,
    canales,
    camara_comercio: CAMARAS.includes(camara) ? camara : null,
    desafio,
  })
  if (!mail.success) {
    console.error('[proxima-reunion] aviso Bird', mail.error)
  }

  return NextResponse.json({ ok: true, id: data.id })
}
