import { NextResponse } from 'next/server'
import { qrPng } from '@/lib/pase'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { token: string } }
) {
  const token = String(params.token || '').replace(/[^a-zA-Z0-9]/g, '')
  if (token.length < 8) return new NextResponse('Token inválido', { status: 400 })
  const png = await qrPng(token)
  return new NextResponse(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
