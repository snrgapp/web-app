'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'
import {
  COMMUNITY_CITIES,
  COMMUNITY_ROUTES,
} from '@/lib/community-map-config'

const manrope = Manrope({ subsets: ['latin'] })

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function TravelerDot({
  ax,
  ay,
  bx,
  by,
  color,
  routeIndex,
  travelerIndex,
  reducedMotion,
}: {
  ax: number
  ay: number
  bx: number
  by: number
  color: string
  routeIndex: number
  travelerIndex: 0 | 1
  reducedMotion: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const el = ref.current
    if (!el) return
    let raf = 0
    let cancelled = false
    const duration = 2800 + routeIndex * 180 + travelerIndex * 900
    const delay = routeIndex * 320 + travelerIndex * 1400
    let startTime: number | null = null
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)
    const mcx = (ax + bx) / 2
    const mcy = (ay + by) / 2 - 8

    function tick(ts: number) {
      if (cancelled || !el) return
      if (startTime === null) startTime = ts + delay
      const elapsed = ts - startTime
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const rawT = (elapsed % duration) / duration
      const t = ease(rawT)
      const px = (1 - t) * (1 - t) * ax + 2 * (1 - t) * t * mcx + t * t * bx
      const py = (1 - t) * (1 - t) * ay + 2 * (1 - t) * t * mcy + t * t * by
      el.style.left = `${px}%`
      el.style.top = `${py}%`
      const op = rawT < 0.1 ? rawT / 0.1 : rawT > 0.9 ? (1 - rawT) / 0.1 : 1
      el.style.opacity = String(op)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [ax, ay, bx, by, routeIndex, travelerIndex, reducedMotion])

  if (reducedMotion) return null

  return (
    <div
      ref={ref}
      className="absolute z-[15] h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        background: color,
        boxShadow: `0 0 8px ${color}, 0 0 14px ${color}`,
        left: `${ax}%`,
        top: `${ay}%`,
      }}
    />
  )
}

export default function CommunityMapSection() {
  const reducedMotion = usePrefersReducedMotion()
  const [tooltip, setTooltip] = useState<{
    text: string
    left: string
    top: string
  } | null>(null)

  return (
    <section
      className="py-16 lg:py-24 w-full"
      aria-labelledby="community-map-heading"
    >
      <div className="text-center px-6 mb-12 max-w-2xl mx-auto">
        <div
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a]/15',
            'bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider',
            'text-[#1a1a1a]/80 mb-5',
            manrope.className
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5B318]" aria-hidden />
          comunidad
        </div>
        <h2
          id="community-map-heading"
          className={cn(
            'text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] lowercase tracking-tight leading-tight mb-3.5',
            manrope.className
          )}
        >
          mapa de la comunidad
        </h2>
        <p className="text-base text-neutral-600 leading-relaxed max-w-md mx-auto lowercase">
          founders conectados en el caribe colombiano: cada punto es parte del ecosistema synergy.
        </p>
      </div>

      <div className="px-4 sm:px-6 flex justify-center w-full min-w-0 overflow-x-clip">
        <div
          className="relative w-full max-w-[800px] min-w-0 overflow-hidden"
          role="img"
          aria-label="Mapa estilizado de la región con nodos de founders en ciudades"
        >
          <Image
            src="/images/mapa-emprendedores.svg"
            alt=""
            width={800}
            height={615}
            unoptimized
            className="relative z-[1] block h-auto w-full max-w-full pointer-events-none select-none"
            draggable={false}
            aria-hidden
          />

          <div className="absolute inset-0 z-[5]">
          {COMMUNITY_ROUTES.map((route, ri) => {
            const A = COMMUNITY_CITIES[route.from]
            const B = COMMUNITY_CITIES[route.to]
            return (
              <span key={`route-${ri}`}>
                <TravelerDot
                  ax={A.x}
                  ay={A.y}
                  bx={B.x}
                  by={B.y}
                  color={route.color}
                  routeIndex={ri}
                  travelerIndex={0}
                  reducedMotion={reducedMotion}
                />
                <TravelerDot
                  ax={A.x}
                  ay={A.y}
                  bx={B.x}
                  by={B.y}
                  color={route.color}
                  routeIndex={ri}
                  travelerIndex={1}
                  reducedMotion={reducedMotion}
                />
              </span>
            )
          })}

          {COMMUNITY_CITIES.map((city) => (
            <div key={city.name}>
              <button
                type="button"
                className={cn(
                  'community-map-hotspot-pulse absolute z-20 h-2 w-2 -translate-x-1/2 -translate-y-1/2 cursor-default rounded-full border-0 p-0',
                  'bg-[#E5B318] shadow-[0_0_12px_#E5B318]',
                  '[--community-map-accent:#E5B318]'
                )}
                style={{ left: `${city.x}%`, top: `${city.y}%` }}
                aria-label={`${city.name}: ${city.info}`}
                onMouseEnter={() =>
                  setTooltip({
                    text: `${city.name}: ${city.info}`,
                    left: `calc(${city.x}% + 2%)`,
                    top: `calc(${city.y}% - 5%)`,
                  })
                }
                onMouseLeave={() => setTooltip(null)}
                onFocus={() =>
                  setTooltip({
                    text: `${city.name}: ${city.info}`,
                    left: `calc(${city.x}% + 2%)`,
                    top: `calc(${city.y}% - 5%)`,
                  })
                }
                onBlur={() => setTooltip(null)}
              />
              <div
                className={cn(
                  'pointer-events-none absolute z-[18] -translate-x-1/2 text-[9px] font-bold uppercase tracking-wider text-[#1a1a1a]/70',
                  manrope.className
                )}
                style={{
                  left: `${city.x}%`,
                  top: `calc(${city.y}% + 3%)`,
                }}
              >
                {city.name}
              </div>
            </div>
          ))}
          </div>

          {tooltip && (
            <div
              className={cn(
                'absolute z-[40] rounded-md border-2 border-[#E5B318] bg-white/95 px-2.5 py-1 text-xs text-[#1a1a1a]',
                'shadow-md whitespace-nowrap pointer-events-none',
                manrope.className
              )}
              style={{ left: tooltip.left, top: tooltip.top }}
            >
              {tooltip.text}
            </div>
          )}

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[32%] bg-gradient-to-b from-transparent via-[#f2f2f2]/45 to-transparent"
            aria-hidden
          />
        </div>
      </div>
    </section>
  )
}
