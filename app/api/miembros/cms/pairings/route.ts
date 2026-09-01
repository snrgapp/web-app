import { NextRequest, NextResponse } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { PAIRING_LIMITS } from '@/lib/cms/types'
import { requestPairing } from '@/lib/cms/queries'
import { cmsDb } from '@/lib/cms/client'

export async function POST(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const { targetId } = await request.json()
    if (!targetId) return NextResponse.json({ error: 'Falta el founder' }, { status: 400 })
    const result = await requestPairing(member.id, targetId)
    if (result.error) return NextResponse.json(result, { status: 400 })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'No se pudo solicitar' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const db = cmsDb()
    const plan = 'free'
    if (!db) return NextResponse.json({ remaining: PAIRING_LIMITS.free, plan })
    const { data } = await db.from('members').select('plan').eq('id', member.id).maybeSingle()
    const resolved = data?.plan === 'pro' ? 'pro' : 'free'
    return NextResponse.json({ plan: resolved, limit: PAIRING_LIMITS[resolved] })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ plan: 'free', limit: PAIRING_LIMITS.free })
  }
}
