import type { MetadataRoute } from 'next'
import { getSiteBaseUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  const base = getSiteBaseUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/panel/', '/login', '/miembros/', '/_next/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
