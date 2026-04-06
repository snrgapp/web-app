'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'
import { faqs } from '@/lib/faq-data'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-faq-manrope',
})

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      aria-hidden
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}

function FaqAccordionItem({
  id,
  q,
  a,
  isOpen,
  onToggle,
}: {
  id: string
  q: string
  a: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-t border-[#1a1a1a]/10 last:border-b last:border-[#1a1a1a]/10">
      <button
        type="button"
        id={`${id}-trigger`}
        aria-expanded={isOpen}
        aria-controls={`${id}-panel`}
        onClick={onToggle}
        className={cn(
          'group flex w-full items-center justify-between gap-4 py-[18px] text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B318]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2f2f2]',
          manrope.className
        )}
      >
        <span
          className={cn(
            'text-[14px] font-semibold leading-snug transition-colors duration-200',
            isOpen ? 'text-[#1a1a1a]' : 'text-neutral-600 group-hover:text-[#1a1a1a]'
          )}
        >
          {q}
        </span>
        <ChevronIcon
          className={cn(
            'shrink-0 transition-all duration-300',
            isOpen ? 'rotate-180 text-[#E5B318]' : 'rotate-0 text-neutral-300 group-hover:text-neutral-400'
          )}
        />
      </button>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className="overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
        style={{ maxHeight: isOpen ? '520px' : '0px' }}
      >
        <p
          className={cn(
            'pb-5 pr-2 text-[13px] font-normal leading-[1.75] text-neutral-600 sm:pr-8',
            manrope.className
          )}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section
      className={cn(
        'w-full border-t border-[#1a1a1a]/10 px-6 pt-16 pb-24 sm:px-8 lg:pt-24 lg:pb-40',
        manrope.variable
      )}
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 md:flex-row md:gap-16 lg:gap-20">
          <div className="shrink-0 md:sticky md:top-28 md:w-64 md:self-start">
            <h2
              id="faq-heading"
              className={cn(
                'mb-3 text-2xl font-bold lowercase leading-tight tracking-tight text-[#1a1a1a] sm:text-[28px]',
                manrope.className
              )}
            >
              <span className="block">todo lo que </span>
              <span className="mt-1 block font-[family-name:var(--font-playfair-display)] italic text-[#E5B318]">
                quieres saber.
              </span>
            </h2>
            <p
              className={cn(
                'mb-6 text-[13px] leading-relaxed text-neutral-600',
                manrope.className
              )}
            >
              Si no encuentras tu respuesta aquí, escríbenos directamente.
            </p>
            <Link
              href="/contacto"
              className={cn(
                'inline-flex items-center gap-1 border-b border-[#E5B318]/40 pb-0.5 text-[12px] font-semibold text-[#1a1a1a]/80',
                'transition-colors duration-200 hover:border-[#E5B318] hover:text-[#E5B318]',
                manrope.className
              )}
            >
              contáctanos
              <span aria-hidden className="text-[#E5B318]">
                →
              </span>
            </Link>
          </div>

          <div className="min-w-0 flex-1 rounded-2xl border border-[#1a1a1a]/10 bg-white/75 px-4 shadow-[0_2px_16px_rgba(26,26,26,0.04)] backdrop-blur-sm sm:px-6">
            {faqs.map((faq, i) => (
              <FaqAccordionItem
                key={i}
                id={`faq-${i}`}
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
