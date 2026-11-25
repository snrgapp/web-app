export const LOCALES = ['es', 'en', 'pt'] as const
export type Locale = (typeof LOCALES)[number]

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'es' || value === 'en' || value === 'pt'
}
