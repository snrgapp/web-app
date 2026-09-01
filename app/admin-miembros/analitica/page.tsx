'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { CalendarDays, Frown, Gift, Meh, Smile, Ticket, TrendingUp, Users } from 'lucide-react'
import {
  ATTENDANCE_SERIES,
  DUMMY_ANALYTICS_ROWS,
  DUMMY_REDEMPTIONS,
  REDEMPTION_SERIES,
  SENTIMENT,
  seriesFill,
  seriesPoints,
  type AnalyticsPeriod,
} from '@/lib/admin-miembros/analitica-dummy'
import type { CmsAnalyticsRow } from '@/lib/cms/types'

const PERIOD_LABEL: Record<AnalyticsPeriod, string> = {
  month: 'Este mes',
  quarter: 'Trimestre',
}

function monthRangeLabel() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const format = (date: Date) =>
    date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
  return `${format(start)} – ${format(end)}`
}

export default function AdminAnaliticaPage() {
  const [rows, setRows] = useState<CmsAnalyticsRow[]>(DUMMY_ANALYTICS_ROWS)
  const [period, setPeriod] = useState<AnalyticsPeriod>('month')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin-miembros/analytics')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { data?: CmsAnalyticsRow[] } | null) => {
        if (payload?.data?.length) setRows(payload.data)
        else setRows(DUMMY_ANALYTICS_ROWS)
      })
      .catch(() => {
        setRows(DUMMY_ANALYTICS_ROWS)
        setError(null)
      })
  }, [])

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, row) => ({
        members: acc.members + 1,
        pro: acc.pro + (row.member.plan === 'pro' ? 1 : 0),
        free: acc.free + (row.member.plan === 'free' ? 1 : 0),
        pairings: acc.pairings + row.pairings,
        coffees: acc.coffees + row.coffees,
        events: acc.events + row.events,
      }),
      { members: 0, pro: 0, free: 0, pairings: 0, coffees: 0, events: 0 }
    )
  }, [rows])

  const proPercent = totals.members ? Math.round((totals.pro / totals.members) * 100) : 0
  const attendance = ATTENDANCE_SERIES[period]
  const redemptions = REDEMPTION_SERIES[period]
  const barMax = Math.max(...redemptions.values, 1)
  const usingDummy = rows === DUMMY_ANALYTICS_ROWS || rows[0]?.member.id.startsWith('dummy-')

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
      <div className="mb-2 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="admin-display mb-2 text-members-on-surface">Analítica avanzada</h1>
          <p className="admin-editor-body text-members-on-surface-variant">
            Panorama de la comunidad. Se llena solo con 1:1, cafés, eventos y reclamos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(PERIOD_LABEL) as AnalyticsPeriod[]).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setPeriod(id)}
              className={
                period === id
                  ? 'admin-table-cell rounded-md border border-members-primary bg-members-surface-container-highest px-4 py-2 text-members-primary'
                  : 'admin-table-cell rounded-md border border-members-outline-variant bg-members-surface-container-high px-4 py-2 text-members-on-surface transition-colors hover:bg-members-surface-bright'
              }
            >
              {PERIOD_LABEL[id]}
            </button>
          ))}
          <button
            type="button"
            className="admin-table-cell flex items-center gap-2 rounded-md border border-members-outline-variant bg-members-surface-container-high px-4 py-2 text-members-on-surface"
          >
            <CalendarDays className="h-4 w-4" />
            {monthRangeLabel()}
          </button>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-members-outline-variant bg-members-surface-container-low px-3 py-2 text-sm text-members-on-surface-variant">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <KpiCard
          label="Miembros totales"
          value={totals.members.toLocaleString('es-CO')}
          hint="+12%"
          icon={<Users className="h-5 w-5 text-members-primary" />}
        />
        <KpiCard
          label="Suscripciones Pro"
          value={totals.pro.toLocaleString('es-CO')}
          hint={`${proPercent}% del total`}
          icon={<Ticket className="h-5 w-5 text-members-tertiary" />}
        />
        <KpiCard
          label="Beneficios reclamados"
          value={(usingDummy ? DUMMY_REDEMPTIONS : totals.pairings + totals.coffees).toLocaleString('es-CO')}
          hint="Este mes"
          icon={<Gift className="h-5 w-5 text-members-secondary" />}
          hintTone="muted"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="admin-glass flex min-h-[300px] flex-col rounded-xl p-6 lg:col-span-1">
          <h1 className="admin-label-caps mb-6 text-members-on-surface-variant">Distribución de planes</h1>
          <div className="relative flex flex-1 items-center justify-center">
            <div
              className="relative flex h-48 w-48 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#c3c0ff 0 ${proPercent}%, #35343e ${proPercent}% 100%)`,
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#1f1f28]">
                <span className="text-2xl font-bold text-members-on-surface">Pro</span>
                <span className="text-sm text-members-on-surface-variant">{proPercent}%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <Legend color="bg-members-primary" label={`Pro · ${totals.pro}`} />
            <Legend color="bg-members-surface-container-highest" label={`Free · ${totals.free}`} />
          </div>
        </section>

        <section className="admin-glass flex min-h-[300px] flex-col rounded-xl p-6 lg:col-span-2">
          <h1 className="admin-label-caps mb-6 text-members-on-surface-variant">Asistencia a encuentros</h1>
          <div className="relative flex flex-1 items-end border-b border-l border-members-outline-variant pb-6 pl-8">
            <svg className="absolute inset-0 h-full w-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon
                points={seriesFill(attendance.values, attendance.max)}
                className="fill-members-primary/10"
              />
              <polyline
                points={seriesPoints(attendance.values, attendance.max)}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-members-primary"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="absolute bottom-[-22px] left-8 right-0 flex justify-between px-2 text-xs text-members-on-surface-variant">
              {attendance.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <div className="absolute bottom-0 left-[-4px] top-0 flex flex-col justify-between py-2 text-xs text-members-on-surface-variant">
              <span>{attendance.max}</span>
              <span>{Math.round(attendance.max / 2)}</span>
              <span>0</span>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="admin-glass flex min-h-[300px] flex-col rounded-xl p-6">
          <h1 className="admin-label-caps mb-6 text-members-on-surface-variant">Reclamos de beneficios</h1>
          <div className="mt-4 flex flex-1 items-end justify-between gap-4 border-b border-members-outline-variant px-2 pb-2">
            {redemptions.values.map((value, index) => {
              const height = Math.max(8, Math.round((value / barMax) * 100))
              const current = index === redemptions.values.length - 2
              return (
                <div key={redemptions.labels[index]} className="group relative w-full">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-members-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100">
                    {value}
                  </span>
                  <div
                    className={
                      current
                        ? 'w-full rounded-t-sm bg-members-primary'
                        : 'w-full rounded-t-sm bg-members-surface-container-highest transition-colors hover:bg-members-primary/50'
                    }
                    style={{ height: `${height}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="mt-2 flex justify-between px-2 text-xs text-members-on-surface-variant">
            {redemptions.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </section>

        <section className="admin-glass flex min-h-[300px] flex-col rounded-xl p-6">
          <h1 className="admin-label-caps mb-6 text-members-on-surface-variant">Sentimiento de miembros</h1>
          <div className="flex flex-1 flex-col justify-center gap-6">
            {SENTIMENT.map((item) => {
              const Icon = item.id === 'positive' ? Smile : item.id === 'neutral' ? Meh : Frown
              return (
                <div key={item.id} className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full ${item.icon}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm font-medium text-members-on-surface">{item.label}</span>
                      <span className="text-sm text-members-on-surface-variant">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-members-surface-container-highest">
                      <div className={`h-full ${item.bar}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <section className="admin-glass overflow-hidden rounded-xl">
        <div className="border-b border-members-outline-variant px-6 py-4">
          <h1 className="admin-label-caps text-members-on-surface">Actividad por emprendedor</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-members-surface-variant bg-members-admin-surface-container">
                <th className="admin-label-caps px-6 py-3 text-members-on-surface-variant">Emprendedor</th>
                <th className="admin-label-caps px-6 py-3 text-members-on-surface-variant">Plan</th>
                <th className="admin-label-caps px-6 py-3 text-members-on-surface-variant">1:1</th>
                <th className="admin-label-caps px-6 py-3 text-members-on-surface-variant">Cafés</th>
                <th className="admin-label-caps px-6 py-3 text-members-on-surface-variant">Eventos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.member.id}
                  className="h-14 border-b border-members-surface-variant last:border-0 hover:bg-members-surface-container-high"
                >
                  <td className="px-6 py-2">
                    <div className="admin-table-cell font-medium text-members-on-surface">{row.member.nombre}</div>
                    <div className="text-xs text-members-on-surface-variant">{row.member.empresa}</div>
                  </td>
                  <td className="px-6 py-2">
                    <span
                      className={
                        row.member.plan === 'pro'
                          ? 'admin-label-caps rounded bg-members-primary/20 px-2 py-0.5 text-members-primary'
                          : 'admin-label-caps rounded bg-members-surface-variant px-2 py-0.5 text-members-on-surface-variant'
                      }
                    >
                      {row.member.plan === 'pro' ? 'Pro' : 'Free'}
                    </span>
                  </td>
                  <td className="admin-table-cell px-6 py-2 text-members-on-surface">{row.pairings}</td>
                  <td className="admin-table-cell px-6 py-2 text-members-on-surface">{row.coffees}</td>
                  <td className="admin-table-cell px-6 py-2 text-members-on-surface">{row.events}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function KpiCard({
  label,
  value,
  hint,
  icon,
  hintTone = 'up',
}: {
  label: string
  value: string
  hint: string
  icon: ReactNode
  hintTone?: 'up' | 'muted'
}) {
  return (
    <article className="admin-glass flex h-32 flex-col justify-between rounded-xl p-6 transition-colors hover:bg-members-surface-container-high">
      <div className="flex items-start justify-between">
        <span className="admin-label-caps text-members-on-surface-variant">{label}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-members-on-surface">{value}</span>
        <span
          className={
            hintTone === 'up'
              ? 'flex items-center text-sm text-members-success'
              : 'text-sm text-members-on-surface-variant'
          }
        >
          {hintTone === 'up' ? <TrendingUp className="mr-0.5 h-3.5 w-3.5" /> : null}
          {hint}
        </span>
      </div>
    </article>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-3 w-3 rounded-full ${color}`} />
      <span className="text-sm text-members-on-surface-variant">{label}</span>
    </div>
  )
}
