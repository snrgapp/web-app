'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  listarAsistentesPlat,
  listarEventosPlat,
  toggleCheckin,
  type AsistentePlat,
  type EventoPlat,
} from '@/app/actions/eventos-platform'

export default function AsistentesPage() {
  const [eventos, setEventos] = useState<EventoPlat[]>([])
  const [rows, setRows] = useState<AsistentePlat[]>([])
  const [eventoId, setEventoId] = useState('')
  const [q, setQ] = useState('')

  async function load(id?: string) {
    const [ev, as] = await Promise.all([listarEventosPlat(), listarAsistentesPlat(id || null)])
    setEventos(ev)
    setRows(as)
  }

  useEffect(() => {
    load()
  }, [])

  const visibles = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return rows
    return rows.filter((a) =>
      [a.nombre, a.apellido, a.empresa, a.correo, a.telefono].filter(Boolean).join(' ').toLowerCase().includes(s)
    )
  }, [rows, q])

  return (
    <div className="ep-page space-y-5">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--ep-muted)]">Aforo en vivo</p>
        <h1 className="ep-title mt-1">Asistentes</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="ep-input"
          placeholder="Buscar nombre, empresa o correo…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="ep-select sm:w-64"
          value={eventoId}
          onChange={(e) => {
            setEventoId(e.target.value)
            load(e.target.value)
          }}
        >
          <option value="">Todos los eventos</option>
          {eventos.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.titulo}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3 md:hidden">
        {visibles.map((a) => (
          <div key={a.id} className="ep-card p-4 space-y-2">
            <p className="font-semibold">{[a.nombre, a.apellido].filter(Boolean).join(' ') || '—'}</p>
            <p className="text-sm">{a.empresa || '—'}</p>
            <p className="text-xs text-[var(--ep-muted)] break-all">
              {a.telefono}
              {a.correo ? ` · ${a.correo}` : ''}
            </p>
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-xs">{a.estado_pago}</span>
              <button
                type="button"
                className={a.checked_in_at ? 'ep-btn ep-btn-ghost text-xs' : 'ep-btn ep-btn-primary text-xs'}
                onClick={async () => {
                  await toggleCheckin(a.id)
                  load(eventoId)
                }}
              >
                {a.checked_in_at ? 'Quitar' : 'Check-in'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="ep-card overflow-x-auto hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--ep-muted)] border-b border-[var(--ep-line)]">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Pago</th>
              <th className="px-4 py-3 font-medium">Check-in</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((a) => (
              <tr key={a.id} className="border-b border-[var(--ep-line)] last:border-0">
                <td className="px-4 py-3 font-medium">
                  {[a.nombre, a.apellido].filter(Boolean).join(' ') || '—'}
                </td>
                <td className="px-4 py-3">{a.empresa || '—'}</td>
                <td className="px-4 py-3 text-[var(--ep-muted)]">
                  {a.telefono}
                  {a.correo ? <span className="block">{a.correo}</span> : null}
                </td>
                <td className="px-4 py-3">{a.estado_pago}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className={a.checked_in_at ? 'ep-btn ep-btn-ghost text-xs' : 'ep-btn ep-btn-primary text-xs'}
                    onClick={async () => {
                      await toggleCheckin(a.id)
                      load(eventoId)
                    }}
                  >
                    {a.checked_in_at ? 'Quitar' : 'Check-in'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibles.length === 0 && (
        <p className="px-4 py-8 text-sm text-[var(--ep-muted)]">No hay asistentes con ese filtro.</p>
      )}
    </div>
  )
}
