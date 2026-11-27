'use client'

import { ArrowRight } from 'lucide-react'
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'
import { useI18n } from '@/components/i18n/LanguageProvider'

const manrope = Manrope({ subsets: ['latin'] })

export default function WhyAttendSection() {
  const { t } = useI18n()
  const copy = t.whyAttend

  return (
    <section
      className="w-full py-12 sm:py-16 lg:py-24"
      aria-labelledby="why-attend-heading"
    >
      <div className="mx-auto grid max-w-[1200px] items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <h2
            id="why-attend-heading"
            className="mb-5 scroll-mt-24 text-[1.75rem] font-bold lowercase leading-[1.12] tracking-tight text-[#1a1a1a] sm:text-3xl lg:text-4xl"
          >
            <span className="block">{copy.heading[0]}</span>
            <span className="mt-1 block text-[#E5B318]">{copy.heading[1]}</span>
          </h2>

          <div className={cn('max-w-md space-y-4 text-[15px] leading-[1.35] text-neutral-600', manrope.className)}>
            {copy.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <a
            href="https://www.snrg.lat/reunion"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'mt-8 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-7 py-3.5',
              'text-sm font-semibold text-white transition-colors hover:bg-[#2d2d2d] sm:w-auto',
              manrope.className
            )}
          >
            {copy.cta}
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
          </a>

          <div className="mt-10 grid grid-cols-3 gap-3 border-t border-black/10 pt-8 sm:gap-6">
            {copy.stats.map(({ num, label, showStar }) => (
              <div key={label} className="min-w-0">
                <p className="text-2xl font-bold leading-none tracking-tight text-[#1a1a1a] sm:text-[1.75rem]">
                  {num}
                  {showStar ? <span className="text-lg text-[#E5B318]">★</span> : null}
                </p>
                <p className={cn('mt-1.5 text-[11px] lowercase leading-snug text-neutral-500 sm:text-xs', manrope.className)}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ol className="divide-y divide-black/10 border-y border-black/10">
          {copy.reasons.map((reason) => (
            <li key={reason.n} className="flex gap-4 py-6 sm:gap-6 sm:py-7">
              <span className="w-10 shrink-0 text-xl font-bold tabular-nums leading-none tracking-tight text-[#E5B318] sm:w-12 sm:text-2xl">
                {reason.n}
              </span>
              <div className="min-w-0 pt-0.5">
                <h3 className="mb-1.5 text-lg font-extrabold lowercase leading-[1.15] tracking-tight text-[#1a1a1a] sm:text-xl">
                  {reason.title}
                </h3>
                <p className={cn('text-[14px] leading-[1.3] text-neutral-600 sm:text-[15px]', manrope.className)}>
                  {reason.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
