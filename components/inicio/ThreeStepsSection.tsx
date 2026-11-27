'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  ClipboardList,
  Handshake,
  Sparkles,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { Manrope } from 'next/font/google'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { useI18n } from '@/components/i18n/LanguageProvider'

gsap.registerPlugin(ScrollTrigger)

const manrope = Manrope({ subsets: ['latin'] })

const NAV_OFFSET = 64
const stepIcons: LucideIcon[] = [
  ClipboardList,
  UserRound,
  Sparkles,
  Bell,
  Users,
  Handshake,
]

export default function ThreeStepsSection() {
  const { t } = useI18n()
  const steps = t.steps.items.map((step, i) => ({
    ...step,
    Icon: stepIcons[i],
  }))
  const n = steps.length
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const step = steps[active] ?? steps[0]

  useEffect(() => {
    const track = trackRef.current
    if (!track || n === 0) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const st = ScrollTrigger.create({
      trigger: track,
      start: `top top+=${NAV_OFFSET}`,
      end: 'bottom bottom',
      onUpdate: (self) => {
        const i = Math.min(n - 1, Math.floor(self.progress * n))
        setActive((prev) => (prev === i ? prev : i))
      },
    })

    return () => st.kill()
  }, [n])

  const goTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const trackTop = track.getBoundingClientRect().top + window.scrollY
    const startScroll = trackTop - NAV_OFFSET
    const endScroll = trackTop + track.offsetHeight - window.innerHeight
    const y = startScroll + ((index + 0.35) / n) * (endScroll - startScroll)
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section
      data-no-cinematic
      className="w-full"
      aria-labelledby="three-steps-heading"
    >
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${Math.max(n, 1) * 75}vh` }}
      >
        <div className="sticky top-16 z-[1] flex flex-col bg-[#f2f2f2] px-4 py-6 sm:px-6 lg:min-h-[calc(100svh-4rem)] lg:justify-center lg:px-8 lg:py-8">
          <div className="mx-auto grid w-full max-w-[1080px] flex-1 items-center gap-8 lg:grid-cols-2 lg:gap-0">
            <div className="lg:flex lg:justify-end lg:pr-14">
              <div className="w-full max-w-[360px] lg:ml-auto">
                <h2
                  id="three-steps-heading"
                  className="mb-5 scroll-mt-24 text-balance text-center text-[1.375rem] font-bold lowercase leading-[1.12] tracking-tight text-[#1a1a1a] sm:text-2xl lg:mb-10 lg:text-left lg:text-[1.85rem]"
                >
                  <span className="block">{t.steps.heading[0]}</span>
                  <span className="block text-[#E5B318]">{t.steps.heading[1]}</span>
                </h2>

                <div className="flex items-stretch">
                  <nav aria-label={t.steps.heading.join(' ')} className="min-w-0 flex-1">
                    <ol className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:gap-5 lg:overflow-visible lg:pb-0">
                      {steps.map((item, i) => {
                        const on = i === active
                        return (
                          <li key={item.n} className="shrink-0">
                            <button
                              type="button"
                              onClick={() => goTo(i)}
                              aria-current={on ? 'step' : undefined}
                              className={cn(
                                'flex items-center gap-2.5 rounded-full px-3 py-2 text-left transition-colors lg:rounded-none lg:px-0 lg:py-0',
                                on ? 'bg-white lg:bg-transparent' : 'bg-transparent'
                              )}
                            >
                              <item.Icon
                                className={cn(
                                  'h-5 w-5 shrink-0 transition-colors',
                                  on ? 'text-[#E5B318]' : 'text-neutral-400'
                                )}
                                strokeWidth={1.35}
                                aria-hidden
                              />
                              <span
                                className={cn(
                                  'whitespace-nowrap text-sm lowercase tracking-tight transition-colors',
                                  manrope.className,
                                  on
                                    ? 'font-bold text-[#1a1a1a]'
                                    : 'font-medium text-neutral-400'
                                )}
                              >
                                {item.title}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ol>
                  </nav>
                  <div className="relative ml-6 hidden w-px bg-black/10 lg:block" aria-hidden>
                    <span
                      className="absolute left-1/2 h-10 w-[3px] -translate-x-1/2 rounded-full bg-[#E5B318] transition-[top] duration-300 ease-out"
                      style={{
                        top: `calc(${((active + 0.5) / n) * 100}% - 20px)`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-center pt-2 lg:items-center lg:justify-start lg:pl-14 lg:pt-0">
              <AnimatePresence mode="wait">
                {step ? (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="w-full max-w-md text-center lg:text-left"
                  >
                    <step.Icon
                      className="mx-auto mb-6 h-14 w-14 text-[#1a1a1a]/35 lg:mx-0 lg:h-16 lg:w-16"
                      strokeWidth={1.25}
                      aria-hidden
                    />
                    <h3 className="mb-3 text-[1.75rem] font-extrabold lowercase leading-[0.95] tracking-tight text-[#1a1a1a] sm:text-3xl lg:text-4xl">
                      {step.title}.
                    </h3>
                    <p
                      className={cn(
                        'mx-auto max-w-md text-[15px] leading-[1.25] text-neutral-600 lg:mx-0 lg:text-base',
                        manrope.className
                      )}
                    >
                      {step.body}
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
