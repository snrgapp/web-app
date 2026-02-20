'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

export function MiniCalendar() {
  const [date, setDate] = useState(() => new Date())
  const year = date.getFullYear()
  const month = date.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()
  const today = new Date()

  const days: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  function isToday(day: number | null) {
    if (!day) return false
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setDate(new Date(year, month - 1))}
          className="p-1 rounded hover:bg-zinc-100 text-zinc-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-zinc-700">
          {date.toLocaleDateString('es', { month: 'short', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={() => setDate(new Date(year, month + 1))}
          className="p-1 rounded hover:bg-zinc-100 text-zinc-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {DAYS.map((d) => (
          <span key={d} className="text-[10px] font-medium text-zinc-400 py-1">
            {d}
          </span>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={cn(
              'py-1 text-xs font-medium',
              !day && 'invisible',
              day && isToday(day) && 'rounded-full bg-amber-100 text-amber-900',
              day && !isToday(day) && 'text-zinc-600'
            )}
          >
            {day ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}
