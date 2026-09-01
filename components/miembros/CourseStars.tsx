import { Star } from 'lucide-react'

export function CourseStars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3'
  return (
    <div className="flex text-members-tertiary">
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = rating >= value
        const half = !filled && rating >= value - 0.5
        return (
          <Star
            key={value}
            className={cls}
            fill={filled || half ? 'currentColor' : 'none'}
            strokeWidth={filled || half ? 0 : 1.5}
          />
        )
      })}
    </div>
  )
}
