'use client'

import { useEffect, useState } from 'react'
import { Calendar, Handshake, Minus, TrendingUp, Users } from 'lucide-react'
import {
  ANALYTICS_KPIS,
  ANALYTICS_RANGES,
  ENGAGEMENT_MIX,
  GROWTH_CHART,
  type AnalyticsRange,
} from '@/lib/miembros/analytics'

const KPI_ICONS = {
  handshake: Handshake,
  event: Calendar,
  groups: Users,
}

const KPI_ICON_COLOR = {
  handshake: 'text-members-primary',
  event: 'text-members-secondary',
  groups: 'text-members-tertiary',
}

export function AnaliticaPage() {
  const [range, setRange] = useState<AnalyticsRange>('1M')
  const [kpis, setKpis] = useState(ANALYTICS_KPIS)
  const chart = GROWTH_CHART[range]

  useEffect(() => {
    fetch('/api/miembros/cms/analytics')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!payload) return
        setKpis((current) =>
          current.map((kpi) => {
            if (kpi.id === 'conexiones') return { ...kpi, value: String(payload.pairings ?? kpi.value) }
            if (kpi.id === 'eventos') return { ...kpi, value: String(payload.events ?? kpi.value) }
            if (kpi.id === 'cafes') return { ...kpi, value: String(payload.coffees ?? kpi.value) }
            return kpi
          })
        )
      })
      .catch(() => undefined)
  }, [])

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-6 sm:px-6 md:px-10 md:pb-10 md:pt-10">
      <div className="mb-8">
        <h1 className="coffee-title mb-2 text-members-on-surface">Analítica de desempeño</h1>
        <p className="beneficios-subtitle max-w-2xl text-members-on-surface-variant">
          Sigue el crecimiento de tu red y la participación en la comunidad.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {kpis.map((kpi) => {
          const Icon = KPI_ICONS[kpi.icon]
          const up = kpi.trend === 'up'
          return (
            <article
              key={kpi.id}
              className="flex min-h-[160px] flex-col justify-between rounded-2xl border border-[#262626] bg-[#121212] p-6 transition-colors hover:border-[#333333] hover:bg-[#1A1A1A] md:col-span-4"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-lg bg-[#1A1A1A] p-2 ${KPI_ICON_COLOR[kpi.icon]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`flex items-center gap-1 text-[10px] font-semibold tracking-wider ${
                    up ? 'text-members-success' : 'text-members-on-surface-variant'
                  }`}
                >
                  {kpi.delta}
                  {up ? <TrendingUp className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                </span>
              </div>
              <div>
                <p className="mb-1 text-sm text-members-on-surface-variant">{kpi.label}</p>
                <h1 className="analytics-kpi text-members-on-surface">{kpi.value}</h1>
              </div>
            </article>
          )
        })}

        <article className="flex min-h-[360px] flex-col rounded-2xl border border-[#262626] bg-[#121212] p-6 transition-colors hover:border-[#333333] hover:bg-[#1A1A1A] md:col-span-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h1 className="text-base font-semibold text-members-on-surface">
              Trayectoria de crecimiento
            </h1>
            <div className="flex gap-2">
              {ANALYTICS_RANGES.map((item) => {
                const active = item.id === range
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRange(item.id)}
                    className={
                      active
                        ? 'rounded border border-members-primary bg-members-primary/20 px-3 py-1 text-xs text-members-primary'
                        : 'rounded border border-members-outline-variant bg-[#1A1A1A] px-3 py-1 text-xs text-members-on-surface transition-colors hover:border-[#333333]'
                    }
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative mt-2 flex flex-1 items-end justify-between border-b border-l border-[#333333] px-4 pb-2">
            <div className="absolute bottom-0 left-[-28px] top-0 flex flex-col justify-between text-[10px] text-members-outline">
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
              <div className="w-full border-t border-members-outline-variant/20" />
              <div className="w-full border-t border-members-outline-variant/20" />
              <div className="w-full border-t border-members-outline-variant/20" />
              <div className="w-full border-t border-transparent" />
            </div>
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="analyticsGrowth" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#c3c0ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#c3c0ff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={chart.fill} fill="url(#analyticsGrowth)" />
              <path
                d={chart.path}
                fill="none"
                stroke="#c3c0ff"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
            </svg>
            <div className="absolute bottom-[-22px] left-0 right-0 flex justify-between px-4 text-[10px] text-members-outline">
              {chart.labels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="flex min-h-[360px] flex-col rounded-2xl border border-[#262626] bg-[#121212] p-6 transition-colors hover:border-[#333333] hover:bg-[#1A1A1A] md:col-span-4">
          <h1 className="mb-6 text-base font-semibold text-members-on-surface">
            Mix de participación
          </h1>
          <div className="flex flex-1 items-end justify-around gap-2 pt-8">
            {ENGAGEMENT_MIX.map((bar) => (
              <div
                key={bar.id}
                className={`group relative w-10 cursor-pointer rounded-t-lg transition-all duration-300 ${bar.color}`}
                style={{ height: `${bar.value}%` }}
              >
                <div className="absolute bottom-full mb-3 w-full text-center text-[10px] font-semibold text-members-on-surface opacity-0 transition-opacity group-hover:opacity-100">
                  {bar.value}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-around border-t border-members-outline-variant/30 pt-4 text-[10px] font-semibold tracking-wider text-members-on-surface-variant">
            {ENGAGEMENT_MIX.map((bar) => (
              <span key={bar.id}>{bar.label}</span>
            ))}
          </div>
        </article>
      </div>
    </div>
  )
}
