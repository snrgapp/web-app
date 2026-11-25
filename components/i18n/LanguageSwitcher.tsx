'use client'

import type { ComponentType } from 'react'
import { cn } from '@/lib/utils'
import { LOCALES, type Locale } from '@/lib/i18n/types'
import { useI18n } from './LanguageProvider'

function FlagEs({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden>
      <rect width="20" height="14" rx="2" fill="#AA151B" />
      <rect y="3.5" width="20" height="7" fill="#F1BF00" />
    </svg>
  )
}

function FlagEn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden>
      <rect width="20" height="14" rx="2" fill="#012169" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="3" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.4" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="4.2" />
      <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2.2" />
    </svg>
  )
}

function FlagPt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden>
      <rect width="20" height="14" rx="2" fill="#009C3B" />
      <polygon points="10,2 18,7 10,12 2,7" fill="#FFDF00" />
      <circle cx="10" cy="7" r="2.4" fill="#002776" />
    </svg>
  )
}

const FLAGS: Record<Locale, ComponentType<{ className?: string }>> = {
  es: FlagEs,
  en: FlagEn,
  pt: FlagPt,
}

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className={cn('flex items-center gap-1', className)}
    >
      {LOCALES.map((code) => {
        const Flag = FLAGS[code]
        const selected = locale === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-label={t.languages[code]}
            aria-pressed={selected}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              selected ? 'bg-black/10 ring-1 ring-[#1a1a1a]/40' : 'hover:bg-black/5'
            )}
          >
            <Flag className="h-[14px] w-5 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]" />
          </button>
        )
      })}
    </div>
  )
}
