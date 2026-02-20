import { NextRequest } from 'next/server'
import { destroyMemberSession } from '@/lib/members/session'

export async function POST(request: NextRequest) {
  try {
    await destroyMemberSession()
    const url = new URL(request.url)
    const base = `${url.protocol}//${url.host}`
    return Response.json({ ok: true, redirect: `${base}/miembros/login` })
  } catch {
    return Response.json({ ok: true, redirect: '/miembros/login' })
  }
}
