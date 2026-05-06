import { NextRequest, NextResponse } from 'next/server'
import {
  recomputePerrenqueMatches,
  type RecomputePerrenqueResult,
  type RecomputeOptions,
} from '@/services/perrenque-matching'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Vercel Cron envía Authorization: Bearer CRON_SECRET si está definido. */
function authorize(req: NextRequest): { ok: true } | { ok: false; status: number; body: string } {
  const secret = process.env.CRON_SECRET ?? process.env.PERRENQUE_RECOMPUTE_SECRET
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') {
      return { ok: true }
    }
    return {
      ok: false,
      status: 503,
      body: 'Define CRON_SECRET o PERRENQUE_RECOMPUTE_SECRET en producción para este endpoint.',
    }
  }
  const auth = req.headers.get('authorization')?.trim()
  if (auth !== `Bearer ${secret}`) {
    return { ok: false, status: 401, body: 'Unauthorized' }
  }
  return { ok: true }
}

function json(result: RecomputePerrenqueResult, status = 200) {
  return NextResponse.json(
    {
      ...result,
      groqApiKeyConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
    },
    { status }
  )
}

/** GET `?status=1` solo diagnostica env (sin recomputar). Requiere el mismo auth que POST. */
export async function GET(req: NextRequest) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.body }, { status: auth.status })
  }
  const showStatus = req.nextUrl.searchParams.get('status') === '1'
  if (showStatus) {
    return NextResponse.json({
      groqApiKeyConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
      supabaseServiceRoleConfigured: Boolean(
        process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() && process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
      ),
      note:
        'POST incremental por defecto (día activo desde env). `full` / `matchDay2` en query o JSON. Matching sin IA en servidor.',
    })
  }
  const full = req.nextUrl.searchParams.get('full') === '1'
  const matchDay2 = req.nextUrl.searchParams.get('matchDay2') === '1'
  const eventDayRaw = req.nextUrl.searchParams.get('eventDay')
  const eventDayParsed =
    eventDayRaw === '1' || eventDayRaw === '2' ? (Number(eventDayRaw) as 1 | 2) : undefined
  const result = await recomputePerrenqueMatches(
    matchDay2
      ? { matchDay2: true }
      : {
          mode: full ? 'full' : 'incremental',
          ...(eventDayParsed !== undefined ? { eventDay: eventDayParsed } : {}),
        }
  )
  return json(result, result.ok ? 200 : 500)
}

export async function POST(req: NextRequest) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.body }, { status: auth.status })
  }
  let full = req.nextUrl.searchParams.get('full') === '1'
  let matchDay2 = req.nextUrl.searchParams.get('matchDay2') === '1'
  let eventDay: RecomputeOptions['eventDay'] | undefined
  try {
    const body = (await req.json()) as {
      full?: boolean
      matchDay2?: boolean
      eventDay?: 1 | 2
    }
    if (!full) full = Boolean(body?.full)
    if (!matchDay2) matchDay2 = Boolean(body?.matchDay2)
    if (body?.eventDay === 1 || body?.eventDay === 2) eventDay = body.eventDay
  } catch {
    /* body vacío u otro content-type */
  }

  const result = await recomputePerrenqueMatches(
    matchDay2
      ? { matchDay2: true }
      : { mode: full ? 'full' : 'incremental', ...(eventDay !== undefined ? { eventDay } : {}) }
  )
  return json(result, result.ok ? 200 : 500)
}
