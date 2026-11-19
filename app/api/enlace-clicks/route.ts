import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { ENLACE_DESTINOS, filaClick } from '@/lib/enlace-clicks'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const TIPOS = new Set(['visita', 'preview', 'bot'])

function texto(v: unknown, max = 500) {
  const s = String(v ?? '').trim()
  return s ? s.slice(0, max) : null
}

async function guardar(fila: Record<string, string | null>) {
  const db = createAdminClient()
  if (!db) return false
  const { error } = await db.from('enlace_clicks').insert(fila)
  if (error) {
    console.error('enlace_clicks', error.message)
    return false
  }
  return true
}

/** El middleware reescribe /reunion aquí: anota el clic y luego redirige. */
export async function GET(req: NextRequest) {
  const slug = texto(req.nextUrl.searchParams.get('slug'), 80) || ''
  const destino = ENLACE_DESTINOS[slug]
  if (!destino) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const fila = filaClick(req, slug, destino)
  if (fila.host && !fila.host.includes('localhost')) {
    await guardar(fila)
  }

  return NextResponse.redirect(destino, 307)
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
  const slug = texto(body.slug, 80) || ''
  if (!ENLACE_DESTINOS[slug]) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const tipo = TIPOS.has(String(body.tipo)) ? String(body.tipo) : 'visita'
  const ok = await guardar({
    slug,
    host: texto(body.host, 120),
    destino: texto(body.destino, 500) || ENLACE_DESTINOS[slug],
    referrer: texto(body.referrer, 500),
    user_agent: texto(body.user_agent, 500),
    pais: texto(body.pais, 8),
    tipo,
  })

  if (!ok) return NextResponse.json({ ok: false }, { status: 500 })
  return NextResponse.json({ ok: true })
}
