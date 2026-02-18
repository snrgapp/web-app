'use client'

import { RefObject, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const IDLE_DURATION = 8
const IDLE_ROTATE_RANGE = 1.5

export interface UseHeroIdleMotionOptions {
  stackContainerRef: RefObject<HTMLDivElement | null>
  imageRefs: RefObject<HTMLDivElement>[]
  enabled?: boolean
}

/** Factor de amplitud por profundidad (capas traseras se mueven menos) */
const DEPTH_AMPLITUDE = [0.4, 0.6, 0.8, 1]

export function useHeroIdleMotion({
  stackContainerRef,
  imageRefs,
  enabled = true,
}: UseHeroIdleMotionOptions) {
  const tweensRef = useRef<gsap.core.Tween[]>([])
  const isPausedRef = useRef(false)
  const isInteractingRef = useRef(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!enabled || imageRefs.length === 0) return

    const handleScrollStart = () => {
      isPausedRef.current = true
      tweensRef.current.forEach((t) => t.pause())
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }

    const handleScrollEnd = () => {
      scrollTimeoutRef.current = setTimeout(() => {
        isPausedRef.current = false
        if (!isInteractingRef.current) {
          tweensRef.current.forEach((t) => t.resume())
        }
      }, 300)
    }

    const handlePointerEnter = () => {
      isInteractingRef.current = true
      tweensRef.current.forEach((t) => t.pause())
    }

    const handlePointerLeave = () => {
      isInteractingRef.current = false
      if (!isPausedRef.current) {
        tweensRef.current.forEach((t) => t.resume())
      }
    }

    ScrollTrigger.addEventListener('scrollStart', handleScrollStart)
    ScrollTrigger.addEventListener('scrollEnd', handleScrollEnd)

    const container = stackContainerRef.current
    if (container) {
      container.addEventListener('pointerenter', handlePointerEnter)
      container.addEventListener('pointerleave', handlePointerLeave)
    }

    tweensRef.current = imageRefs
      .map((ref, index) => {
        const el = ref.current
        if (!el) return null
        const amp = DEPTH_AMPLITUDE[Math.min(index, DEPTH_AMPLITUDE.length - 1)]
        const rotRange = IDLE_ROTATE_RANGE * amp

        const t = gsap.to(el, {
          rotationZ: `+=${rotRange}`,
          duration: IDLE_DURATION / 2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          repeatDelay: 0,
          paused: true,
        })

        t.play()
        return t
      })
      .filter((t): t is gsap.core.Tween => t !== null)

    return () => {
      ScrollTrigger.removeEventListener('scrollStart', handleScrollStart)
      ScrollTrigger.removeEventListener('scrollEnd', handleScrollEnd)
      if (container) {
        container.removeEventListener('pointerenter', handlePointerEnter)
        container.removeEventListener('pointerleave', handlePointerLeave)
      }
      tweensRef.current.forEach((t) => t.kill())
      tweensRef.current = []
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    }
  }, [stackContainerRef, imageRefs, enabled])
}
