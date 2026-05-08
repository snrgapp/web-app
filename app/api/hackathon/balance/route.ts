import { NextRequest, NextResponse } from 'next/server'
import { authorizeHackathonCron } from '@/app/api/hackathon/_authorize'
import { getInalambriaBalance } from '@/lib/inalambria'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const auth = authorizeHackathonCron(req)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.body }, { status: auth.status })
  }
  const r = await getInalambriaBalance()
  return NextResponse.json(r, { status: r.ok ? 200 : 502 })
}
