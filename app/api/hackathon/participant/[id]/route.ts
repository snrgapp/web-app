import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { phoneDigitsCo } from '@/lib/inalambria'

export const dynamic = 'force-dynamic'

/** Datos del participante. Requiere ?telefono= para verificar identidad. */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const tel = req.nextUrl.searchParams.get('telefono')?.replace(/\D/g, '') ?? ''
  if (!tel || tel.length < 7) {
    return NextResponse.json({ error: 'Parámetro telefono inválido' }, { status: 400 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }

  const { data: row, error } = await supabase
    .from('hackaton_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !row) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  if (phoneDigitsCo(row.telefono as string) !== tel) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  return NextResponse.json({ participant: row })
}
