'use client'

import Image from 'next/image'
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'
import {
  experiencesPortfolio,
  type ExperiencePortfolioItem,
} from '@/lib/experiences-portfolio-data'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-experiences-manrope',
})

const statusStyles: Record<string, string> = {
  ACTIVO: 'border-emerald-600/40 bg-emerald-600/12 text-emerald-800',
  PRÓXIMO: 'border-[#c9a010]/50 bg-[#E5B318]/12 text-[#6b5608]',
  COMPLETADO: 'border-neutral-200 bg-neutral-100/80 text-neutral-500',
}

function cardByStatus(status: ExperiencePortfolioItem['status']): string[] {
  switch (status) {
    case 'ACTIVO':
      return [
        'border-emerald-600/25 bg-gradient-to-br from-emerald-50/95 via-white/90 to-emerald-50/50',
        'shadow-[0_2px_20px_rgba(5,150,105,0.08),inset_0_1px_0_0_rgba(255,255,255,0.9)]',
        'hover:border-emerald-600/40 hover:shadow-[0_8px_28px_rgba(5,150,105,0.14)]',
      ]
    case 'PRÓXIMO':
      return [
        'border-[#E5B318]/35 bg-gradient-to-br from-amber-50/95 via-white/90 to-[#fff8e8]/80',
        'shadow-[0_2px_20px_rgba(229,179,24,0.12),inset_0_1px_0_0_rgba(255,255,255,0.95)]',
        'hover:border-[#E5B318]/55 hover:shadow-[0_8px_28px_rgba(229,179,24,0.2)]',
      ]
    default:
      return [
        'border-[#1a1a1a]/10 bg-white/85',
        'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]',
        'hover:border-[#1a1a1a]/18 hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)]',
      ]
  }
}

export default function ExperiencesPortfolioSection() {
  return (
    <section
      className={cn('w-full pt-10 pb-24 lg:pt-12 lg:pb-36', manrope.variable)}
      aria-labelledby="experiences-portfolio-heading"
    >
      <div className="mx-auto max-w-5xl px-6 text-center sm:px-8">
        <div
          className={cn(
            'mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/12',
            'bg-white/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/80',
            'shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-sm',
            manrope.className
          )}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E5B318]" aria-hidden />
          experiencias
        </div>
        <h2
          id="experiences-portfolio-heading"
          className={cn(
            'mb-3 text-2xl font-bold lowercase leading-[1.15] tracking-tight text-[#1a1a1a] sm:text-3xl lg:text-[2.35rem]',
            manrope.className
          )}
        >
          <span className="block">nuestro portafolio de </span>
          <span className="mt-1.5 block font-[family-name:var(--font-playfair-display)] italic text-[#E5B318]">
            experiencias
          </span>
        </h2>
        <p className="mx-auto max-w-lg text-[15px] lowercase leading-relaxed text-neutral-600 sm:text-base">
          distintos formatos para distintos momentos de tu camino como founder.
        </p>
      </div>

      <div className="mx-auto mt-11 grid max-w-5xl grid-cols-1 gap-6 px-6 sm:px-8 md:grid-cols-3 md:gap-5 lg:mt-12">
        {experiencesPortfolio.map((xp) => (
          <article
            key={xp.name}
            className={cn(
              'flex flex-col gap-4 rounded-2xl border p-6 backdrop-blur-sm',
              'transition-[box-shadow,transform,border-color] duration-300 ease-out',
              'hover:-translate-y-1',
              ...cardByStatus(xp.status)
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-[#1a1a1a] p-1">
                <Image
                  src={xp.logo}
                  alt=""
                  width={88}
                  height={88}
                  sizes="44px"
                  className="h-full w-full object-contain object-center"
                />
              </div>
              <div className="min-w-0 text-left">
                <h3
                  className={cn(
                    'truncate text-[15px] font-semibold leading-tight text-[#1a1a1a]',
                    manrope.className
                  )}
                >
                  {xp.name}
                </h3>
              </div>
            </div>

            <p className="flex-1 text-left text-[13px] leading-relaxed text-neutral-600">{xp.description}</p>

            <div
              className={cn(
                'flex flex-wrap items-center gap-2 text-[12px] text-neutral-500',
                manrope.className
              )}
            >
              <span
                className={cn(
                  'rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
                  statusStyles[xp.status] ?? statusStyles.COMPLETADO
                )}
              >
                {xp.status}
              </span>
              <span className="text-neutral-300" aria-hidden>
                ·
              </span>
              <span>{xp.frequency}</span>
              <span className="text-neutral-300" aria-hidden>
                ·
              </span>
              <span>{xp.attendees} founders</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
