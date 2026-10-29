import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { extraerTokenPase } from '@/lib/pase'

export const dynamic = 'force-dynamic'

async function staffDe(token: string) {
  const db = createAdminClient()
  if (!db) return { db: null, staff: null }
  const { data: staff } = await db.from('evento_staff').select('*').eq('invite_token', token).maybeSingle()
  return { db, staff }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = String(params.token || '').replace(/[^a-zA-Z0-9]/g, '')
  const { db, staff } = await staffDe(token)
  if (!db) return NextResponse.json({ ok: false, error: 'Servidor sin clave de servicio' }, { status: 503 })
  if (!staff) return NextResponse.json({ ok: false, error: 'Enlace de puerta inválido' }, { status: 404 })

  const [{ data: evento }, { data: asistentes }] = await Promise.all([
    db.from('eventos').select('*').eq('id', staff.evento_id).maybeSingle(),
    db
      .from('asistentes')
      .select('id, nombre, apellido, correo, empresa, tipo_ticket, estado_pago, checked_in_at, ticket_token, created_at')
      .eq('evento_id', staff.evento_id)
      .order('created_at', { ascending: false }),
  ])
  if (!evento) return NextResponse.json({ ok: false, error: 'Evento no encontrado' }, { status: 404 })

  return NextResponse.json({
    ok: true,
    staff: { email: staff.email, nombre: staff.nombre, rol: staff.rol },
    evento,
    asistentes: asistentes ?? [],
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const token = String(params.token || '').replace(/[^a-zA-Z0-9]/g, '')
  const { db, staff } = await staffDe(token)
  if (!db) return NextResponse.json({ ok: false, error: 'Servidor sin clave de servicio' }, { status: 503 })
  if (!staff) return NextResponse.json({ ok: false, error: 'Enlace de puerta inválido' }, { status: 404 })
  if (staff.rol === 'viewer') {
    return NextResponse.json({ ok: false, error: 'Este rol solo puede consultar, no hacer check-in' }, { status: 403 })
  }

  const body = (await req.json().catch(() => ({}))) as { asistente_id?: string; clave?: string }
  let q = db.from('asistentes').select('*').eq('evento_id', staff.evento_id)
  if (body.asistente_id) q = q.eq('id', body.asistente_id)
  else if (body.clave) q = q.eq('ticket_token', extraerTokenPase(body.clave))
  else return NextResponse.json({ ok: false, error: 'Falta el asistente o la clave del pase' }, { status: 400 })

  const { data: a } = await q.maybeSingle()
  if (!a) return NextResponse.json({ ok: false, error: 'No hay un pase con esa clave' }, { status: 404 })

  const estado = String(a.estado_pago || '')
  if (['pago_pendiente', 'por_aprobar', 'lista_espera', 'rechazado'].includes(estado) && !a.checked_in_at) {
    return NextResponse.json({ ok: false, error: 'Este pase no está autorizado: el pago sigue pendiente' }, { status: 409 })
  }

  const { data: fila, error } = await db
    .from('asistentes')
    .update({ checked_in_at: new Date().toISOString() })
    .eq('id', a.id)
    .select()
    .single()
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, fila })
}
