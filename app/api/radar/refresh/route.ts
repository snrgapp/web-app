import { NextRequest, NextResponse } from 'next/server'
import { refreshRadarConvocatorias } from '@/lib/radar-refresh'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorize(req: NextRequest): { ok: true } | { ok: false; status: number; body: string } {
  const secret = process.env.CRON_SECRET ?? process.env.RADAR_CRON_SECRET
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') return { ok: true }
    return {
      ok: false,
      status: 503,
      body: 'Define CRON_SECRET o RADAR_CRON_SECRET para refrescar el radar.',
    }
  }
  const auth = req.headers.get('authorization')?.trim()
  if (auth !== `Bearer ${secret}`) {
    return { ok: false, status: 401, body: 'Unauthorized' }
  }
  return { ok: true }
}

async function run(req: NextRequest) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.body }, { status: auth.status })
  }
  const result = await refreshRadarConvocatorias()
  return NextResponse.json(result)
}

export async function GET(req: NextRequest) {
  return run(req)
}

export async function POST(req: NextRequest) {
  return run(req)
}
