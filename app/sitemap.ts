import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/site'

/** Rutas del sitio público (snrg.lat) que deben indexarse. */
const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']; priority: number }[] = [
  { path: '/inicio', changeFrequency: 'weekly', priority: 1 },
  { path: '/eventos', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/contacto', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/postula-tu-ciudad', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/pitch', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/ia', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/terminos', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/politica-privacidad', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/politica-cookies', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/uso-datos', changeFrequency: 'yearly', priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }))
}
