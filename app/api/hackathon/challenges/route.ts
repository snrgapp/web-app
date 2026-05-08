import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
  const { data, error } = await supabase
    .from('hackaton_challenges')
    .select('id, name, description')
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ challenges: data ?? [] })
}
