'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { messages, type Messages } from '@/lib/i18n/messages'
import { isLocale, isRtlLocale, type Locale } from '@/lib/i18n/types'

const STORAGE_KEY = 'snrg-locale'

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Messages
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'es'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isLocale(stored)) return stored
  const nav = window.navigator.language.toLowerCase()
  if (nav.startsWith('nb') || nav.startsWith('nn') || nav.startsWith('no')) return 'no'
  const short = nav.slice(0, 2)
  if (isLocale(short)) return short
  return 'es'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  useEffect(() => {
    setLocaleState(detectLocale())
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = isRtlLocale(locale) ? 'rtl' : 'ltr'
    root.classList.toggle('font-ar', locale === 'ar')
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
  }, [])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: messages[locale],
    }),
    [locale, setLocale]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useI18n must be used within LanguageProvider')
  }
  return ctx
}
