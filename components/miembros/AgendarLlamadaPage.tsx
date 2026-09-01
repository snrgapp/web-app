'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { membersBasePath, membersHref } from '@/lib/miembros/nav'
import {
  firstBookableDate,
  formatLongDate,
  formatMonthTitle,
  formatShortDate,
  getSlotsForDate,
  isSameDay,
  startOfDay,
  toDateKey,
} from '@/lib/miembros/booking'

const WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

function buildMonthCells(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const prevDays = new Date(month.getFullYear(), month.getMonth(), 0).getDate()
  const leading = first.getDay()
  const cells: { date: Date; current: boolean }[] = []

  for (let i = leading; i > 0; i -= 1) {
    cells.push({
      date: new Date(month.getFullYear(), month.getMonth() - 1, prevDays - i + 1),
      current: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      date: new Date(month.getFullYear(), month.getMonth(), day),
      current: true,
    })
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      current: false,
    })
  }

  return cells
}

export function AgendarLlamadaPage() {
  const pathname = usePathname()
  const basePath = membersBasePath(pathname)
  const today = startOfDay(new Date())
  const initialDate = firstBookableDate(today)
  const initialSlots = getSlotsForDate(initialDate)

  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  )
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [selectedSlot, setSelectedSlot] = useState(
    initialSlots.find((slot) => !slot.booked)?.id ?? null
  )
  const [confirmed, setConfirmed] = useState(false)

  const cells = useMemo(() => buildMonthCells(visibleMonth), [visibleMonth])
  const slots = useMemo(() => getSlotsForDate(selectedDate), [selectedDate])
  const selectedSlotLabel = slots.find((slot) => slot.id === selectedSlot)?.label

  function selectDate(date: Date) {
    if (startOfDay(date) < today) return
    const nextSlots = getSlotsForDate(date)
    if (!nextSlots.some((slot) => !slot.booked)) return
    setSelectedDate(date)
    setSelectedSlot(nextSlots.find((slot) => !slot.booked)?.id ?? null)
    setConfirmed(false)
  }

  function goMonth(delta: number) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-5 sm:px-6 md:px-10 md:py-7">
      <Link
        href={membersHref('/upgrade', basePath)}
        className="mb-4 inline-flex items-center gap-1.5 text-xs text-members-on-surface-variant transition-colors hover:text-members-on-surface"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a planes
      </Link>

      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-members-outline-variant bg-members-surface-container px-3 py-1">
          <div className="h-2 w-2 rounded-full bg-members-primary-container" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-members-primary">
            Marcas Aliadas
          </span>
        </div>
        <h1 className="beneficios-title text-members-on-surface md:hidden">Reserva tu sesión</h1>
        <h1 className="beneficios-title hidden text-members-on-surface md:block">
          Reserva tu sesión estratégica
        </h1>
        <p className="beneficios-subtitle mt-1.5 max-w-2xl text-members-on-surface-variant">
          Elige fecha y hora para explorar oportunidades de alianza y alinear objetivos del próximo
          trimestre.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="h-fit rounded-xl border border-members-border bg-members-surface p-4 lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-sm font-semibold text-members-on-surface">
              {formatMonthTitle(visibleMonth)}
            </h1>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => goMonth(-1)}
                className="rounded-lg border border-members-border p-1.5 text-members-on-surface-variant transition-colors hover:border-[#333333] hover:bg-[#1A1A1A] hover:text-members-on-surface"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goMonth(1)}
                className="rounded-lg border border-members-border p-1.5 text-members-on-surface-variant transition-colors hover:border-[#333333] hover:bg-[#1A1A1A] hover:text-members-on-surface"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-7 gap-1 border-b border-members-border pb-3 text-center text-[10px] font-semibold uppercase tracking-wider text-members-on-surface-variant">
            {WEEKDAYS.map((day, index) => (
              <div key={`${day}-${index}`}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {cells.map(({ date, current }) => {
              const past = startOfDay(date) < today
              const selected = isSameDay(date, selectedDate)
              const daySlots = getSlotsForDate(date)
              const available = !past && daySlots.some((slot) => !slot.booked)

              return (
                <button
                  key={toDateKey(date)}
                  type="button"
                  disabled={!available}
                  onClick={() => selectDate(date)}
                  className={cn(
                    'relative rounded-full p-2 transition-colors',
                    !current || past
                      ? 'text-members-surface-variant'
                      : 'text-members-on-surface hover:bg-[#1A1A1A]',
                    selected &&
                      'bg-members-primary-container font-semibold text-white ring-2 ring-members-primary-container ring-offset-2 ring-offset-members-surface hover:bg-members-primary-container',
                    !available && 'cursor-not-allowed'
                  )}
                >
                  {date.getDate()}
                  {selected ? (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </section>

        <div className="flex flex-col gap-4 lg:col-span-7">
          <section className="rounded-xl border border-members-border bg-members-surface p-4">
            <h1 className="text-sm font-semibold text-members-on-surface">Horarios disponibles</h1>
            <p className="mb-4 mt-0.5 text-xs capitalize text-members-on-surface-variant">
              {formatLongDate(selectedDate)}
            </p>
            {slots.length === 0 ? (
              <p className="text-xs text-members-on-surface-variant">
                No hay horarios este día. Elige un día hábil.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {slots.map((slot) => {
                  const selected = slot.id === selectedSlot
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={slot.booked}
                      onClick={() => {
                        setSelectedSlot(slot.id)
                        setConfirmed(false)
                      }}
                      className={cn(
                        'flex flex-col items-center rounded-lg border px-3 py-2.5 text-xs transition-all',
                        slot.booked &&
                          'cursor-not-allowed border-members-border text-members-on-surface-variant opacity-50',
                        !slot.booked &&
                          !selected &&
                          'border-members-border text-members-on-surface hover:border-members-primary hover:bg-[#1A1A1A]',
                        selected &&
                          'border-2 border-members-primary bg-[#1A1A1A] font-semibold text-members-primary shadow-[0_0_15px_rgba(79,70,229,0.15)]'
                      )}
                    >
                      <span className={slot.booked ? 'line-through' : undefined}>{slot.label}</span>
                      <span className="mt-0.5 text-[10px]">
                        {slot.booked ? 'Reservado' : selected ? 'Seleccionado' : 'Seleccionar'}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          <section className="relative overflow-hidden rounded-xl border border-members-border bg-[#121212] p-4">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-1/4 -translate-y-1/2 rounded-full bg-members-primary-container/10 blur-3xl" />
            <div className="relative z-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="mb-1.5 flex items-center gap-2">
                  <Video className="h-4 w-4 fill-members-primary text-members-primary" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-members-on-surface-variant">
                    Videollamada
                  </span>
                </div>
                <h1 className="mb-1.5 text-sm font-semibold text-members-on-surface">
                  Explora oportunidades de alianza con Synergy
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-members-on-surface-variant">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    45 min
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatShortDate(selectedDate)}
                    {selectedSlotLabel ? `, ${selectedSlotLabel}` : ''}
                  </span>
                </div>
              </div>
              {confirmed ? (
                <div className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-members-success px-5 py-2.5 text-xs font-semibold text-white md:w-auto">
                  <Check className="h-3.5 w-3.5" />
                  Reserva confirmada
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setConfirmed(true)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-members-primary-container px-5 py-2.5 text-xs font-semibold text-white transition-all hover:brightness-110 hover:shadow-[0_4px_20px_rgba(79,70,229,0.3)] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                >
                  Confirmar reserva
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
