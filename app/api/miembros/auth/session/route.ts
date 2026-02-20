import { NextRequest } from 'next/server'
import { getMemberFromRequest } from '@/lib/members/auth'

export async function GET(request: NextRequest) {
  const member = await getMemberFromRequest(request)
  if (!member) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }
  return Response.json(member)
}
