import { NextResponse } from 'next/server'
import { createServerClient } from '@/utils/supabase/server'

export async function POST() {
  const supabase = await createServerClient()
  if (supabase) await supabase.auth.signOut()
  return NextResponse.json({ ok: true })
}
