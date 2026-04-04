/**
 * URL pública del sitio (snrg.lat). Usada en SEO, sitemap, Open Graph y llms.txt.
 */
export function getSiteBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() || 'https://snrg.lat'
  return raw.replace(/\/+$/, '')
}

export function absoluteUrl(path: string): string {
  const base = getSiteBaseUrl()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * URLs de perfiles oficiales (JSON-LD sameAs). Variable de entorno separada por comas.
 * Ej.: NEXT_PUBLIC_ORG_SAME_AS=https://linkedin.com/company/...,https://instagram.com/...
 */
export function getOrganizationSameAs(): string[] {
  const raw = process.env.NEXT_PUBLIC_ORG_SAME_AS?.trim()
  if (!raw) return []
  return raw.split(',').map((s) => s.trim()).filter(Boolean)
}
