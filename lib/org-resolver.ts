/**
 * Resolución de organización actual para multi-tenant.
 * Resuelve por host (app.acme.snrg.lat → acme) o usa slug por defecto.
 */

import { headers } from 'next/headers'
import { createServerClient } from '@/utils/supabase/server'

const DEFAULT_ORG_SLUG = 'snrg'

/** Extrae el slug de org desde el header Host (para multi-tenant) */
export function getOrgSlugFromHost(host: string): string {
  const bare = host.replace(/:.*/, '')
  const parts = bare.split('.')
  if (parts.includes('localhost')) return DEFAULT_ORG_SLUG
  // app.acme.snrg.lat → acme | app.snrg.lat → snrg
  if (parts[0] === 'app' && parts.length >= 2) return parts[1]
  // inscripcion.acme.snrg.lat → acme | inscripcion.snrg.lat → snrg
  if (parts[0] === 'inscripcion' && parts.length >= 2) return parts[1]
  // snrg.lat → snrg
  return parts[0] ?? DEFAULT_ORG_SLUG
}

/** Obtiene el slug de la org actual desde la request (header x-org-slug o Host) */
export async function getOrgSlugFromRequest(): Promise<string> {
  try {
    const h = await headers()
    const fromHeader = h.get('x-org-slug')
    if (fromHeader) return fromHeader
    const host = h.get('host') ?? h.get('x-forwarded-host') ?? ''
    return host ? getOrgSlugFromHost(host) : DEFAULT_ORG_SLUG
  } catch {
    return DEFAULT_ORG_SLUG
  }
}

/** Obtiene el ID de la organización actual (server-side, según dominio o default) */
export async function getDefaultOrgId(): Promise<string | null> {
  const slug = await getOrgSlugFromRequest()
  return getOrgIdBySlug(slug)
}

/** Obtiene el ID de una organización por slug */
export async function getOrgIdBySlug(slug: string): Promise<string | null> {
  const supabase = await createServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('organizaciones')
    .select('id')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return data.id
}
