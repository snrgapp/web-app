'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  onChange: (value: number) => void
  maxStars?: number
}

export function StarRating({ value, onChange, maxStars = 5 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= (hovered || value)

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 transition-transform hover:scale-110 active:scale-95"
            aria-label={`${starValue} estrella${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-transparent text-zinc-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}
