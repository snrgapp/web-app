import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/utils/supabase/server'

export async function isMembersAdmin(): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') return true
  const supabase = await createServerClient()
  if (!supabase) return false
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return Boolean(user)
}

export async function requireMembersAdmin(request?: NextRequest) {
  if (process.env.NODE_ENV === 'development') return { id: 'dev-admin' }
  const supabase = await createServerClient()
  if (!supabase) {
    throw NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    if (request) {
      throw NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    throw NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return user
}

export function adminUnauthorized(error: unknown) {
  if (error instanceof NextResponse) return error
  return NextResponse.json({ error: 'Error interno' }, { status: 500 })
}
