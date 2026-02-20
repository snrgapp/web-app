import { NextRequest } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { setMemberSession } from '@/lib/members/session'
import { loginSchema } from '@/lib/members/schemas'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: 'Teléfono inválido' }, { status: 400 })
    }

    const { phone } = parsed.data
    const normalizedPhone = phone.replace(/\D/g, '').trim()
    if (normalizedPhone.length < 8) {
      return Response.json({ error: 'Teléfono inválido' }, { status: 400 })
    }

    const supabase = createAdminClient()
    if (!supabase) {
      const missing = []
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY')
      return Response.json(
        {
          error: 'Error de configuración',
          hint: missing.length
            ? `Faltan en .env.local: ${missing.join(', ')}`
            : 'Revisa NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local',
        },
        { status: 500 }
      )
    }

    let memberId: string
    const { data: existing } = await supabase
      .from('members')
      .select('id')
      .eq('phone', normalizedPhone)
      .maybeSingle()

    if (existing) {
      memberId = existing.id
    } else {
      const { data: created, error } = await supabase
        .from('members')
        .insert({ phone: normalizedPhone })
        .select('id')
        .single()
      if (error) {
        const isDev = process.env.NODE_ENV !== 'production'
        const hint = isDev
          ? `Supabase: ${error.message}${error.hint ? ` (${error.hint})` : ''}`
          : '¿Ejecutaste la migración 025_members_schema.sql en Supabase?'
        return Response.json(
          { error: 'Error al crear miembro', hint },
          { status: 500 }
        )
      }
      memberId = created.id
    }

    const token = await setMemberSession(memberId, normalizedPhone)
    if (!token) {
      const secret = process.env.MEMBER_SESSION_SECRET
      const hint = !secret
        ? 'Falta MEMBER_SESSION_SECRET en las variables de entorno'
        : secret.length < 32
          ? `MEMBER_SESSION_SECRET debe tener al menos 32 caracteres (tienes ${secret.length})`
          : 'Revisa MEMBER_SESSION_SECRET en Vercel/.env.local'
      return Response.json(
        { error: 'MEMBER_SESSION_SECRET no configurado', hint },
        { status: 500 }
      )
    }

    const url = new URL(request.url)
    const from = url.searchParams.get('from') || '/miembros'
    const base = `${url.protocol}//${url.host}`
    const redirectUrl = from.startsWith('/') ? `${base}${from}` : `${base}/miembros`

    return Response.json({ ok: true, redirect: redirectUrl })
  } catch (e) {
    console.error('Login error:', e)
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
