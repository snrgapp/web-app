import { NextRequest, NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'

export const dynamic = 'force-dynamic'

const BUCKET = 'comprobantes'
const TIPOS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'application/pdf': 'pdf',
}

async function contexto() {
  const supabase = await createServerClient()
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  if (!data.user) return null
  const orgId = await getDefaultOrgId()
  if (!orgId) return null
  return { db: supabase as unknown as SupabaseClient, orgId }
}

export async function POST(req: NextRequest) {
  const ctx = await contexto()
  if (!ctx) return NextResponse.json({ ok: false, error: 'Inicia sesión en el panel' }, { status: 401 })

  const form = await req.formData().catch(() => null)
  const archivo = form?.get('archivo')
  if (!(archivo instanceof File) || !archivo.size) {
    return NextResponse.json({ ok: false, error: 'Elige un archivo' }, { status: 400 })
  }
  const ext = TIPOS[archivo.type]
  if (!ext) return NextResponse.json({ ok: false, error: 'Sube una imagen (PNG, JPG, WEBP, HEIC) o un PDF' }, { status: 400 })
  if (archivo.size > 10 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: 'El archivo supera 10 MB' }, { status: 400 })
  }

  const ruta = `${ctx.orgId}/${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID()}.${ext}`
  const { error } = await ctx.db.storage.from(BUCKET).upload(ruta, archivo, { contentType: archivo.type })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, ruta: `${BUCKET}/${ruta}` })
}

export async function GET(req: NextRequest) {
  const ctx = await contexto()
  if (!ctx) return NextResponse.redirect(new URL('/login', req.url))

  const ruta = req.nextUrl.searchParams.get('ruta') ?? ''
  const interna = ruta.startsWith(`${BUCKET}/`) ? ruta.slice(BUCKET.length + 1) : ''
  if (!interna.startsWith(`${ctx.orgId}/`) || interna.includes('..')) {
    return NextResponse.json({ ok: false, error: 'Comprobante no encontrado' }, { status: 404 })
  }
  const { data, error } = await ctx.db.storage.from(BUCKET).createSignedUrl(interna, 300)
  if (error || !data) return NextResponse.json({ ok: false, error: 'Comprobante no encontrado' }, { status: 404 })
  return NextResponse.redirect(data.signedUrl)
}
