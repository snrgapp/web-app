import { NextResponse } from 'next/server'
import { adminUnauthorized, requireMembersAdmin } from '@/lib/admin-miembros/auth'
import { adminAnalytics } from '@/lib/cms/queries'

export async function GET() {
  try {
    await requireMembersAdmin()
    const result = await adminAnalytics()
    return NextResponse.json(result)
  } catch (error) {
    return adminUnauthorized(error)
  }
}
