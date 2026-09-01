import { NextRequest, NextResponse } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { listHomeCards } from '@/lib/cms/queries'

export async function GET(request: NextRequest) {
  try {
    await requireMember(request)
    const result = await listHomeCards(true)
    return NextResponse.json({ cards: result.data })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ cards: [] })
  }
}
