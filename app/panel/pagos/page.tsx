'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  actualizarEstadoPago,
  listarPagosPlat,
  type PagoPlat,
} from '@/app/actions/eventos-platform'

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'aprobado', label: 'Completados / Aprobados' },
  { id: 'comprobante', label: 'Comprobante recibido' },
  { id: 'pendiente', label: 'En proceso' },
  { id: 'rechazado', label: 'Rechazados' },
]

function money(n: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
}

function badge(estado: string) {
  if (estado === 'aprobado') return 'bg-[#6ffbbe] text-[#005236]'
  if (estado === 'comprobante') return 'bg-[var(--ep-accent-soft)] text-[var(--ep-accent)]'
  if (estado === 'rechazado') return 'bg-[#ffdad6] text-[#93000a]'
  return 'bg-[#eeedf7] text-[var(--ep-muted)]'
}

export default function PagosPage() {
  const [pagos, setPagos] = useState<PagoPlat[]>([])
  const [filtro, setFiltro] = useState('todos')

  async function load() {
    setPagos(await listarPagosPlat())
  }

  useEffect(() => {
    load()
  }, [])

  const visibles = useMemo(
    () => (filtro === 'todos' ? pagos : pagos.filter((p) => p.estado === filtro)),
    [pagos, filtro]
  )

  const recaudado = pagos.filter((p) => p.estado === 'aprobado').reduce((s, p) => s + p.monto_cop, 0)
  const exitosos = pagos.filter((p) => p.estado === 'aprobado').length
  const enProceso = pagos.filter((p) => p.estado === 'pendiente' || p.estado === 'comprobante')
  const enProcesoMonto = enProceso.reduce((s, p) => s + p.monto_cop, 0)

  return (
    <div className="ep-page space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-[var(--ep-muted)]">Tesorería y conciliación</p>
          <h1 className="ep-title mt-1">Gestión de pagos</h1>
          <p className="text-sm text-[var(--ep-muted)] mt-1">
            Los asistentes pagan por WhatsApp y mandan comprobante. Aquí se concilia contra el correo
            donde llegó el aviso. La automatización se conecta después.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="ep-card p-4">
          <p className="text-xs text-[var(--ep-muted)]">Total recaudado (aprobados)</p>
          <p className="text-2xl font-semibold mt-1">{money(recaudado)}</p>
        </div>
        <div className="ep-card p-4">
          <p className="text-xs text-[var(--ep-muted)]">Transacciones exitosas</p>
          <p className="text-2xl font-semibold mt-1">{exitosos}</p>
          <p className="text-xs text-[var(--ep-muted)]">pagos completados</p>
        </div>
        <div className="ep-card p-4">
          <p className="text-xs text-[var(--ep-muted)]">En proceso de acreditación</p>
          <p className="text-2xl font-semibold mt-1">{money(enProcesoMonto)}</p>
          <p className="text-xs text-[var(--ep-muted)]">{enProceso.length} comprobantes o pendientes</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id)}
            className={filtro === f.id ? 'ep-btn ep-btn-primary text-xs' : 'ep-btn ep-btn-ghost text-xs'}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-3 lg:hidden">
        {visibles.map((p) => (
          <div key={p.id} className="ep-card p-4 space-y-2">
            <div className="flex justify-between gap-2">
              <p className="font-semibold">{p.pagador || '—'}</p>
              <span className="font-mono text-xs text-[var(--ep-muted)]">#{p.id.slice(0, 8)}</span>
            </div>
            <p className="text-xs text-[var(--ep-muted)] break-all">{p.correo || '—'}</p>
            <p className="text-sm">{p.evento_titulo || '—'}</p>
            <p className="font-semibold">{money(p.monto_cop)}</p>
            <p className="text-xs">Aviso: {p.correo_origen_pago || '—'}</p>
            {p.comprobante_url && (
              <a href={p.comprobante_url} className="text-sm text-[var(--ep-accent)]" target="_blank" rel="noreferrer">
                Ver comprobante
              </a>
            )}
            <select
              className={`rounded-full px-2 py-1 text-xs font-semibold border-0 ${badge(p.estado)}`}
              value={p.estado}
              onChange={async (e) => {
                await actualizarEstadoPago(p.id, e.target.value)
                load()
              }}
            >
              <option value="pendiente">Pendiente</option>
              <option value="comprobante">Comprobante</option>
              <option value="aprobado">Aprobado</option>
              <option value="rechazado">Rechazado</option>
            </select>
          </div>
        ))}
      </div>

      <div className="ep-card overflow-x-auto hidden lg:block">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-[var(--ep-muted)] border-b border-[var(--ep-line)]">
              <th className="px-4 py-3 font-medium">Transacción</th>
              <th className="px-4 py-3 font-medium">Pagador y correo</th>
              <th className="px-4 py-3 font-medium">Evento</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Correo del aviso</th>
              <th className="px-4 py-3 font-medium">Comprobante</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr key={p.id} className="border-b border-[var(--ep-line)] last:border-0">
                <td className="px-4 py-3 font-mono text-xs">#{p.id.slice(0, 8)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{p.pagador || '—'}</p>
                  <p className="text-xs text-[var(--ep-muted)]">{p.correo || '—'}</p>
                </td>
                <td className="px-4 py-3">{p.evento_titulo || '—'}</td>
                <td className="px-4 py-3 font-semibold">{money(p.monto_cop)}</td>
                <td className="px-4 py-3 text-xs">{p.correo_origen_pago || '—'}</td>
                <td className="px-4 py-3">
                  {p.comprobante_url ? (
                    <a href={p.comprobante_url} target="_blank" rel="noreferrer" className="text-[var(--ep-accent)]">
                      Ver
                    </a>
                  ) : (
                    <span className="text-[var(--ep-muted)]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <select
                    className={`rounded-full px-2 py-1 text-xs font-semibold border-0 ${badge(p.estado)}`}
                    value={p.estado}
                    onChange={async (e) => {
                      await actualizarEstadoPago(p.id, e.target.value)
                      load()
                    }}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="comprobante">Comprobante</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibles.length === 0 && (
          <p className="px-5 py-10 text-sm text-[var(--ep-muted)] text-center">
            Todavía no hay transacciones. Cuando la automatización lea comprobantes de WhatsApp y el
            correo del pago, aparecerán aquí para conciliar.
          </p>
        )}
      </div>
    </div>
  )
}
