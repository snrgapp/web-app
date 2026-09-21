import { CONVOCATORIAS, type Convocatoria } from '@/lib/radar-convocatorias-data'

export type RadarSource = {
  slug: string
  portal: string
  url: string
  extraUrls?: string[]
}

/** Listados públicos oficiales. Cada slug coincide con el id de la ficha. */
export const RADAR_SOURCES: RadarSource[] = CONVOCATORIAS.map((item) => ({
  slug: item.id,
  portal: item.entity,
  url: item.basesUrl,
}))

const KEYWORDS =
  /convocatoria|fondo emprender|semilla|aceler|emprend|innpulsa|minciencias|apps\.co|mujer emprende|capital|cofinanci|bancoldex|finagro|procolombia|confecamaras|mincit|productiva/i

export function looksLikeConvocatoria(text: string) {
  return KEYWORDS.test(text)
}

export function seedBySlug(): Record<string, Convocatoria> {
  return Object.fromEntries(CONVOCATORIAS.map((item) => [item.id, item]))
}
