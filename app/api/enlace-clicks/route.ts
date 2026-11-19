import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const SLUGS = new Set(['reunion'])
const TIPOS = new Set(['visita', 'preview', 'bot'])

function texto(v: unknown, max = 500) {
  const s = String(v ?? '').trim()
  return s ? s.slice(0, max) : null
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const slug = texto(body.slug, 80) || ''
  if (!SLUGS.has(slug)) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const db = createAdminClient()
  if (!db) return NextResponse.json({ ok: false }, { status: 500 })

  const tipo = TIPOS.has(String(body.tipo)) ? String(body.tipo) : 'visita'
  const { error } = await db.from('enlace_clicks').insert({
    slug,
    host: texto(body.host, 120),
    destino: texto(body.destino, 500),
    referrer: texto(body.referrer, 500),
    user_agent: texto(body.user_agent, 500),
    pais: texto(body.pais, 8),
    tipo,
  })

  if (error) {
    console.error('enlace_clicks', error.message)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
