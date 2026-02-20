import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/** Cliente Supabase para Client Components. Usa cookies automáticamente. */
export function createClient(): SupabaseClient<Database> | null {
  if (!supabaseUrl || !supabaseAnonKey) return null
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Compatibilidad: muchos componentes usan `supabase` como singleton
export const supabase = createClient()
