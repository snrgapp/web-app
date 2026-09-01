import { NextRequest, NextResponse } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { memberAnalytics } from '@/lib/cms/queries'

export async function GET(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const result = await memberAnalytics(member.id)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ pairings: 0, events: 0, coffees: 0 })
  }
}
