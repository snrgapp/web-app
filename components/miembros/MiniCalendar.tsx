'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const DAYS_ABBREV = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie']

function getMondayOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(date.setDate(diff))
}

function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  )
}

function hasEventOnDay(
  day: Date,
  events: { fecha_inicio?: string | null }[]
): boolean {
  if (!events?.length) return false
  return events.some((e) => {
    if (!e.fecha_inicio) return false
    const eventDate = new Date(e.fecha_inicio)
    return isSameDay(day, eventDate)
  })
}

interface MiniCalendarProps {
  events?: { fecha_inicio?: string | null }[]
}

export function MiniCalendar({ events = [] }: MiniCalendarProps) {
  const today = new Date()
  const [monday, setMonday] = useState(() => getMondayOfWeek(today))
  const weekDays = getWeekDays(monday)

  const goPrevWeek = () => {
    const prev = new Date(monday)
    prev.setDate(prev.getDate() - 7)
    setMonday(prev)
  }

  const goNextWeek = () => {
    const next = new Date(monday)
    next.setDate(next.getDate() + 7)
    setMonday(next)
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-black">Calendario</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrevWeek}
            className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 transition-colors"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={goNextWeek}
            className="p-1.5 rounded hover:bg-zinc-100 text-zinc-500 transition-colors"
            aria-label="Semana siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {weekDays.map((day, i) => {
          const isCurrentDay = isSameDay(day, today)
          const hasEvents = hasEventOnDay(day, events)
          const dayAbbrev = DAYS_ABBREV[i]
          const dateNum = day.getDate()

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'flex flex-col items-center justify-center py-3 px-2 rounded-xl border min-h-[72px] transition-colors',
                isCurrentDay
                  ? 'bg-amber-400 border-amber-400 text-black font-semibold'
                  : 'bg-white border-zinc-200 text-zinc-500'
              )}
            >
              <span className="text-xs font-medium">{dayAbbrev}</span>
              <span className="text-lg font-medium mt-0.5">{dateNum}</span>
              {hasEvents && (
                <span
                  className={cn(
                    'mt-1 text-xs',
                    isCurrentDay ? 'text-black' : 'text-zinc-400'
                  )}
                >
                  ···
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
