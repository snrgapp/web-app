'use client'

import { Users, UserCheck, Monitor } from 'lucide-react'

// Datos visuales de momento - luego se conectarán a la lógica
const STATS = {
  totalAsistentes: { value: '5,423', trend: 16, label: 'Total Asistentes', icon: Users },
  miembros: { value: '1,893', trend: -1, label: 'Miembros', icon: UserCheck },
  activosAhora: { value: '189', label: 'Activos Ahora', icon: Monitor },
}

const AVATAR_PLACEHOLDERS = [
  { bg: 'bg-emerald-200', initial: 'A' },
  { bg: 'bg-sky-200', initial: 'B' },
  { bg: 'bg-amber-200', initial: 'C' },
  { bg: 'bg-rose-200', initial: 'D' },
  { bg: 'bg-violet-200', initial: 'E' },
]

function StatSection({
  label,
  value,
  trend,
  Icon,
  showAvatars,
}: {
  label: string
  value: string
  trend?: number
  Icon: typeof Users
  showAvatars?: boolean
}) {
  const isPositive = trend !== undefined && trend >= 0
  const isNegative = trend !== undefined && trend < 0

  return (
    <div className="flex flex-1 flex-col gap-3 px-5 py-5 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-zinc-100 [&:not(:first-child)]:pl-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <Icon className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
        </div>
        <span className="text-sm font-normal text-zinc-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      {trend !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}
        >
          {isPositive ? (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
          <span>{isPositive ? '+' : ''}{trend}% this month</span>
        </div>
      )}
      {showAvatars && (
        <div className="flex -space-x-2">
          {AVATAR_PLACEHOLDERS.map((a, i) => (
            <div
              key={i}
              className={`h-8 w-8 rounded-full ${a.bg} flex items-center justify-center text-xs font-medium text-zinc-700 ring-2 ring-white`}
            >
              {a.initial}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function StatsOverviewCard() {
  return (
    <div className="flex h-full min-h-[200px] w-full flex-col rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-1 min-h-0 gap-1">
        <StatSection
          label={STATS.totalAsistentes.label}
          value={STATS.totalAsistentes.value}
          trend={STATS.totalAsistentes.trend}
          Icon={STATS.totalAsistentes.icon}
        />
        <StatSection
          label={STATS.miembros.label}
          value={STATS.miembros.value}
          trend={STATS.miembros.trend}
          Icon={STATS.miembros.icon}
        />
        <StatSection
          label={STATS.activosAhora.label}
          value={STATS.activosAhora.value}
          Icon={STATS.activosAhora.icon}
          showAvatars
        />
      </div>
    </div>
  )
}
