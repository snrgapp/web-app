'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Manrope } from 'next/font/google'
import { useI18n } from '@/components/i18n/LanguageProvider'

const manrope = Manrope({ subsets: ['latin'] })
const impact: { fontFamily: string } = {
  fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", "Franklin Gothic Bold", sans-serif',
}

const VB = { w: 1200, h: 640 }

const PATH =
  'M 40 340 C 140 340 160 480 280 480 S 410 175 530 175 S 640 485 750 485 S 840 190 940 190 S 1080 430 1170 400'

const PIN_AT = [0.1, 0.17, 0.39, 0.61, 0.82, 0.97]
const PIN_ABOVE = [true, false, true, false, true, false]

type StepItem = { n: string; title: string; body: string }

type Pin = { x: number; y: number; above: boolean }

export default function ThreeStepsSection() {
  const { t } = useI18n()
  const steps = t.steps.items

  return (
    <section className="w-full py-12 sm:py-16 lg:py-24" aria-labelledby="three-steps-heading">
      <div className="mb-8 px-4 text-center sm:mb-10 sm:px-6 lg:mb-4">
        <h2
          id="three-steps-heading"
          className="scroll-mt-24 text-[1.375rem] font-bold lowercase leading-[1.15] tracking-tight text-[#1a1a1a] sm:text-2xl md:text-3xl lg:text-4xl"
        >
          <span className="block">{t.steps.heading[0]}</span>
          <span className="mt-1 block text-[#E5B318]">{t.steps.heading[1]}</span>
        </h2>
      </div>

      <MobileTimeline steps={steps} />
      <RoadMap steps={steps} />

      <div className="mt-10 flex justify-center px-4 sm:mt-12 sm:px-6 lg:mt-6">
        <a
          href="https://www.snrg.lat/reunion"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-7 py-3.5',
            'text-sm font-semibold text-white transition-colors hover:bg-[#2d2d2d] sm:w-auto',
            manrope.className
          )}
        >
          {t.steps.cta}
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </a>
      </div>
    </section>
  )
}

function RoadMap({ steps }: { steps: StepItem[] }) {
  const pathRef = useRef<SVGPathElement>(null)
  const [pins, setPins] = useState<Pin[]>([])

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    setPins(
      PIN_AT.map((t, i) => {
        const pt = path.getPointAtLength(len * t)
        return { x: pt.x, y: pt.y, above: PIN_ABOVE[i] ?? pt.y < VB.h * 0.48 }
      })
    )
  }, [])

  return (
    <div className="relative mx-auto hidden w-full max-w-[1180px] px-6 lg:block" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        fill="none"
        aria-hidden
      >
        <defs>
          <filter id="ts-road-shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="18" stdDeviation="24" floodColor="#1a1a1a" floodOpacity="0.18" />
          </filter>
        </defs>
        <path
          ref={pathRef}
          d={PATH}
          stroke="#ffffff"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#ts-road-shadow)"
        />
        <path
          d={PATH}
          stroke="#1a1a1a"
          strokeOpacity="0.06"
          strokeWidth="36"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {pins.map((pin, i) => {
        const step = steps[i]
        if (!step) return null
        return (
          <div
            key={step.n}
            className="absolute z-[1] w-[200px] -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(pin.x / VB.w) * 100}%`,
              top: `${(pin.y / VB.h) * 100}%`,
            }}
          >
            <div
              className={cn(
                'absolute left-1/2 w-[200px] -translate-x-1/2 text-center',
                pin.above ? 'bottom-[calc(100%+32px)]' : 'top-[calc(100%+32px)]'
              )}
            >
              <p
                className="text-[22px] leading-none tracking-tight text-[#E5B318]"
                style={impact}
              >
                {step.n}
              </p>
              <p className="mt-0.5 text-base font-bold leading-none tracking-tight text-[#1a1a1a]">
                {step.title}
              </p>
              <p className="mt-1 text-[12px] leading-[1.2] text-neutral-600">{step.body}</p>
            </div>

            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
              <span
                className="block h-[26px] w-[26px] rounded-full bg-[#1a1a1a] shadow-[0_12px_28px_rgba(26,26,26,0.28)]"
                aria-hidden
              >
                <span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E5B318]" />
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MobileTimeline({ steps }: { steps: StepItem[] }) {
  return (
    <ol className="relative mx-auto max-w-md px-4 sm:px-6 lg:hidden">
      <span
        className="absolute bottom-3 left-[7px] top-3 w-2 rounded-full bg-white shadow-[0_10px_28px_rgba(26,26,26,0.16)]"
        aria-hidden
      />
      {steps.map((step) => (
          <li key={step.n} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-5 sm:pb-10">
            <span
              className="relative z-[1] mt-1.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#1a1a1a] shadow-[0_10px_24px_rgba(26,26,26,0.28)]"
              aria-hidden
            >
              <span className="h-2 w-2 rounded-full bg-[#E5B318]" />
            </span>
            <div className="min-w-0">
              <p className="text-[22px] leading-none tracking-tight text-[#E5B318]" style={impact}>
                {step.n}
              </p>
              <p className="mt-0.5 text-base font-bold leading-none tracking-tight text-[#1a1a1a] sm:text-lg">
                {step.title}
              </p>
              <p className="mt-1 text-sm leading-[1.2] text-neutral-600">{step.body}</p>
            </div>
          </li>
      ))}
    </ol>
  )
}
