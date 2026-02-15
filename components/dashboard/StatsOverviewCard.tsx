'use client'

import { Users, UserCheck, Monitor } from 'lucide-react'

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

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2 border-b border-zinc-100 px-4 py-4 last:border-b-0 md:border-b-0 md:border-l md:border-zinc-100 md:pl-5 [&:first-child]:md:border-l-0 [&:first-child]:md:pl-4">
      {/* Fila: icono + contenido */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <Icon className="h-4 w-4 text-emerald-600" strokeWidth={1.5} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-xs font-normal text-zinc-500 truncate">{label}</span>
          <p className="text-base font-bold text-zinc-900 leading-tight">{value}</p>
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-[11px] font-medium ${
                isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {isPositive ? (
                <svg
                  className="h-3 w-3 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg
                  className="h-3 w-3 shrink-0"
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
        </div>
      </div>
      {/* Burbujas de perfil: solo en Activos Ahora, debajo del bloque */}
      {showAvatars && (
        <div className="flex -space-x-2 pl-[48px]">
          {AVATAR_PLACEHOLDERS.map((a, i) => (
            <div
              key={i}
              className={`h-5 w-5 rounded-full ${a.bg} flex items-center justify-center text-[9px] font-medium text-zinc-700 ring-2 ring-white flex-shrink-0`}
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
    <div className="flex w-full flex-col rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {/* Mobile: 3 filas apiladas | Desktop: 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3">
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
