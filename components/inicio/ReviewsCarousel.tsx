'use client'

import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'
import { useI18n } from '@/components/i18n/LanguageProvider'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-reviews-manrope',
})

type Contrast = 'ink' | 'gold' | 'paper' | 'charcoal' | 'cream' | 'inkGold' | 'mist'

type ReviewItem = {
  quote: string
  name: string
  contrast: Contrast
  rotate: string
  desktop: string
}

const contrasts: Record<
  Contrast,
  { card: string; quote: string; name: string; star: string; rule: string }
> = {
  ink: {
    card: 'bg-[#1a1a1a] text-white shadow-[0_18px_40px_rgba(26,26,26,0.28)]',
    quote: 'text-white/90',
    name: 'text-white',
    star: 'text-[#E5B318]',
    rule: 'bg-white/15',
  },
  gold: {
    card: 'bg-[#E5B318] text-[#1a1a1a] shadow-[0_18px_40px_rgba(229,179,24,0.35)]',
    quote: 'text-[#1a1a1a]',
    name: 'text-[#1a1a1a]',
    star: 'text-[#1a1a1a]',
    rule: 'bg-[#1a1a1a]/20',
  },
  paper: {
    card: 'bg-white text-[#1a1a1a] shadow-[0_18px_40px_rgba(26,26,26,0.12)] ring-1 ring-black/[0.04]',
    quote: 'text-[#1a1a1a]/85',
    name: 'text-[#1a1a1a]',
    star: 'text-[#E5B318]',
    rule: 'bg-[#1a1a1a]/10',
  },
  charcoal: {
    card: 'bg-[#2a2a2a] text-[#f4f4f4] shadow-[0_18px_40px_rgba(26,26,26,0.24)]',
    quote: 'text-[#f4f4f4]/90',
    name: 'text-white',
    star: 'text-[#E5B318]',
    rule: 'bg-white/12',
  },
  cream: {
    card: 'bg-[#FFF4C8] text-[#1a1a1a] shadow-[0_18px_40px_rgba(229,179,24,0.18)]',
    quote: 'text-[#1a1a1a]/85',
    name: 'text-[#1a1a1a]',
    star: 'text-[#1a1a1a]',
    rule: 'bg-[#1a1a1a]/12',
  },
  inkGold: {
    card: 'bg-[#111] text-[#E5B318] shadow-[0_18px_40px_rgba(0,0,0,0.32)]',
    quote: 'text-[#E5B318]',
    name: 'text-[#E5B318]',
    star: 'text-[#E5B318]',
    rule: 'bg-[#E5B318]/35',
  },
  mist: {
    card: 'bg-[#f7f7f7] text-[#1a1a1a] shadow-[0_18px_40px_rgba(26,26,26,0.1)] ring-1 ring-black/[0.05]',
    quote: 'text-[#1a1a1a]/80',
    name: 'text-[#1a1a1a]',
    star: 'text-[#E5B318]',
    rule: 'bg-[#1a1a1a]/10',
  },
}

const reviewMeta: Omit<ReviewItem, 'quote'>[] = [
  {
    name: 'Lucía F.',
    contrast: 'ink',
    rotate: '-rotate-[4deg]',
    desktop: 'lg:left-[8%] lg:top-[26%] lg:-rotate-[13deg] lg:z-[12]',
  },
  {
    name: 'Martín O.',
    contrast: 'gold',
    rotate: 'rotate-[3deg]',
    desktop: 'lg:left-[24%] lg:top-[8%] lg:-rotate-[6deg] lg:z-[18]',
  },
  {
    name: 'Valentina R.',
    contrast: 'paper',
    rotate: '-rotate-[2deg]',
    desktop: 'lg:left-[50%] lg:top-[4%] lg:rotate-[8deg] lg:z-[14]',
  },
  {
    name: 'Diego C.',
    contrast: 'cream',
    rotate: 'rotate-[2deg]',
    desktop: 'lg:left-[40%] lg:top-[34%] lg:rotate-[7deg] lg:z-[32]',
  },
  {
    name: 'Ana M.',
    contrast: 'inkGold',
    rotate: '-rotate-[3deg]',
    desktop: 'lg:left-[20%] lg:top-[46%] lg:-rotate-[3deg] lg:z-[24]',
  },
  {
    name: 'Karla M.',
    contrast: 'charcoal',
    rotate: 'rotate-[4deg]',
    desktop: 'lg:left-[58%] lg:top-[20%] lg:rotate-[11deg] lg:z-[22]',
  },
  {
    name: 'Santiago P.',
    contrast: 'mist',
    rotate: '-rotate-[1deg]',
    desktop: 'lg:left-[62%] lg:top-[46%] lg:rotate-[5deg] lg:z-[16]',
  },
]

