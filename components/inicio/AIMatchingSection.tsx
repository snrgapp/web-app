'use client'

import Image from 'next/image'
import { Manrope } from 'next/font/google'
import { IdCard, MessageCircle, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/components/i18n/LanguageProvider'

const manrope = Manrope({ subsets: ['latin'] })

const cardChrome = [
  {
    n: '01',
    Icon: IdCard,
    card: 'bg-[#FFF4C8] text-[#1a1a1a] shadow-[0_18px_40px_rgba(229,179,24,0.18)]',
    bodyColor: 'text-[#1a1a1a]/70',
    logo: '/images/matching/isotipo-negro.png',
    tilt: 'lg:-rotate-[3deg]',
  },
  {
    n: '02',
    Icon: Users,
    card: 'bg-[#E5B318] text-[#1a1a1a] shadow-[0_22px_48px_rgba(229,179,24,0.35)]',
    bodyColor: 'text-[#1a1a1a]/75',
    logo: '/images/matching/isotipo-negro.png',
    tilt: 'lg:z-10 lg:-translate-y-6 lg:scale-[1.04]',
  },
  {
    n: '03',
    Icon: MessageCircle,
    card: 'bg-[#1a1a1a] text-white shadow-[0_18px_40px_rgba(26,26,26,0.28)]',
    bodyColor: 'text-white/70',
    logo: '/images/matching/isotipo-blanco.png',
    tilt: 'lg:rotate-[3deg]',
  },
] as const

export default function AIMatchingSection() {
  const { t } = useI18n()
  const cards = cardChrome.map((chrome, i) => ({
    ...chrome,
    title: t.matching.cards[i].title,
    body: t.matching.cards[i].body,
  }))

  return (
    <section className="w-full pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-24 lg:pt-14" aria-labelledby="aim-matching-heading">
      <div className="mx-auto mb-10 max-w-2xl px-4 text-center sm:mb-14 sm:px-6">
        <h2
          id="aim-matching-heading"
          className="mb-3.5 scroll-mt-24 text-2xl font-bold lowercase leading-tight tracking-tight text-[#1a1a1a] sm:text-3xl lg:text-4xl"
        >
          <span className="block">{t.matching.heading[0]}</span>
          <span className="mt-1 block text-[#E5B318]">{t.matching.heading[1]}</span>
        </h2>
        <p className="mx-auto max-w-md text-base leading-relaxed text-neutral-600">
          {t.matching.intro}
        </p>
      </div>

      <div className="px-4 sm:px-6">
        <div
          className={cn(
            'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6',
            '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'lg:mx-auto lg:max-w-[1080px] lg:items-end lg:justify-center lg:gap-5 lg:overflow-visible lg:pb-10'
          )}
        >
          {cards.map((card) => (
            <article
              key={card.n}
              className={cn(
                'flex h-[460px] w-[min(280px,82vw)] shrink-0 snap-center flex-col rounded-[2rem] p-5 sm:h-[500px] sm:p-6',
                'lg:h-[520px] lg:w-[300px] lg:transition-transform',
                card.card,
                card.tilt
              )}
            >
              <div className="flex items-center justify-between">
                <Image
                  src={card.logo}
                  alt="Synergy"
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                />
                <span
                  className={cn(
                    'text-[11px] font-semibold tracking-wide opacity-60',
                    manrope.className
                  )}
                >
                  {card.n}
                </span>
              </div>

              <div className="mx-auto my-6 flex h-[120px] w-[120px] items-center justify-center sm:h-[132px] sm:w-[132px]">
                <card.Icon
                  className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </div>

              <h3 className="mb-2 text-[1.65rem] font-bold leading-[1.12] tracking-tight">
                {card.title}
              </h3>
              <p className={cn('text-[14px] leading-relaxed', card.bodyColor)}>{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
