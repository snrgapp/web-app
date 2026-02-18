'use client'

import { RefObject, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/** translateZ aproximado por índice (capas traseras negativas, frontal positiva) */
const LAYER_DEPTH = [-80, -40, -10, 50]
const DEPTH_MIN = -80
const DEPTH_MAX = 50
const BLUR_MAX = 3
const SATURATION_BACK = 0.82

export interface UseHeroDepthEffectsOptions {
  stackContainerRef: RefObject<HTMLDivElement | null>
  imageRefs: RefObject<HTMLDivElement>[]
  enabled?: boolean
}

function normalizeDepth(z: number): number {
  const range = DEPTH_MAX - DEPTH_MIN
  return Math.max(0, Math.min(1, (z - DEPTH_MIN) / range))
}

export function useHeroDepthEffects({
  stackContainerRef,
  imageRefs,
  enabled = true,
}: UseHeroDepthEffectsOptions) {
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled) return

    const elements = imageRefs.map((ref) => ref.current).filter(Boolean) as HTMLDivElement[]
    if (elements.length === 0) return

    const applyEffects = () => {
      elements.forEach((el, index) => {
        const depth = LAYER_DEPTH[Math.min(index, LAYER_DEPTH.length - 1)]
        const t = normalizeDepth(depth)

        const blur = (1 - t) * BLUR_MAX
        const sat = SATURATION_BACK + (1 - SATURATION_BACK) * t
        const dropGlow = t > 0.85 ? ' drop-shadow(0 0 20px rgba(0,0,0,0.06))' : ''
        const filter = `blur(${blur}px) saturate(${sat})${dropGlow}`

        el.style.filter = filter
        el.style.willChange = 'filter'
      })
    }

    applyEffects()

    const observer = new MutationObserver(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        applyEffects()
        rafRef.current = null
      })
    })

    const container = stackContainerRef.current
    if (container) {
      observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] })
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      elements.forEach((el) => {
        el.style.filter = ''
        el.style.willChange = ''
      })
    }
  }, [stackContainerRef, imageRefs, enabled])
}