function Stars({ className }: { className: string }) {
  return (
    <div className="mb-4 flex gap-1" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cn('text-[15px] leading-none', className)}>
          ★
        </span>
      ))}
    </div>
  )
}

function ReviewCard({
  review,
  className,
}: {
  review: ReviewItem
  className?: string
}) {
  const tone = contrasts[review.contrast]
  return (
    <article
      className={cn(
        'flex h-[250px] w-[236px] shrink-0 flex-col overflow-hidden rounded-[22px] p-6 transition-transform duration-300 ease-out',
        'lg:h-[260px] lg:w-[244px] lg:origin-center lg:hover:z-50 lg:hover:rotate-0 lg:hover:scale-[1.05]',
        tone.card,
        className
      )}
    >
      <Stars className={tone.star} />
      <p
        className={cn(
          'line-clamp-5 flex-1 text-[14.5px] font-medium leading-[1.35] tracking-tight',
          tone.quote,
          manrope.className
        )}
      >
        {review.quote}
      </p>
      <div className={cn('mb-3 mt-4 h-px w-full', tone.rule)} />
      <p className={cn('text-[13.5px] font-semibold', tone.name, manrope.className)}>
        {review.name}
      </p>
    </article>
  )
}

export default function ReviewsCarousel() {
  const { t } = useI18n()
  const reviews: ReviewItem[] = reviewMeta.map((meta, i) => ({
    ...meta,
    quote: t.reviews.quotes[i],
  }))
  const stats = t.reviews.stats

  return (
    <section
      className={cn(
        'w-full overflow-x-clip pt-16 pb-10 lg:overflow-visible lg:pt-24 lg:pb-16',
        manrope.variable
      )}
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto mb-10 max-w-2xl px-4 text-center sm:mb-14 sm:px-6">
        <h2
          id="reviews-heading"
          className={cn(
            'scroll-mt-24 text-2xl font-bold lowercase leading-tight tracking-tight text-[#1a1a1a] sm:text-3xl lg:text-4xl',
            manrope.className
          )}
        >
          <span className="block">{t.reviews.heading[0]}</span>
          <span className="mt-1 block text-[#E5B318]">{t.reviews.heading[1]}</span>
        </h2>
      </div>

      <div className="px-4 sm:px-6">
        <div
          className={cn(
            'flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3',
            '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            'lg:relative lg:mx-auto lg:block lg:h-[540px] lg:w-full lg:max-w-[1080px] lg:overflow-visible lg:pb-0'
          )}
        >
          {reviews.map((review) => (
            <div
              key={review.name}
              className={cn(
                'snap-center',
                review.rotate,
                'lg:absolute lg:transition-transform lg:duration-300',
                review.desktop
              )}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 px-4 sm:mt-12 sm:gap-10 lg:max-w-none lg:gap-24">
        {stats.map(({ num, label, showStar }) => (
          <div key={label} className="min-w-0 text-center">
            <div
              className={cn(
                'mb-1 text-2xl font-bold leading-none tracking-tight text-[#1a1a1a] sm:text-3xl',
                manrope.className
              )}
            >
              {num}
              {showStar ? <span className="text-lg text-[#E5B318]">★</span> : null}
            </div>
            <div className="text-[11px] lowercase leading-snug text-neutral-500 sm:text-[13px]">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
