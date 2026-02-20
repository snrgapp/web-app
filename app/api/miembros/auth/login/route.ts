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
        return Response.json({ error: 'Error al crear miembro' }, { status: 500 })
      }
      memberId = created.id
    }

    const token = await setMemberSession(memberId, normalizedPhone)
    if (!token) {
      return Response.json(
        { error: 'MEMBER_SESSION_SECRET no configurado' },
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
