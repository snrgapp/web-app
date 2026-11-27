export const LOCALES = ['es', 'en', 'pt', 'ar', 'no'] as const
export type Locale = (typeof LOCALES)[number]

export const RTL_LOCALES: readonly Locale[] = ['ar']

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

export function isRtlLocale(locale: Locale) {
  return RTL_LOCALES.includes(locale)
}
