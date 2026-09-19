import { NextRequest, NextResponse } from 'next/server'
import { sendRadarWeeklyDigest } from '@/lib/radar-digest'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorize(req: NextRequest) {
  const secret = process.env.CRON_SECRET ?? process.env.RADAR_CRON_SECRET
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') return { ok: true as const }
    return { ok: false as const, status: 503, body: 'Define CRON_SECRET.' }
  }
  if (req.headers.get('authorization')?.trim() !== `Bearer ${secret}`) {
    return { ok: false as const, status: 401, body: 'Unauthorized' }
  }
  return { ok: true as const }
}

export async function GET(req: NextRequest) {
  const auth = authorize(req)
  if (!auth.ok) return NextResponse.json({ error: auth.body }, { status: auth.status })
  const result = await sendRadarWeeklyDigest()
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  return GET(req)
}
