import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorized, requireMembersAdmin } from '@/lib/admin-miembros/auth'
import { confirmPairing, listPairingCards, listPairings } from '@/lib/cms/queries'

export async function GET() {
  try {
    await requireMembersAdmin()
    const [cards, pairings] = await Promise.all([listPairingCards(), listPairings()])
    return NextResponse.json({ cards: cards.data, pairings: pairings.data, error: cards.error || pairings.error })
  } catch (error) {
    return adminUnauthorized(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireMembersAdmin(request)
    const payload = await request.json()
    if (!payload.id) return NextResponse.json({ error: 'Falta el emparejamiento' }, { status: 400 })
    const result = await confirmPairing(payload.id, payload.meet_at)
    if (result.error) return NextResponse.json(result, { status: 400 })
    return NextResponse.json(result)
  } catch (error) {
    return adminUnauthorized(error)
  }
}
