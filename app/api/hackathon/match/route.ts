import { NextRequest, NextResponse } from 'next/server'
import { authorizeHackathonCron } from '@/app/api/hackathon/_authorize'
import { recomputeHackathonMatches } from '@/services/hackathon-matching'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** Cron / operaciones: recomputar sugerencias en `match_hackaton` (sin formación de equipos). */
export async function POST(_req: NextRequest) {
  const auth = authorizeHackathonCron(_req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.body }, { status: auth.status })
  }
  const result = await recomputeHackathonMatches()
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
