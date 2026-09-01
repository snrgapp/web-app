export type BookingSlot = {
  id: string
  label: string
  booked: boolean
}

const WEEKDAY_SLOTS = ['9:00 AM', '10:30 AM', '1:00 PM', '2:00 PM', '3:30 PM', '4:30 PM']

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isSameDay(a: Date, b: Date) {
  return toDateKey(a) === toDateKey(b)
}

export function isWeekend(date: Date) {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function getSlotsForDate(date: Date): BookingSlot[] {
  if (isWeekend(date)) return []

  const seed = date.getDate() + date.getMonth() * 3
  const bookedIndex = seed % WEEKDAY_SLOTS.length

  return WEEKDAY_SLOTS.map((label, index) => ({
    id: `${toDateKey(date)}-${label}`,
    label,
    booked: index === bookedIndex,
  }))
}

export function firstBookableDate(from = new Date()) {
  const cursor = startOfDay(from)
  for (let i = 0; i < 21; i += 1) {
    const day = new Date(cursor)
    day.setDate(cursor.getDate() + i)
    const slots = getSlotsForDate(day)
    if (slots.some((slot) => !slot.booked)) return day
  }
  return cursor
}

export function formatLongDate(date: Date) {
  return date.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
  })
}

export function formatMonthTitle(date: Date) {
  const label = date.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}
