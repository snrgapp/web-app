import { NextRequest, NextResponse } from 'next/server'
import {
  recomputeGeniusMatches,
  type RecomputeGeniusResult,
} from '@/services/genius-matching'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorize(req: NextRequest): { ok: true } | { ok: false; status: number; body: string } {
  const secret = process.env.CRON_SECRET ?? process.env.GENIUS_RECOMPUTE_SECRET
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') {
      return { ok: true }
    }
    return {
      ok: false,
      status: 503,
      body: 'Define CRON_SECRET o GENIUS_RECOMPUTE_SECRET en producción para este endpoint.',
    }
  }
  const auth = req.headers.get('authorization')?.trim()
  if (auth !== `Bearer ${secret}`) {
    return { ok: false, status: 401, body: 'Unauthorized' }
  }
  return { ok: true }
}

function json(result: RecomputeGeniusResult, status = 200) {
  return NextResponse.json(result, { status })
}

/** POST recomputa match_genius para todos los inscritos Genius FEST. */
export async function POST(req: NextRequest) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.body }, { status: auth.status })
  }
  const result = await recomputeGeniusMatches()
  return json(result, result.ok ? 200 : 500)
}
