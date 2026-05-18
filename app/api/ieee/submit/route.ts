import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { recomputeIeeeMatches } from '@/services/ieee-matching'

const AREAS = new Set([
  'Inteligencia Artificial',
  'Ciencia de Datos',
  'Ciberseguridad',
  'IoT',
  'Robótica',
  'Desarrollo de Software',
])

const TIPOS_CONEXION = new Set([
  'Mentoría',
  'Socios para proyectos',
  'Oportunidades laborales',
  'Colaboración en investigación',
  'Amistades profesionales',
])

/** Paso 3: conocimiento que podría ofrecer (una opción) */
const CONOCIMIENTO_OFRECER = new Set([
  'Desarrollo de software',
  'Inteligencia Artificial / Machine Learning',
  'Ciencia de Datos',
  'Ciberseguridad',
  'Robótica e IoT',
  'Electrónica y hardware',
])

function str(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t || null
}

function normalizeTelefono(raw: string): string | null {
  const d = raw.replace(/\D/g, '')
  if (d.length < 7 || d.length > 15) return null
  return d
}

function validEmail(s: string): boolean {
  return (
    s.length >= 5 &&
    s.length <= 320 &&
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(s)
  )
}

function parseStringArray(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null
  const out: string[] = []
  for (const x of v) {
    if (typeof x !== 'string') return null
    const t = x.trim()
    if (!t) return null
    out.push(t)
  }
  return out
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nombreCompleto = str(body.nombre_completo)
    const telefonoRaw = typeof body.telefono === 'string' ? body.telefono : ''
    const telefono = normalizeTelefono(telefonoRaw)
    const correoRaw = str(body.correo)
    const habilidades = str(body.habilidades_compartir)
    const areasRaw = parseStringArray(body.areas_interes)
    const tiposRaw = parseStringArray(body.tipos_conexion)

    if (!nombreCompleto || nombreCompleto.length < 2 || nombreCompleto.length > 200) {
      return NextResponse.json({ error: 'Indica tu nombre completo (2–200 caracteres)' }, { status: 400 })
    }
    if (!telefono) {
      return NextResponse.json(
        { error: 'Indica un WhatsApp/teléfono válido (7 a 15 dígitos)' },
        { status: 400 }
      )
    }
    if (!correoRaw || !validEmail(correoRaw)) {
      return NextResponse.json({ error: 'Indica un correo electrónico válido' }, { status: 400 })
    }
    if (!areasRaw || areasRaw.length === 0) {
      return NextResponse.json(
        { error: 'Selecciona al menos un área de interés' },
        { status: 400 }
      )
    }
    if (areasRaw.length > 6) {
      return NextResponse.json({ error: 'Demasiadas áreas de interés' }, { status: 400 })
    }
    for (const a of areasRaw) {
      if (!AREAS.has(a)) {
        return NextResponse.json({ error: 'Área de interés no válida' }, { status: 400 })
      }
    }
    if (!habilidades || !CONOCIMIENTO_OFRECER.has(habilidades)) {
      return NextResponse.json(
        { error: 'Selecciona qué tipo de conocimiento podrías ofrecer' },
        { status: 400 }
      )
    }
    if (!tiposRaw || tiposRaw.length === 0) {
      return NextResponse.json(
        { error: 'Selecciona al menos un tipo de conexión' },
        { status: 400 }
      )
    }
    for (const t of tiposRaw) {
      if (!TIPOS_CONEXION.has(t)) {
        return NextResponse.json({ error: 'Tipo de conexión no válido' }, { status: 400 })
      }
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Servicio no disponible. Intenta más tarde.' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from('ieee_networking_submissions')
      .insert({
        nombre_completo: nombreCompleto,
        telefono,
        correo: correoRaw,
        areas_interes: areasRaw,
        habilidades_compartir: habilidades,
        tipos_conexion: tiposRaw,
      })
      .select('id')
      .single()

    if (error) {
      console.error('ieee_networking_submissions insert:', error)
      const msg = String(error.message ?? '')
      const duplicate =
        error.code === '23505' ||
        /duplicate key|unique constraint/i.test(msg)
      if (duplicate) {
        return NextResponse.json(
          {
            error:
              'Ya hay un registro con ese número de WhatsApp/teléfono. Revisa o usa otro número.',
          },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'No se pudo guardar. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    try {
      await recomputeIeeeMatches()
    } catch (err) {
      console.error('ieee matching job:', err)
    }

    return NextResponse.json({ ok: true, id: data.id })
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }
}
