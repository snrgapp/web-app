'use client'

import { useEffect, useState } from 'react'
import { listarEventosPlat, type EventoPlat } from '@/app/actions/eventos-platform'

export default function AnaliticasPage() {
  const [eventos, setEventos] = useState<EventoPlat[]>([])

  useEffect(() => {
    listarEventosPlat().then(setEventos)
  }, [])

  return (
    <div className="ep-page space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--ep-muted)]">Métricas</p>
        <h1 className="ep-title mt-1">Analíticas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eventos.map((e) => {
          const pct = e.asistentes ? Math.round((e.checkins / e.asistentes) * 100) : 0
          const fill = e.capacidad ? Math.min(100, Math.round((e.asistentes / e.capacidad) * 100)) : 0
          return (
            <div key={e.id} className="ep-card p-5 space-y-3">
              <p className="font-semibold">{e.titulo}</p>
              <p className="text-xs text-[var(--ep-muted)]">{e.fecha} · {e.ciudad || '—'}</p>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Check-in</span>
                  <span>
                    {e.checkins}/{e.asistentes} ({pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#eeedf7]">
                  <div className="h-2 rounded-full bg-[var(--ep-accent)]" style={{ width: `${pct}%` }} />
                </div>
              </div>
              {e.capacidad ? (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Aforo</span>
                    <span>
                      {e.asistentes}/{e.capacidad} ({fill}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#eeedf7]">
                    <div className="h-2 rounded-full bg-[var(--ep-good)]" style={{ width: `${fill}%` }} />
                  </div>
                </div>
              ) : null}
              <p className="text-sm">
                Precio {e.precio_cop ? `$${e.precio_cop.toLocaleString('es-CO')}` : 'Gratis'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
