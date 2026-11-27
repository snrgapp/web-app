'use client'

import Image from 'next/image'
import { Manrope } from 'next/font/google'
import { MessageCircle, UserRound, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useI18n } from '@/components/i18n/LanguageProvider'

const manrope = Manrope({ subsets: ['latin'] })

const cardChrome = [
  {
    n: '01',
    Icon: UserRound,
    tilt: 'lg:-rotate-[3deg]',
  },
  {
    n: '02',
    Icon: Users,
    tilt: 'lg:z-10 lg:-translate-y-6 lg:scale-[1.04]',
  },
  {
    n: '03',
    Icon: MessageCircle,
    tilt: 'lg:rotate-[3deg]',
  },
] as const

const cardClass =
  'bg-[#1a1a1a] text-white shadow-[0_18px_40px_rgba(26,26,26,0.28)]'

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
            'lg:mx-auto lg:max-w-[1080px] lg:items-stretch lg:justify-center lg:gap-5 lg:overflow-visible lg:pb-10'
          )}
        >
          {cards.map((card) => (
            <article
              key={card.n}
              className={cn(
                'flex min-h-[320px] w-[min(230px,78vw)] shrink-0 snap-center flex-col rounded-[1.5rem] p-4 pb-5 sm:min-h-[348px] sm:p-5',
                'lg:min-h-[368px] lg:w-[250px] lg:transition-transform',
                cardClass,
                card.tilt
              )}
            >
              <div className="flex items-center justify-between">
                <Image
                  src="/images/matching/isotipo-blanco.png"
                  alt="Synergy"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
                <span
                  className={cn(
                    'text-[10px] font-semibold tracking-wide opacity-60',
                    manrope.className
                  )}
                >
                  {card.n}
                </span>
              </div>

              <div className="mx-auto mb-2 mt-3 flex h-16 w-16 items-center justify-center sm:mb-2.5 sm:mt-4 sm:h-[72px] sm:w-[72px]">
                <card.Icon
                  className="h-12 w-12 fill-current sm:h-14 sm:w-14"
                  fill="currentColor"
                  strokeWidth={0}
                  aria-hidden
                />
              </div>

              <h3 className="mb-1.5 text-[1.15rem] font-extrabold leading-[0.95] tracking-tight text-white sm:text-xl">
                {card.title.map((line) => (
                  <span key={line} className="block leading-[0.95]">
                    {line}
                  </span>
                ))}
              </h3>
              <p className="text-[12px] leading-[1.2] text-white/70 sm:text-[13px]">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
