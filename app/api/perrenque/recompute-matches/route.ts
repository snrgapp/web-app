import { NextRequest, NextResponse } from 'next/server'
import {
  recomputePerrenqueMatches,
  type RecomputePerrenqueResult,
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
        'POST este path (o cron de Vercel) ejecuta el recomputo. `groqApiKeyConfigured` solo indica que la variable existe; el último intento Groq exitoso sale en `groqPartitionOk` tras POST.',
    })
  }
  const result = await recomputePerrenqueMatches()
  return json(result, result.ok ? 200 : 500)
}

export async function POST(req: NextRequest) {
  const auth = authorize(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.body }, { status: auth.status })
  }
  const result = await recomputePerrenqueMatches()
  return json(result, result.ok ? 200 : 500)
}
