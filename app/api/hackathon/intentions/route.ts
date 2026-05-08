import { NextRequest, NextResponse } from 'next/server'
import { upsertHackathonIntention } from '@/services/hackathon-intentions'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      telefono?: string
      from_submission_id?: string
      to_submission_id?: string
      type?: 'interested' | 'pass'
    }
    const tel = typeof body.telefono === 'string' ? body.telefono : ''
    const fromId = typeof body.from_submission_id === 'string' ? body.from_submission_id : ''
    const toId = typeof body.to_submission_id === 'string' ? body.to_submission_id : ''
    const type = body.type === 'pass' ? 'pass' : body.type === 'interested' ? 'interested' : null
    if (!tel || !fromId || !toId || !type) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }
    const res = await upsertHackathonIntention({
      telefonoDigits: tel,
      fromSubmissionId: fromId,
      toSubmissionId: toId,
      type,
    })
    if (!res.ok) {
      return NextResponse.json({ error: res.error }, { status: 403 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }
}
