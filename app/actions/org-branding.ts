'use server'

import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import type { Json } from '@/types/database.types'
import {
  mergeTheme,
  parseOrgSettings,
  themeTokensSchema,
  type OrgSettings,
  type ThemeTokens,
} from '@/lib/org-settings-schema'

export async function getOrgSettingsForBranding(): Promise<
  { ok: true; settings: OrgSettings; orgId: string } | { ok: false; error: string }
> {
  const orgId = await getDefaultOrgId()
  if (!orgId) return { ok: false, error: 'No se pudo resolver la organización.' }
  const supabase = await createServerClient()
  if (!supabase) return { ok: false, error: 'Sin conexión a Supabase.' }

  const { data, error } = await supabase
    .from('organizaciones')
    .select('settings')
    .eq('id', orgId)
    .single()

  if (error || !data) return { ok: false, error: error?.message ?? 'No se encontró la organización.' }

  return { ok: true, settings: parseOrgSettings(data.settings), orgId }
}

export async function updateOrgTheme(
  patch: Partial<ThemeTokens>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = themeTokensSchema.partial().safeParse(patch)
  if (!parsed.success) {
    return { ok: false, error: 'Valores de tema inválidos.' }
  }

  const orgId = await getDefaultOrgId()
  if (!orgId) return { ok: false, error: 'No se pudo resolver la organización.' }

  const supabase = await createServerClient()
  if (!supabase) return { ok: false, error: 'Sin conexión a Supabase.' }

  const { data: row, error: readErr } = await supabase
    .from('organizaciones')
    .select('settings')
    .eq('id', orgId)
    .single()

  if (readErr || !row) return { ok: false, error: readErr?.message ?? 'No se pudo leer la organización.' }

  const current = parseOrgSettings(row.settings)
  const nextTheme = mergeTheme(current.theme, parsed.data)
  const nextSettings: OrgSettings = { ...current, theme: nextTheme }

  const { error: upErr } = await supabase
    .from('organizaciones')
    .update({
      settings: nextSettings as Json,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orgId)

  if (upErr) return { ok: false, error: upErr.message }

  revalidatePath('/panel/marca')
  revalidatePath('/networking', 'layout')
  return { ok: true }
}

export async function setActiveTenantExperienceId(
  tenantExperienceId: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const orgId = await getDefaultOrgId()
  if (!orgId) return { ok: false, error: 'No se pudo resolver la organización.' }

  const supabase = await createServerClient()
  if (!supabase) return { ok: false, error: 'Sin conexión a Supabase.' }

  const { data: row, error: readErr } = await supabase
    .from('organizaciones')
    .select('settings')
    .eq('id', orgId)
    .single()

  if (readErr || !row) return { ok: false, error: readErr?.message ?? 'No se pudo leer la organización.' }

  const current = parseOrgSettings(row.settings)
  const nextSettings: OrgSettings = {
    ...current,
    experience: {
      ...current.experience,
      activeTenantExperienceId: tenantExperienceId,
    },
  }

  const { error: upErr } = await supabase
    .from('organizaciones')
    .update({
      settings: nextSettings as Json,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orgId)

  if (upErr) return { ok: false, error: upErr.message }

  revalidatePath('/panel/plantillas')
  revalidatePath('/networking', 'layout')
  return { ok: true }
}
