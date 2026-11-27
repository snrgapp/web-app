'use client'

import { useEffect, useId, useRef, useState, type ComponentType } from 'react'
import { ChevronDown } from 'lucide-react'
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

function FlagAr({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} aria-hidden>
      <rect width="20" height="14" rx="2" fill="#fff" />
      <rect width="20" height="4.67" fill="#00732F" />
      <rect y="9.33" width="20" height="4.67" fill="#000" />
      <rect width="5.2" height="14" fill="#FF0000" />
    </svg>
  )
}

function FlagNo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 22 16" className={className} aria-hidden>
      <rect width="22" height="16" rx="2" fill="#BA0C2F" />
      <rect x="6" width="4.2" height="16" fill="#fff" />
      <rect y="6" width="22" height="4.2" fill="#fff" />
      <rect x="7.1" width="2" height="16" fill="#00205B" />
      <rect y="7.1" width="22" height="2" fill="#00205B" />
    </svg>
  )
}

const FLAGS: Record<Locale, ComponentType<{ className?: string }>> = {
  es: FlagEs,
  en: FlagEn,
  pt: FlagPt,
  ar: FlagAr,
  no: FlagNo,
}

const flagClassName =
  'h-[14px] w-5 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]'

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const CurrentFlag = FLAGS[locale]

  useEffect(() => {
    if (!open) return

    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const choose = (code: Locale) => {
    setLocale(code)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-label={t.nav.language}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 items-center gap-1.5 rounded-full px-2 transition-colors hover:bg-black/5"
      >
        <CurrentFlag className={flagClassName} />
        <ChevronDown
          className={cn('h-3.5 w-3.5 text-[#1a1a1a]/70 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={t.nav.language}
          className="absolute end-0 top-[calc(100%+6px)] z-[60] min-w-[11.5rem] overflow-hidden rounded-xl border border-black/10 bg-[#f2f2f2] py-1 shadow-[0_16px_40px_rgba(26,26,26,0.16)]"
        >
          {LOCALES.map((code) => {
            const Flag = FLAGS[code]
            const selected = locale === code
            return (
              <li key={code} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => choose(code)}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2.5 text-start text-sm text-[#1a1a1a] transition-colors',
                    selected ? 'bg-black/10 font-semibold' : 'font-medium hover:bg-black/5'
                  )}
                >
                  <Flag className={flagClassName} />
                  <span>{t.languages[code]}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
