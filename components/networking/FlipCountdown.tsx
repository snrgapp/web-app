'use client'

import { useEffect, useRef, useState } from 'react'

interface FlipCountdownProps {
  startFrom?: number
  intervalMs?: number
  onComplete: () => void
}

/**
 * Flip-clock countdown component.
 * Renders a split-flap display that counts down from `startFrom` to 1,
 * then calls `onComplete`.
 */
export function FlipCountdown({
  startFrom = 5,
  intervalMs = 1000,
  onComplete,
}: FlipCountdownProps) {
  const [current, setCurrent] = useState(startFrom)
  const [next, setNext] = useState(startFrom - 1)
  const [flipping, setFlipping] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (current <= 1) {
      // last digit shown — wait one interval then complete
      const t = setTimeout(() => onCompleteRef.current(), intervalMs)
      return () => clearTimeout(t)
    }

    const t = setTimeout(() => {
      // trigger flip animation
      setFlipping(true)
      // after animation finishes, commit the new number
      const anim = setTimeout(() => {
        setCurrent((c) => c - 1)
        setNext((c) => c - 2)
        setFlipping(false)
      }, 500)
      return () => clearTimeout(anim)
    }, intervalMs)

    return () => clearTimeout(t)
  }, [current, intervalMs])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950">
      {/* Subtle label */}
      <p className="text-zinc-500 text-sm font-medium tracking-[0.25em] uppercase mb-10 select-none">
        comenzando en
      </p>

      {/* Flip card */}
      <div
        className="relative select-none"
        style={{ width: 220, height: 280 }}
      >
        {/* ── Static bottom half (shows next number) ── */}
        <div
          className="absolute inset-x-0 bottom-0 overflow-hidden"
          style={{
            height: '50%',
            borderRadius: '0 0 20px 20px',
            background: 'linear-gradient(to bottom, #1a1a1a, #111)',
            boxShadow: 'inset 0 -6px 18px rgba(0,0,0,0.6)',
          }}
        >
          {/* clip: show only bottom half of the digit */}
          <div
            className="absolute inset-x-0"
            style={{
              bottom: 0,
              height: '100%',
              display: 'flex',
              alignItems: 'flex-start', // align so digit top is at clip boundary
            }}
          >
            <span
              className="w-full text-center font-black text-white"
              style={{
                fontSize: 220,
                lineHeight: '280px',
                marginTop: '-140px', // shift so the bottom half of the digit is visible
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              }}
            >
              {next < 1 ? '' : next}
            </span>
          </div>
        </div>

        {/* ── Static top half (shows current number) ── */}
        <div
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{
            height: '50%',
            borderRadius: '20px 20px 0 0',
            background: 'linear-gradient(to bottom, #222, #181818)',
            boxShadow: 'inset 0 6px 18px rgba(0,0,0,0.5)',
          }}
        >
          <span
            className="absolute inset-x-0 text-center font-black text-white"
            style={{
              top: 0,
              fontSize: 220,
              lineHeight: '280px',
              fontVariantNumeric: 'tabular-nums',
              textShadow: '0 2px 20px rgba(0,0,0,0.6)',
            }}
          >
            {current}
          </span>
        </div>

        {/* ── Animated flap (top half that flips down) ── */}
        <div
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{
            height: '50%',
            transformOrigin: 'bottom center',
            transform: flipping ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            transition: flipping
              ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              : 'none',
            perspective: 600,
            borderRadius: '20px 20px 0 0',
            background: 'linear-gradient(to bottom, #252525, #1c1c1c)',
            zIndex: 10,
            // progressive shadow as it falls
            boxShadow: flipping
              ? 'inset 0 -8px 24px rgba(0,0,0,0.9)'
              : 'inset 0 6px 18px rgba(0,0,0,0.5)',
          }}
        >
          <span
            className="absolute inset-x-0 text-center font-black text-white"
            style={{
              top: 0,
              fontSize: 220,
              lineHeight: '280px',
              fontVariantNumeric: 'tabular-nums',
              textShadow: '0 2px 20px rgba(0,0,0,0.6)',
            }}
          >
            {current}
          </span>
        </div>

        {/* ── Back of flap (shows next number on the flip) ── */}
        <div
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{
            height: '50%',
            transformOrigin: 'bottom center',
            transform: flipping ? 'rotateX(0deg)' : 'rotateX(180deg)',
            transition: flipping
              ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              : 'none',
            perspective: 600,
            borderRadius: '20px 20px 0 0',
            background: 'linear-gradient(to bottom, #1c1c1c, #141414)',
            zIndex: 9,
            backfaceVisibility: 'hidden',
          }}
        >
          <span
            className="absolute inset-x-0 text-center font-black text-white"
            style={{
              top: 0,
              fontSize: 220,
              lineHeight: '280px',
              fontVariantNumeric: 'tabular-nums',
              textShadow: '0 2px 20px rgba(0,0,0,0.6)',
            }}
          >
            {next < 1 ? '' : next}
          </span>
        </div>

        {/* ── Centre divider line ── */}
        <div
          className="absolute inset-x-0 z-20 pointer-events-none"
          style={{
            top: '50%',
            height: 3,
            background: 'rgba(0,0,0,0.85)',
            boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
          }}
        />

        {/* ── Left hinge ── */}
        <Hinge side="left" />
        {/* ── Right hinge ── */}
        <Hinge side="right" />

        {/* ── Outer card shadow ── */}
        <div
          className="absolute inset-0 pointer-events-none rounded-[20px]"
          style={{
            boxShadow:
              '0 32px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)',
          }}
        />
      </div>
    </div>
  )
}

function Hinge({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        top: 'calc(50% - 9px)',
        [side]: -10,
        width: 20,
        height: 18,
        borderRadius: 4,
        background:
          'linear-gradient(135deg, #888 0%, #555 40%, #333 70%, #666 100%)',
        boxShadow:
          '0 2px 6px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.25)',
      }}
    />
  )
}
