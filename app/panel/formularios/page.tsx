'use client'

import { useEffect, useState } from 'react'
import {
  agregarCampoForm,
  borrarCampoForm,
  listarCamposForm,
  listarEventosPlat,
  type EventoPlat,
  type FormCampo,
} from '@/app/actions/eventos-platform'

export default function FormulariosPage() {
  const [eventos, setEventos] = useState<EventoPlat[]>([])
  const [eventoId, setEventoId] = useState('')
  const [campos, setCampos] = useState<FormCampo[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    listarEventosPlat().then((ev) => {
      setEventos(ev)
      if (ev[0]) {
        setEventoId(ev[0].id)
        listarCamposForm(ev[0].id).then(setCampos)
      }
    })
  }, [])

  async function pick(id: string) {
    setEventoId(id)
    setCampos(await listarCamposForm(id))
  }

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!eventoId) return
    const fd = new FormData(e.currentTarget)
    setError('')
    const result = await agregarCampoForm({
      evento_id: eventoId,
      label: String(fd.get('label') || ''),
      tipo: String(fd.get('tipo') || 'texto'),
      obligatorio: fd.get('obligatorio') === 'on',
    })
    if (!result.ok) {
      setError(result.error)
      return
    }
    e.currentTarget.reset()
    setCampos(await listarCamposForm(eventoId))
  }

  return (
    <div className="ep-page max-w-4xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--ep-muted)]">Constructor de formularios</p>
        <h1 className="ep-title mt-1">Registro</h1>
      </div>

      <select className="ep-select" value={eventoId} onChange={(e) => pick(e.target.value)}>
        {eventos.map((ev) => (
          <option key={ev.id} value={ev.id}>
            {ev.titulo}
          </option>
        ))}
      </select>

      <form onSubmit={add} className="ep-card p-5 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <label className="text-sm space-y-1 sm:col-span-2">
          <span>Campo</span>
          <input name="label" required className="ep-input" placeholder="Cargo" />
        </label>
        <label className="text-sm space-y-1">
          <span>Tipo</span>
          <select name="tipo" className="ep-select">
            <option value="texto">Texto</option>
            <option value="email">Email</option>
            <option value="telefono">Teléfono</option>
            <option value="select">Lista</option>
          </select>
        </label>
        <label className="text-sm flex items-center gap-2 pb-2">
          <input type="checkbox" name="obligatorio" />
          Obligatorio
        </label>
        <button type="submit" className="ep-btn ep-btn-primary sm:col-span-4">
          Agregar campo
        </button>
        {error && <p className="text-sm text-[#ba1a1a] sm:col-span-4">{error}</p>}
      </form>

      <div className="space-y-2">
        {campos.map((c) => (
          <div key={c.id} className="ep-card px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-medium">{c.label}</p>
              <p className="text-xs text-[var(--ep-muted)]">
                {c.tipo}
                {c.obligatorio ? ' · obligatorio' : ''}
              </p>
            </div>
            <button
              type="button"
              className="text-sm text-[#ba1a1a]"
              onClick={async () => {
                await borrarCampoForm(c.id)
                setCampos(await listarCamposForm(eventoId))
              }}
            >
              Quitar
            </button>
          </div>
        ))}
        {eventoId && campos.length === 0 && (
          <p className="text-sm text-[var(--ep-muted)]">Este evento aún no tiene campos extra. Nombre y celular ya se piden en check-in.</p>
        )}
      </div>
    </div>
  )
}
