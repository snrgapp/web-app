import { NextRequest, NextResponse } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { cmsDb } from '@/lib/cms/client'
import { listBenefits } from '@/lib/cms/queries'

export async function GET(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const result = await listBenefits(true)
    const db = cmsDb()
    let claimed: string[] = []
    if (db) {
      const { data } = await db
        .from('member_benefit_claims')
        .select('benefit_id')
        .eq('member_id', member.id)
      claimed = (data || []).map((row: { benefit_id: string }) => row.benefit_id)
    }
    return NextResponse.json({ benefits: result.data, claimed, source: result.data.length ? 'cms' : 'empty' })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ benefits: [], claimed: [] })
  }
}
