/**
 * Resolución de organización actual para multi-tenant.
 * Por ahora usa la org por defecto (slug: snrg).
 * Futuro: resolver por subdominio (app.acme.snrg.lat → acme) o auth.
 */

import { createServerClient } from '@/utils/supabase/server'

const DEFAULT_ORG_SLUG = 'snrg'

/** Obtiene el ID de la organización por defecto (server-side) */
export async function getDefaultOrgId(): Promise<string | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('organizaciones')
    .select('id')
    .eq('slug', DEFAULT_ORG_SLUG)
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  return data.id
}

/** Obtiene el ID de una organización por slug */
export async function getOrgIdBySlug(slug: string): Promise<string | null> {
  const supabase = createServerClient()
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
