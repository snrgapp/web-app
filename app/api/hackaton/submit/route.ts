import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

const PERFIL = new Set(['frontend', 'backend', 'full_stack', 'data_analyst'])

const NIVEL = new Set(['principiante', 'intermedio', 'avanzado'])

const LENGUAJES_ALLOWED = new Set([
  'Python',
  'JavaScript',
  'C++',
  'TypeScript',
  'Java',
  'Go',
  'Rust',
  'SQL',
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

function validarLenguajes(raw: unknown): string[] | null {
  if (!Array.isArray(raw) || raw.length < 1) return null
  const out: string[] = []
  for (const item of raw) {
    if (typeof item !== 'string') return null
    const t = item.trim()
    if (!LENGUAJES_ALLOWED.has(t)) return null
    if (!out.includes(t)) out.push(t)
  }
  return out.length ? out : null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nombreCompleto = str(body.nombre_completo)
    const telefonoRaw = typeof body.telefono === 'string' ? body.telefono : ''
    const telefono = normalizeTelefono(telefonoRaw)
    const perfil = str(body.perfil)
    const nivelExperiencia = str(body.nivel_experiencia)
    const lenguajes = validarLenguajes(body.lenguajes)

    if (!nombreCompleto || nombreCompleto.length < 2 || nombreCompleto.length > 200) {
      return NextResponse.json(
        { error: 'Indica tu nombre completo (2–200 caracteres).' },
        { status: 400 }
      )
    }
    if (!telefono) {
      return NextResponse.json(
        { error: 'Indica un teléfono válido (7 a 15 dígitos).' },
        { status: 400 }
      )
    }
    if (!perfil || !PERFIL.has(perfil)) {
      return NextResponse.json({ error: 'Selecciona un perfil válido.' }, { status: 400 })
    }
    if (!lenguajes) {
      return NextResponse.json(
        { error: 'Selecciona al menos un lenguaje de la lista.' },
        { status: 400 }
      )
    }
    if (!nivelExperiencia || !NIVEL.has(nivelExperiencia)) {
      return NextResponse.json({ error: 'Selecciona tu nivel de experiencia.' }, { status: 400 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Servicio no disponible. Intenta más tarde.' },
        { status: 503 }
      )
    }

    const { data, error } = await supabase
      .from('hackaton_submissions')
      .insert({
        nombre_completo: nombreCompleto,
        telefono,
        perfil: perfil as 'frontend' | 'backend' | 'full_stack' | 'data_analyst',
        lenguajes,
        nivel_experiencia: nivelExperiencia as 'principiante' | 'intermedio' | 'avanzado',
      })
      .select('id, badge_id')
      .single()

    if (error) {
      console.error('hackaton_submissions insert:', error)
      const msg = String(error.message ?? '')
      const duplicate =
        error.code === '23505' ||
        /duplicate key|unique constraint/i.test(msg)
      if (duplicate) {
        return NextResponse.json(
          {
            error:
              'Ya hay un registro con ese número de teléfono. Revisa o usa otro número.',
          },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'No se pudo guardar. Intenta de nuevo.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, id: data.id, badge_id: data.badge_id })
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }
}
