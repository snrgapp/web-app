'use client'

import { RefObject, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ENTER_OFFSET = 80
const EXIT_OFFSET = -100
const SCRUB = 1.2

export function useCinematicScroll(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sections = Array.from(container.querySelectorAll('section'))
    const triggers: ScrollTrigger[] = []

    sections.forEach((section) => {
      const el = section as HTMLElement

      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: SCRUB,
          onUpdate: (self) => {
            const p = self.progress
            const y = p < 0.5
              ? ENTER_OFFSET * (1 - p * 2)
              : EXIT_OFFSET * ((p - 0.5) * 2)
            gsap.set(el, { y })
          },
        })
      )
    })

    return () => triggers.forEach((t) => t.kill())
  }, [containerRef])
}
