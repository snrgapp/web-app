import { createClient } from '@supabase/supabase-js'
import { CONVOCATORIAS, type Convocatoria } from '@/lib/radar-convocatorias-data'
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
  if (!supabase) return { items: CONVOCATORIAS, refreshedAt: null }

  const { data, error } = await supabase
    .from('radar_convocatorias')
    .select('slug, card, scraped_at')
    .order('scraped_at', { ascending: false })

  if (error || !data?.length) {
    return { items: CONVOCATORIAS, refreshedAt: null }
  }

  const byId = new Map(CONVOCATORIAS.map((item) => [item.id, item]))
  for (const row of data) {
    const card = row.card as Convocatoria
    if (card?.id && card.title) byId.set(card.id, card)
  }

  const items = [...byId.values()]
  if (!items.length) return { items: CONVOCATORIAS, refreshedAt: null }

  return {
    items,
    refreshedAt: data[0]?.scraped_at ?? null,
  }
}
