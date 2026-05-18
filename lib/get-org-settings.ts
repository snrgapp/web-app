/**
 * Lee `organizaciones.settings` para la org actual (host / resolver).
 * Dedup en un mismo request con `cache` de React.
 */

import { cache } from 'react'
import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { parseOrgSettings, type OrgSettings } from '@/lib/org-settings-schema'

export const getOrgSettingsResolved = cache(async (): Promise<{
  orgId: string
  settings: OrgSettings
} | null> => {
  const orgId = await getDefaultOrgId()
  if (!orgId) return null
  const supabase = await createServerClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('organizaciones')
    .select('settings')
    .eq('id', orgId)
    .single()
  if (error || !data) return null
  return { orgId, settings: parseOrgSettings(data.settings) }
})
