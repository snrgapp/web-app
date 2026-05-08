import { NextRequest, NextResponse } from 'next/server'
import { authorizeHackathonCron } from '@/app/api/hackathon/_authorize'
import { runHackathonTeamFormation } from '@/services/hackathon-team-formation'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(req: NextRequest) {
  const auth = authorizeHackathonCron(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.body }, { status: auth.status })
  }
  let skipSms = false
  let skipBalanceCheck = false
  try {
    const body = (await req.json()) as { skipSms?: boolean; skipBalanceCheck?: boolean }
    skipSms = Boolean(body?.skipSms)
    skipBalanceCheck = Boolean(body?.skipBalanceCheck)
  } catch {
    /* vacío */
  }
  const result = await runHackathonTeamFormation({ skipSms, skipBalanceCheck })
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
