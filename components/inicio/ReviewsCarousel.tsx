'use client'

import { useRef } from 'react'
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-reviews-manrope',
})

export type ReviewItem = {
  stars: number
  quote: string
  name: string
  role: string
  company: string
  initials: string
  palette: { bg: string; text: string; badge: string; badgeText: string }
}

const reviews: ReviewItem[] = [
  {
    stars: 5,
    quote:
      'Salí del evento con tres reuniones agendadas con gente que buscaba exactamente lo que ofrecemos. El match antes de llegar marca la diferencia.',
    name: 'Lucía Fernández',
    role: 'Co-fundadora',
    company: 'E-commerce',
    initials: 'LF',
    palette: { bg: '#fef9e8', text: '#713f12', badge: '#fef3c7', badgeText: '#a16207' },
  },
  {
    stars: 5,
    quote:
      'Había probado otros formatos de networking y terminaba coleccionando tarjetas. Aquí la conversación empieza con contexto; en una semana cerramos alianza.',
    name: 'Martín Ortega',
    role: 'Fundador',
    company: 'SaaS B2B',
    initials: 'MO',
    palette: { bg: '#f3f4f6', text: '#1f2937', badge: '#e5e7eb', badgeText: '#374151' },
  },
  {
    stars: 5,
    quote:
      'El ambiente es cercano y el pitch me abrió puertas con mentores que no habría conocido de otra forma. Volveré a cada edición que pueda.',
    name: 'Valentina Ríos',
    role: 'CEO',
    company: 'Healthtech',
    initials: 'VR',
    palette: { bg: '#faf5ff', text: '#6b21a8', badge: '#f3e8ff', badgeText: '#7e22ce' },
  },
  {
    stars: 5,
    quote:
      'Nuestro equipo de ventas aterrizó con leads cualificados desde el día uno del encuentro. La IA no sustituye al café, lo hace más eficiente.',
    name: 'Diego Castillo',
    role: 'Head of Growth',
    initials: 'DC',
    company: 'Fintech',
    palette: { bg: '#eff6ff', text: '#1e40af', badge: '#dbeafe', badgeText: '#1d4ed8' },
  },
  {
    stars: 5,
    quote:
      'Como inversionista busco claridad y velocidad. En Synergy conozco a founders con traction real y respuestas concretas, no solo slides.',
    name: 'Ana Morales',
    role: 'Angel investor',
    company: 'Independiente',
    initials: 'AM',
    palette: { bg: '#fff7ed', text: '#9a3412', badge: '#ffedd5', badgeText: '#c2410c' },
  },
  {
    stars: 5,
    quote:
      'Postulamos nuestra ciudad y el proceso fue claro. La comunidad local ya pide la siguiente fecha.',
    name: 'Karla Mejía',
    role: 'Organizadora',
    company: 'Hub regional',
    initials: 'KM',
    palette: { bg: '#f0fdf4', text: '#166534', badge: '#dcfce7', badgeText: '#15803d' },
  },
  {
    stars: 5,
    quote:
      'El panel de miembros y las recomendaciones me ayudaron a retomar conversaciones que se habían enfriado. Es red viva, no una lista estática.',
    name: 'Santiago Pérez',
    role: 'Co-fundador',
    company: 'Logística',
    initials: 'SP',
    palette: { bg: '#fef2f2', text: '#991b1b', badge: '#fee2e2', badgeText: '#b91c1c' },
  },
  {
    stars: 5,
    quote:
      'Llevamos a todo el equipo a un evento y el check-in y la dinámica en mesa evitaron el awkward silence inicial. Experiencia muy cuidada.',
    name: 'Elena Vargas',
    role: 'Chief of Staff',
    company: 'Marketplace',
    initials: 'EV',
    palette: { bg: '#f5f5f5', text: '#1a1a1a', badge: '#e5e5e5', badgeText: '#404040' },
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mb-3.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn('text-base', i < count ? 'text-[#E5B318]' : 'text-neutral-300')}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: ReviewItem }) {
  const { stars, quote, name, role, company, initials, palette } = review
  return (
    <article
      className={cn(
        'shrink-0 w-[320px] rounded-2xl border border-[#1a1a1a]/10 bg-white p-6',
        'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]',
        'transition-[box-shadow,transform] duration-200 ease-out',
        'hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)]'
      )}
    >
      <Stars count={stars} />
      <p className="text-[14.5px] text-neutral-700 leading-relaxed mb-5 font-normal">
        <span className="text-[#E5B318]/90 text-[22px] leading-none align-[-6px] mr-0.5 font-serif">
          &ldquo;
        </span>
        {quote}
      </p>
      <div className="h-px bg-neutral-100 mb-4" />
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 text-[13px] font-bold tracking-wide"
          style={{ background: palette.bg, color: palette.text }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className={cn('text-[13.5px] font-semibold text-[#1a1a1a] mb-0.5', manrope.className)}>
            {name}
          </div>
          <div className="text-xs text-neutral-500 truncate">{role}</div>
        </div>
        <span
          className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0',
            manrope.className
          )}
          style={{ background: palette.badge, color: palette.badgeText }}
        >
          {company}
        </span>
      </div>
    </article>
  )
}

