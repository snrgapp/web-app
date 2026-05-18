/**
 * Resolución de experiencias PaaS publicadas por `public_slug` (rutas /exp/...).
 */

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'

export type PublishedTenantExperience = {
  id: string
  organizacion_id: string
  template_id: string
  experience_form_id: string | null
  public_slug: string | null
  status: string
  config: Record<string, unknown>
}

export async function getPublishedTenantExperienceByPublicSlug(
  publicSlug: string
): Promise<PublishedTenantExperience | null> {
  const supabase = await createServerClient()
  if (!supabase) return null
  const orgId = await getDefaultOrgId()
  if (!orgId) return null

  const { data, error } = await supabase
    .from('tenant_experiences')
    .select('id, organizacion_id, template_id, experience_form_id, public_slug, status, config')
    .eq('organizacion_id', orgId)
    .eq('public_slug', publicSlug)
    .eq('status', 'published')
    .maybeSingle()

  if (error || !data) return null
  return {
    ...data,
    config: (data.config && typeof data.config === 'object' ? data.config : {}) as Record<string, unknown>,
  }
}
