import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { enviarPasesEvento, mananaBogota } from '@/lib/pase'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorize(req: NextRequest): { ok: true } | { ok: false; status: number; body: string } {
  const secret = process.env.CRON_SECRET ?? process.env.RADAR_CRON_SECRET
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') return { ok: true }
    return { ok: false, status: 503, body: 'Define CRON_SECRET para enviar los pases.' }
  }
  const auth = req.headers.get('authorization')?.trim()
  if (auth !== `Bearer ${secret}`) return { ok: false, status: 401, body: 'Unauthorized' }
  return { ok: true }
}

async function run(req: NextRequest) {
  const auth = authorize(req)
  if (!auth.ok) return NextResponse.json({ error: auth.body }, { status: auth.status })

  const db = createAdminClient()
  if (!db) return NextResponse.json({ error: 'Sin clave de servicio' }, { status: 503 })

  const manana = mananaBogota()
  const { data: eventos, error } = await db
    .from('eventos')
    .select('id, titulo, fecha, pase_recordatorio')
    .eq('fecha', manana)
    .eq('pase_recordatorio', true)
    .neq('estado', 'borrador')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const resultados = []
  for (const e of eventos ?? []) {
    resultados.push({ evento: e.titulo, ...(await enviarPasesEvento(db, e.id)) })
  }
  return NextResponse.json({ ok: true, manana, resultados })
}

export async function GET(req: NextRequest) {
  return run(req)
}

export async function POST(req: NextRequest) {
  return run(req)
}
