/**
 * Contrato tipado para `organizaciones.settings` (JSONB).
 * Valida con Zod y preserva claves desconocidas con .passthrough().
 */

import { z } from 'zod'

const hexColor = z
  .string()
  .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, 'Color hex inválido')

export const themeTokensSchema = z.object({
  primary: hexColor.optional(),
  primaryForeground: hexColor.optional(),
  accent: hexColor.optional(),
  accentForeground: hexColor.optional(),
  background: hexColor.optional(),
  foreground: hexColor.optional(),
  muted: hexColor.optional(),
  cardRadius: z.string().optional(),
  fontSans: z.string().optional(),
  logoUrl: z.union([z.string().url(), z.literal('')]).nullable().optional(),
  logoMarkUrl: z.union([z.string().url(), z.literal('')]).nullable().optional(),
})

export type ThemeTokens = z.infer<typeof themeTokensSchema>

export const experiencePointerSchema = z.object({
  activeTenantExperienceId: z.string().uuid().nullable().optional(),
})

export const orgSettingsSchema = z
  .object({
    theme: themeTokensSchema.optional(),
    experience: experiencePointerSchema.optional(),
  })
  .passthrough()

export type OrgSettings = z.infer<typeof orgSettingsSchema>

export const DEFAULT_THEME: ThemeTokens = {
  primary: '#FFE100',
  primaryForeground: '#000000',
  accent: '#000000',
  accentForeground: '#FFE100',
  background: '#ffffff',
  foreground: '#000000',
  muted: '#737373',
  cardRadius: '30px',
  fontSans: 'ui-sans-serif, system-ui, sans-serif',
  logoUrl: null,
  logoMarkUrl: null,
}

export function parseOrgSettings(raw: unknown): OrgSettings {
  const base = typeof raw === 'object' && raw !== null && !Array.isArray(raw) ? raw : {}
  const parsed = orgSettingsSchema.safeParse(base)
  if (parsed.success) return parsed.data
  return base as OrgSettings
}

export function mergeTheme(current: ThemeTokens | undefined, patch: Partial<ThemeTokens>): ThemeTokens {
  const merged = { ...DEFAULT_THEME, ...current, ...patch }
  const r = themeTokensSchema.safeParse(merged)
  if (r.success) return r.data
  return { ...DEFAULT_THEME }
}
