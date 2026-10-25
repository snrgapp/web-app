'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Users, Wallet, ScanLine } from 'lucide-react'
import { resumenDashboard, type EventoPlat } from '@/app/actions/eventos-platform'

function money(n: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)
}

export default function PanelPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof resumenDashboard>> | null>(null)

  useEffect(() => {
    resumenDashboard().then(setData)
  }, [])

  const kpis = [
    { label: 'Eventos activos', value: data?.eventosActivos ?? '—', icon: Calendar },
    { label: 'Total asistentes', value: data?.totalAsistentes ?? '—', icon: Users },
    { label: 'Ingresos (precio × confirmados)', value: data ? money(data.ingresos) : '—', icon: Wallet },
    { label: 'Tasa de check-in', value: data ? `${data.checkinPct}%` : '—', icon: ScanLine },
  ]

  return (
    <div className="ep-page space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--ep-muted)]">Resumen de eventos</p>
        <h1 className="ep-title mt-1">Synergy · operación</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="ep-card p-4">
            <k.icon className="w-4 h-4 text-[var(--ep-accent)] mb-3" />
            <p className="text-xs text-[var(--ep-muted)]">{k.label}</p>
            <p className="text-2xl font-semibold mt-1">{k.value}</p>
          </div>
        ))}
      </div>

      <div className="ep-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--ep-line)] flex items-center justify-between">
          <h2 className="font-semibold">Todos los eventos</h2>
          <Link href="/panel/eventos" className="text-sm text-[var(--ep-accent)] font-medium">
            Crear / editar
          </Link>
        </div>
        <div className="divide-y divide-[var(--ep-line)]">
          {(data?.eventos ?? []).map((e: EventoPlat) => (
            <div key={e.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <div className="flex-1 min-w-0">
                <p className="font-semibold">{e.titulo || 'Sin título'}</p>
                <p className="text-xs text-[var(--ep-muted)]">
                  {e.fecha ?? 'Sin fecha'} · {e.ciudad || e.lugar || '—'} · {e.formato}
                </p>
              </div>
              <p className="text-sm">
                {e.asistentes}
                {e.capacidad ? ` / ${e.capacidad}` : ''} asistentes
              </p>
              <p className="text-sm text-[var(--ep-muted)]">{e.checkins} check-in</p>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--ep-accent-soft)] text-[var(--ep-accent)]">
                {e.estado}
              </span>
            </div>
          ))}
          {data && data.eventos.length === 0 && (
            <p className="px-5 py-8 text-sm text-[var(--ep-muted)]">Aún no hay eventos.</p>
          )}
        </div>
      </div>
    </div>
  )
}
