import { NextRequest } from 'next/server'

export function authorizeHackathonCron(req: NextRequest): { ok: true } | { ok: false; status: number; body: string } {
  const secret = process.env.CRON_SECRET ?? process.env.HACKATHON_CRON_SECRET
  if (!secret) {
    if (process.env.NODE_ENV !== 'production') return { ok: true }
    return {
      ok: false,
      status: 503,
      body: 'Define CRON_SECRET o HACKATHON_CRON_SECRET.',
    }
  }
  const auth = req.headers.get('authorization')?.trim()
  if (auth !== `Bearer ${secret}`) {
    return { ok: false, status: 401, body: 'Unauthorized' }
  }
  return { ok: true }
}
