import type { CmsAnalyticsRow } from '@/lib/cms/types'
import { DUMMY_ADMIN_BENEFITS } from '@/lib/admin-miembros/beneficios-dummy'
import {
  DUMMY_ADMIN_COFFEES,
  DUMMY_ADMIN_MEMBERS,
  DUMMY_ADMIN_PAIRINGS,
} from '@/lib/admin-miembros/coffee-dummy'

export type AnalyticsPeriod = 'month' | 'quarter'

const EVENT_COUNTS: Record<string, number> = {
  'dummy-camila': 1,
  'dummy-diego': 2,
  'dummy-valentina': 2,
  'dummy-andres': 1,
  'dummy-laura': 2,
  'dummy-mateo': 1,
  'dummy-sofia': 2,
}

export const DUMMY_ANALYTICS_ROWS: CmsAnalyticsRow[] = DUMMY_ADMIN_MEMBERS.map((member) => ({
  member,
  pairings: DUMMY_ADMIN_PAIRINGS.filter(
    (pairing) =>
      pairing.status === 'confirmed' &&
      (pairing.requester_id === member.id || pairing.target_id === member.id)
  ).length,
  coffees: DUMMY_ADMIN_COFFEES.filter((coffee) =>
    coffee.seats.some((seat) => seat.member_id === member.id)
  ).length,
  events: EVENT_COUNTS[member.id] || 0,
}))

export const DUMMY_REDEMPTIONS = DUMMY_ADMIN_BENEFITS.reduce((sum, benefit) => sum + benefit.claims, 0)

export const ATTENDANCE_SERIES: Record<AnalyticsPeriod, { labels: string[]; values: number[]; max: number }> = {
  month: { labels: ['S1', 'S2', 'S3', 'S4'], values: [8, 14, 9, 18], max: 20 },
  quarter: { labels: ['Jun', 'Jul', 'Ago'], values: [22, 31, 18], max: 40 },
}

export const REDEMPTION_SERIES: Record<AnalyticsPeriod, { labels: string[]; values: number[] }> = {
  month: { labels: ['S1', 'S2', 'S3', 'S4', 'S5'], values: [42, 68, 31, 89, 54] },
  quarter: { labels: ['Jun', 'Jul', 'Ago', 'Sep', 'Oct'], values: [48, 72, 36, 96, 58] },
}

export const SENTIMENT = [
  { id: 'positive', label: 'Positivo', value: 65, bar: 'bg-members-success', icon: 'text-members-success bg-members-success/10' },
  { id: 'neutral', label: 'Neutral', value: 25, bar: 'bg-members-pending', icon: 'text-members-pending bg-members-pending/10' },
  { id: 'negative', label: 'Negativo', value: 10, bar: 'bg-red-300', icon: 'text-red-300 bg-red-500/10' },
] as const

export function seriesPoints(values: number[], max: number) {
  return values
    .map((value, index) => {
      const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100
      const y = 95 - (value / max) * 85
      return `${x},${y}`
    })
    .join(' ')
}

export function seriesFill(values: number[], max: number) {
  const line = seriesPoints(values, max)
  return `${line} 100,100 0,100`
}
