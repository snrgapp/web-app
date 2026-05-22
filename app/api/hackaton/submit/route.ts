import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { recomputeHackathonMatches } from '@/services/hackathon-matching'
import { hackathonOnRegistro } from '@/lib/hackathon-eventos'

const PERFIL = new Set(['frontend', 'backend', 'full_stack', 'data_analyst'])

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nombreCompleto = str(body.nombre_completo)
    const telefonoRaw = typeof body.telefono === 'string' ? body.telefono : ''
    const telefono = normalizeTelefono(telefonoRaw)
    const perfil = str(body.perfil)

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

    try {
      await recomputeHackathonMatches()
    } catch (err) {
      console.error('hackathon matching job:', err)
    }

    try {
      await hackathonOnRegistro({
        nombre: nombreCompleto,
        telefono,
        badge_id: data.badge_id as string,
      })
    } catch (smsErr) {
      console.error('hackathon SMS registro:', smsErr)
    }

    return NextResponse.json({ ok: true, id: data.id, badge_id: data.badge_id })
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }
}
