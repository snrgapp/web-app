'use client'

import { RefObject, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ROTATE_Y_MAX = 6
const ROTATE_X_MAX = 4
const ROTATE_Y_MAX_MOBILE = 3
const ROTATE_X_MAX_MOBILE = 2

export interface UseHeroPointerInteractionOptions {
  stackContainerRef: RefObject<HTMLDivElement | null>
  imageRefs: RefObject<HTMLDivElement>[]
  enabled?: boolean
}

/** Profundidad aproximada por índice para modular intensidad (0 = atrás, 1 = frente) */
const DEPTH_FACTOR = [0.3, 0.5, 0.8, 1]

export function useHeroPointerInteraction({
  stackContainerRef,
  imageRefs,
  enabled = true,
}: UseHeroPointerInteractionOptions) {
  const quickTosRef = useRef<{ ry: gsap.QuickToFunc; rx: gsap.QuickToFunc }[]>([])
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 767px)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const container = stackContainerRef.current
    if (!container || imageRefs.length === 0) return

    const handleScrollStart = () => {
      isScrollingRef.current = true
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }

    const handleScrollEnd = () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 150)
    }

    ScrollTrigger.addEventListener('scrollStart', handleScrollStart)
    ScrollTrigger.addEventListener('scrollEnd', handleScrollEnd)

    const noop = (() => {}) as unknown as gsap.QuickToFunc
    quickTosRef.current = imageRefs.map((ref) => {
      const el = ref.current
      if (!el) return { ry: noop, rx: noop }
      return {
        ry: gsap.quickTo(el, 'rotationY', { duration: 0.4, ease: 'power2.out' }),
        rx: gsap.quickTo(el, 'rotationX', { duration: 0.4, ease: 'power2.out' }),
      }
    })

    const handlePointerMove = (e: PointerEvent) => {
      if (isScrollingRef.current) return

      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = (e.clientX - centerX) / (rect.width / 2)
      const dy = (e.clientY - centerY) / (rect.height / 2)

      const maxRY = isMobile ? ROTATE_Y_MAX_MOBILE : ROTATE_Y_MAX
      const maxRX = isMobile ? ROTATE_X_MAX_MOBILE : ROTATE_X_MAX

      imageRefs.forEach((_, index) => {
        const q = quickTosRef.current[index]
        if (!q) return
        const factor = DEPTH_FACTOR[Math.min(index, DEPTH_FACTOR.length - 1)]
        const targetRY = Math.max(-maxRY, Math.min(maxRY, dx * maxRY * factor))
        const targetRX = Math.max(-maxRX, Math.min(maxRX, -dy * maxRX * factor))
        q.ry(targetRY)
        q.rx(targetRX)
      })
    }

    const handlePointerLeave = () => {
      quickTosRef.current.forEach((q) => {
        q.ry(0)
        q.rx(0)
      })
    }

    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      ScrollTrigger.removeEventListener('scrollStart', handleScrollStart)
      ScrollTrigger.removeEventListener('scrollEnd', handleScrollEnd)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [stackContainerRef, imageRefs, enabled, isMobile])
}