function TrackRowInner({
  items,
  direction,
}: {
  items: ReviewItem[]
  direction: 'left' | 'right'
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pause = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
  }
  const resume = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
  }

  const doubled = [...items, ...items]

  return (
    <div
      ref={trackRef}
      onMouseEnter={pause}
      onMouseLeave={resume}
      className={cn(
        'flex gap-5 w-max mb-5',
        direction === 'left' ? 'animate-reviews-scroll-left' : 'animate-reviews-scroll-right',
        'motion-reduce:animate-none'
      )}
    >
      {doubled.map((r, i) => (
        <ReviewCard key={`${r.name}-${i}`} review={r} />
      ))}
    </div>
  )
}

export default function ReviewsCarousel() {
  const row1 = reviews.slice(0, 5)
  const row2 = reviews.slice(3)

  const stats: { num: string; label: string; showStar?: boolean }[] = [
    { num: '4.9', label: 'valoración media', showStar: true },
    { num: '500+', label: 'founders en eventos' },
    { num: '98%', label: 'recomendarían la experiencia' },
  ]

  return (
    <section
      className={cn(
        'py-16 lg:py-24 overflow-hidden w-full',
        manrope.variable
      )}
      aria-labelledby="reviews-heading"
    >
      <div className="text-center px-6 mb-14 max-w-2xl mx-auto">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/15',
            'bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider',
            'text-[#1a1a1a]/80 mb-5',
            manrope.className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5B318]" aria-hidden />
          testimonios
        </div>
        <h2
          id="reviews-heading"
          className={cn(
            'text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] lowercase tracking-tight leading-tight mb-3.5',
            manrope.className
          )}
        >
          lo que dicen quienes ya vivieron la experiencia
        </h2>
        <p className="text-base text-neutral-600 leading-relaxed max-w-md mx-auto lowercase">
          founders, operadores e inversionistas que conectaron en synergy.
        </p>
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-[2] bg-gradient-to-r from-[#f2f2f2] to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-[2] bg-gradient-to-l from-[#f2f2f2] to-transparent"
          aria-hidden
        />

        <TrackRowInner items={row1} direction="left" />
        <TrackRowInner items={row2} direction="right" />
      </div>

      <div className="flex justify-center gap-10 sm:gap-14 lg:gap-24 mt-12 px-6 flex-wrap">
        {stats.map(({ num, label, showStar }) => (
          <div key={label} className="text-center">
            <div
              className={cn(
                'text-3xl font-bold text-[#1a1a1a] tracking-tight leading-none mb-1',
                manrope.className
              )}
            >
              {showStar ? (
                <>
                  {num}
                  <span className="text-lg text-[#E5B318]">★</span>
                </>
              ) : (
                num
              )}
            </div>
            <div className="text-[13px] text-neutral-500 lowercase">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
