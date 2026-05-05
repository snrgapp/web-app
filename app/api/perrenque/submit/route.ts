import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { recomputePerrenqueMatches } from '@/services/perrenque-matching'

const IDENTIDAD = new Set([
  'Estudiante',
  'Emprendedor/a',
  'Empleado en empresa',
  'Freelance / Independiente',
  'Dueño/a de negocio',
  'Creativo/a',
])

const MOTIVACION = new Set([
  'Aprender algo nuevo',
  'Encontrar clientes o proyectos',
  'Conectar con personas afines',
  'Buscar empleo u oportunidades',
  'Curiosidad / me invitaron',
])

const MUNDO = new Set([
  'Marketing y publicidad',
  'Tecnología e innovación',
  'Negocios y emprendimiento',
  'Arte, cultura y medios',
  'Educación y academia',
  'Comunicación corporativa',
])

function str(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t || null
}

/** Solo dígitos, para llave única en BD (7–15). */
function normalizeTelefono(raw: string): string | null {
  const d = raw.replace(/\D/g, '')
  if (d.length < 7 || d.length > 15) return null
  return d
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nombreCompleto = str(body.nombre_completo)
    const telefonoRaw = typeof body.telefono === 'string' ? body.telefono : ''
    const telefono = normalizeTelefono(telefonoRaw)
    const identidad = str(body.identidad)
    const motivacion = str(body.motivacion)
    const mundo = str(body.mundo)
    const valorHumanoRaw = str(body.valor_humano)

    if (!nombreCompleto || nombreCompleto.length < 2 || nombreCompleto.length > 200) {
      return NextResponse.json({ error: 'Indica tu nombre completo (2–200 caracteres)' }, { status: 400 })
    }
    if (!telefono) {
      return NextResponse.json(
        { error: 'Indica un teléfono válido (7 a 15 dígitos)' },
        { status: 400 }
      )
    }
    if (!identidad || !IDENTIDAD.has(identidad)) {
      return NextResponse.json({ error: 'Opción "Soy" no válida' }, { status: 400 })
    }
    if (!motivacion || !MOTIVACION.has(motivacion)) {
      return NextResponse.json({ error: 'Opción "Vine a" no válida' }, { status: 400 })
    }
    if (!mundo || !MUNDO.has(mundo)) {
      return NextResponse.json({ error: 'Opción "Mi mundo" no válida' }, { status: 400 })
    }
    if (!valorHumanoRaw || valorHumanoRaw.length < 3) {
      return NextResponse.json(
        { error: 'Escribe al menos 3 caracteres en "Traigo"' },
        { status: 400 }
      )
    }
    if (valorHumanoRaw.length > 200) {
      return NextResponse.json({ error: 'Texto demasiado largo (máx. 200)' }, { status: 400 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Servicio no disponible. Intenta más tarde.' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from('perrenque_conecta_submissions')
      .insert({
        nombre_completo: nombreCompleto,
        telefono,
        identidad,
        motivacion,
        mundo,
        valor_humano: valorHumanoRaw,
      })
      .select('id')
      .single()

    if (error) {
      console.error('perrenque_conecta_submissions insert:', error)
      const msg = String(error.message ?? '')
      const duplicate =
        error.code === '23505' ||
        /duplicate key|unique constraint/i.test(msg)
      if (duplicate) {
        return NextResponse.json(
          {
            error:
              'mmm.. alguien ya se registró con ese numero de telefono, revisa y confirma',
          },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'No se pudo guardar. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    // Importante: en serverless (p. ej. Vercel) el trabajo en segundo plano con `void` suele
    // cancelarse al enviar la respuesta. Esperamos aquí para que grupos y matches existan.
    try {
      await recomputePerrenqueMatches()
    } catch (err) {
      console.error('perrenque matching job:', err)
    }

    return NextResponse.json({ ok: true, id: data.id })
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }
}
