import { createClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/utils/supabase/admin'

export type RadarConfirmResult = 'ok' | 'already' | 'missing'

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  if (!url || !anon) return null
  return createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export async function confirmRadarAlerta(token: string): Promise<RadarConfirmResult> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
    return 'missing'
  }

  const client = createAdminClient() ?? publicClient()
  if (!client) return 'missing'

  const { data, error } = await client.rpc('confirm_radar_alerta', {
    p_token: token,
  })

  if (error) return 'missing'
  if (data === 'ok' || data === 'already' || data === 'missing') return data
  return 'missing'
}
