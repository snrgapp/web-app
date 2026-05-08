import { NextRequest, NextResponse } from 'next/server'
import { authorizeHackathonCron } from '@/app/api/hackathon/_authorize'
import { createAdminClient } from '@/utils/supabase/admin'
import { hackathonOnRecordatorio } from '@/lib/hackathon-eventos'
import { phoneDigitsCo } from '@/lib/inalambria'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * SMS recordatorio (configura Vercel Cron con Authorization: Bearer CRON_SECRET).
 * Envía a inscritos que aún no tienen fila en hackaton_equipo_miembros.
 */
export async function GET(req: NextRequest) {
  const auth = authorizeHackathonCron(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.body }, { status: auth.status })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Sin Supabase' }, { status: 503 })
  }

  const [{ data: subs }, { data: mem }] = await Promise.all([
    supabase.from('hackaton_submissions').select('id, telefono'),
    supabase.from('hackaton_equipo_miembros').select('submission_id'),
  ])

  const assigned = new Set((mem ?? []).map((m) => m.submission_id as string))
  const targets =
    subs?.filter((s) => !assigned.has(s.id as string)).map((s) => phoneDigitsCo(s.telefono as string)) ??
    []

  const dedup = [...new Set(targets)].filter((p) => p.length >= 7)
  const sms = await hackathonOnRecordatorio(dedup)

  return NextResponse.json({
    ok: true,
    recipients: dedup.length,
    sms,
  })
}
