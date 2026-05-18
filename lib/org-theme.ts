/**
 * Convierte tokens de tema en variables CSS para el shell de networking.
 */

import type { ThemeTokens } from '@/lib/org-settings-schema'
import { DEFAULT_THEME, mergeTheme } from '@/lib/org-settings-schema'

export function themeToCssVars(theme: ThemeTokens | undefined): Record<string, string> {
  const t = mergeTheme(theme, {})
  return {
    '--net-primary': t.primary ?? DEFAULT_THEME.primary!,
    '--net-primary-fg': t.primaryForeground ?? DEFAULT_THEME.primaryForeground!,
    '--net-accent': t.accent ?? DEFAULT_THEME.accent!,
    '--net-accent-fg': t.accentForeground ?? DEFAULT_THEME.accentForeground!,
    '--net-bg': t.background ?? DEFAULT_THEME.background!,
    '--net-fg': t.foreground ?? DEFAULT_THEME.foreground!,
    '--net-muted': t.muted ?? DEFAULT_THEME.muted!,
    '--net-radius': t.cardRadius ?? DEFAULT_THEME.cardRadius!,
    '--net-font-sans': t.fontSans ?? DEFAULT_THEME.fontSans!,
  }
}

export function themeLogoUrls(theme: ThemeTokens | undefined): { logoUrl: string | null; logoMarkUrl: string | null } {
  const t = mergeTheme(theme, {})
  const logo = t.logoUrl?.trim() || null
  const mark = t.logoMarkUrl?.trim() || null
  return {
    logoUrl: logo,
    logoMarkUrl: mark,
  }
}
