import { CONVOCATORIAS, type Convocatoria } from '@/lib/radar-convocatorias-data'

export type RadarSource = {
  slug: string
  portal: string
  url: string
  extraUrls?: string[]
}

/** Solo listados públicos oficiales. Sin login ni captcha. */
export const RADAR_SOURCES: RadarSource[] = [
  {
    slug: 'sena-fondo-emprender',
    portal: 'SENA Fondo Emprender',
    url: 'https://www.sena.edu.co/es-co/trabajo/Paginas/fondo-emprender.aspx',
    extraUrls: ['https://www.fondoemprender.com/'],
  },
  {
    slug: 'innpulsa-acelera',
    portal: 'iNNpulsa Colombia',
    url: 'https://www.innpulsa.gov.co/',
  },
  {
    slug: 'ruta-n-angeles',
    portal: 'Ruta N',
    url: 'https://www.rutanmedellin.org/',
  },
  {
    slug: 'minciencias-cofinancia',
    portal: 'MinCiencias',
    url: 'https://minciencias.gov.co/convocatorias',
  },
  {
    slug: 'appsco-mintic',
    portal: 'Apps.co / MinTIC',
    url: 'https://www.apps.co/',
  },
  {
    slug: 'fondo-mujer',
    portal: 'Fondo Mujer',
    url: 'https://www.fondomujer.gov.co/',
  },
  {
    slug: 'bancoldex',
    portal: 'Bancóldex',
    url: 'https://www.bancoldex.com/',
    extraUrls: ['https://www.bancoldex.com/es'],
  },
  {
    slug: 'finagro',
    portal: 'Finagro',
    url: 'https://www.finagro.com.co/',
  },
  {
    slug: 'colombia-productiva',
    portal: 'Colombia Productiva',
    url: 'https://www.colombiaproductiva.com/',
  },
  {
    slug: 'mincit',
    portal: 'MinCIT',
    url: 'https://www.mincit.gov.co/',
    extraUrls: ['https://www.mincit.gov.co/convocatorias'],
  },
  {
    slug: 'procolombia',
    portal: 'ProColombia',
    url: 'https://procolombia.co/',
  },
  {
    slug: 'confecamaras',
    portal: 'Confecámaras',
    url: 'https://www.confecamaras.org.co/',
  },
]

const KEYWORDS =
  /convocatoria|fondo emprender|semilla|aceler|emprend|innpulsa|minciencias|apps\.co|mujer emprende|capital|cofinanci|bancoldex|finagro|procolombia|confecamaras|mincit|productiva/i

export function looksLikeConvocatoria(text: string) {
  return KEYWORDS.test(text)
}

export function seedBySlug(): Record<string, Convocatoria> {
  return Object.fromEntries(CONVOCATORIAS.map((item) => [item.id, item]))
}
