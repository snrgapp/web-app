'use client'

import { RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

type LayerParams = {
  rotateY: number
  rotateX: number
  translateZ: number
  translateX: number
  scale: number
  parallaxY: number
}

/** Abanico lateral premium: tarjetas apiladas con overlap visual fuerte */
const LAYER_PARAMS: LayerParams[] = [
  { rotateY: -28, rotateX: 4, translateZ: -80, translateX: -140, scale: 0.75, parallaxY: 0 },
  { rotateY: -18, rotateX: 3, translateZ: -40, translateX: -70, scale: 0.85, parallaxY: 8 },
  { rotateY: -8, rotateX: 2, translateZ: -10, translateX: 10, scale: 0.94, parallaxY: 12 },
  { rotateY: 4, rotateX: 1, translateZ: 50, translateX: 90, scale: 1.05, parallaxY: 18 },
]

const LAYER_PARAMS_MOBILE: LayerParams[] = [
  { rotateY: -16, rotateX: 2, translateZ: -45, translateX: -85, scale: 0.82, parallaxY: 0 },
  { rotateY: -10, rotateX: 2, translateZ: -20, translateX: -40, scale: 0.90, parallaxY: 6 },
  { rotateY: -4, rotateX: 1, translateZ: 5, translateX: 15, scale: 0.96, parallaxY: 10 },
  { rotateY: 0, rotateX: 0, translateZ: 30, translateX: 65, scale: 1.03, parallaxY: 14 },
]

export interface UseHeroImageStackOptions {
  stackContainerRef: RefObject<HTMLDivElement | null>
  imageRefs: RefObject<HTMLDivElement>[]
  heroSectionRef: RefObject<HTMLElement | null>
}

export function useHeroImageStack({
  stackContainerRef,
  imageRefs,
  heroSectionRef,
}: UseHeroImageStackOptions) {
  useGSAP(
    () => {
      const trigger = heroSectionRef.current
      if (!trigger) return

      const params = LAYER_PARAMS
      const paramsMobile = LAYER_PARAMS_MOBILE

      const ctx = gsap.context(() => {
        ScrollTrigger.matchMedia({
          '(min-width: 768px)': () => {
            imageRefs.forEach((ref, index) => {
              const el = ref.current
              if (!el) return

              const p = params[Math.min(index, params.length - 1)]

              gsap.set(el, {
                rotationY: p.rotateY,
                rotationX: p.rotateX,
                rotationZ: index * -1.2,
                z: p.translateZ,
                x: p.translateX,
                scale: p.scale,
                opacity: 0,
                y: 40,
              })

              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                delay: index * 0.1,
                scrollTrigger: {
                  trigger,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              })

              gsap.to(el, {
                rotationY: 0,
                rotationX: 0,
                z: 0,
                x: p.translateX,
                scale: 1,
                y: p.parallaxY * 0.4,
                ease: 'none',
                scrollTrigger: {
                  trigger,
                  start: 'top bottom',
                  end: 'center center',
                  scrub: 1.5,
                },
              })
            })
          },
          '(max-width: 767px)': () => {
            imageRefs.forEach((ref, index) => {
              const el = ref.current
              if (!el) return

              const p = paramsMobile[Math.min(index, paramsMobile.length - 1)]

              gsap.set(el, {
                rotationY: p.rotateY,
                rotationX: p.rotateX,
                rotationZ: index * -1.2,
                z: p.translateZ,
                x: p.translateX,
                scale: p.scale,
                opacity: 0,
                y: 30,
              })

              gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'power3.out',
                delay: index * 0.08,
                scrollTrigger: {
                  trigger,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              })

              gsap.to(el, {
                rotationY: 0,
                rotationX: 0,
                z: 0,
                x: p.translateX,
                scale: 1,
                y: p.parallaxY * 0.25,
                ease: 'none',
                scrollTrigger: {
                  trigger,
                  start: 'top bottom',
                  end: 'center center',
                  scrub: 1,
                },
              })
            })
          },
        })
      }, stackContainerRef)

      return () => ctx.revert()
    },
    { dependencies: [imageRefs.length], scope: stackContainerRef }
  )
}
