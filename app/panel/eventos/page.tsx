'use client'

import { useEffect, useState } from 'react'
import { crearEventoPlat, listarEventosPlat, type EventoPlat } from '@/app/actions/eventos-platform'

export default function EventosPage() {
  const [eventos, setEventos] = useState<EventoPlat[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setEventos(await listarEventosPlat())
  }

  useEffect(() => {
    load()
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setSaving(true)
    setError('')
    const cap = String(fd.get('capacidad') || '').trim()
    const result = await crearEventoPlat({
      titulo: String(fd.get('titulo') || ''),
      checkin_slug: String(fd.get('checkin_slug') || ''),
      fecha: String(fd.get('fecha') || ''),
      ciudad: String(fd.get('ciudad') || ''),
      formato: String(fd.get('formato') || 'presencial'),
      capacidad: cap ? Number(cap) : null,
      precio_cop: Number(fd.get('precio_cop') || 0),
      hora_inicio: String(fd.get('hora_inicio') || ''),
      hora_fin: String(fd.get('hora_fin') || ''),
      lugar: String(fd.get('lugar') || ''),
      acerca_del_evento: String(fd.get('acerca') || ''),
    })
    setSaving(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    e.currentTarget.reset()
    load()
  }

  return (
    <div className="ep-page space-y-6">
      <div>
        <p className="ep-kicker">Constructor</p>
        <h1 className="ep-title mt-1.5">Crear evento</h1>
        <p className="ep-sub">Nombre, fecha, aforo y precio. El pago, si lo hay, se cierra por WhatsApp.</p>
      </div>

      <form onSubmit={onSubmit} className="ep-card p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm space-y-1">
          <span>Nombre del evento</span>
          <input name="titulo" required className="ep-input" placeholder="Synergy Networking" />
        </label>
        <label className="text-sm space-y-1">
          <span>Slug de check-in</span>
          <input name="checkin_slug" required className="ep-input" placeholder="synergy-nov-12" />
        </label>
        <label className="text-sm space-y-1">
          <span>Fecha</span>
          <input name="fecha" type="date" className="ep-input" />
        </label>
        <label className="text-sm space-y-1">
          <span>Formato</span>
          <select name="formato" className="ep-select">
            <option value="presencial">Presencial</option>
            <option value="virtual">Virtual</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </label>
        <label className="text-sm space-y-1">
          <span>Ciudad</span>
          <input name="ciudad" className="ep-input" placeholder="Barranquilla" />
        </label>
        <label className="text-sm space-y-1">
          <span>Lugar</span>
          <input name="lugar" className="ep-input" placeholder="Bruma Coffee Lab" />
        </label>
        <label className="text-sm space-y-1">
          <span>Hora inicio</span>
          <input name="hora_inicio" type="time" className="ep-input" />
        </label>
        <label className="text-sm space-y-1">
          <span>Hora fin</span>
          <input name="hora_fin" type="time" className="ep-input" />
        </label>
        <label className="text-sm space-y-1">
          <span>Aforo</span>
          <input name="capacidad" type="number" min={0} className="ep-input" placeholder="40" />
        </label>
        <label className="text-sm space-y-1">
          <span>Precio COP (0 = gratis)</span>
          <input name="precio_cop" type="number" min={0} defaultValue={0} className="ep-input" />
        </label>
        <label className="text-sm space-y-1 md:col-span-2">
          <span>Acerca del evento</span>
          <textarea name="acerca" rows={3} className="ep-textarea" />
        </label>
        {error && <p className="text-sm text-[#ba1a1a] md:col-span-2">{error}</p>}
        <div className="md:col-span-2">
          <button type="submit" disabled={saving} className="ep-btn ep-btn-primary w-full sm:w-auto">
            {saving ? 'Guardando…' : 'Crear evento'}
          </button>
        </div>
      </form>

      <div className="ep-card overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--ep-line)] font-semibold">Eventos</div>
        <div className="divide-y divide-[var(--ep-line)]">
          {eventos.map((e) => (
            <div key={e.id} className="px-5 py-3 text-sm flex flex-wrap gap-x-6 gap-y-1">
              <span className="font-semibold">{e.titulo}</span>
              <span className="text-[var(--ep-muted)]">{e.fecha}</span>
              <span>{e.asistentes} asistentes</span>
              {e.checkin_slug && (
                <a
                  className="text-[var(--ep-accent)]"
                  href={`https://snrg.lat/checkin?event=${e.checkin_slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Check-in
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
