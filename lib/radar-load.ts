import { createClient } from '@supabase/supabase-js'
import { CONVOCATORIAS, RADAR_REVIEWED_AT, type Convocatoria } from '@/lib/radar-convocatorias-data'
import type { Database } from '@/types/database.types'

export type RadarPayload = {
  items: Convocatoria[]
  refreshedAt: string | null
}

function fromEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  if (!url || !key) return null
  return createClient<Database>(url, key)
}

export async function loadRadarConvocatorias(): Promise<RadarPayload> {
  const supabase = fromEnv()
  const reviewedAt = `${RADAR_REVIEWED_AT}T12:00:00-05:00`
  if (!supabase) return { items: CONVOCATORIAS, refreshedAt: reviewedAt }

  const { data, error } = await supabase
    .from('radar_convocatorias')
    .select('slug, card, scraped_at')
    .order('scraped_at', { ascending: false })

  if (error || !data?.length) {
    return { items: CONVOCATORIAS, refreshedAt: reviewedAt }
  }

  // El catálogo curado en código es la fuente de verdad: no reinyectar
  // fichas viejas de Supabase (homes, cerradas o de portales caídos).
  return {
    items: CONVOCATORIAS,
    refreshedAt: reviewedAt,
  }
}
