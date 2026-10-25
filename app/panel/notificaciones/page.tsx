'use client'

import { useEffect, useState } from 'react'
import {
  guardarMensaje,
  listarEventosPlat,
  listarMensajes,
  type EventoPlat,
  type MensajePlat,
} from '@/app/actions/eventos-platform'

export default function NotificacionesPage() {
  const [eventos, setEventos] = useState<EventoPlat[]>([])
  const [mensajes, setMensajes] = useState<MensajePlat[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    const [ev, msgs] = await Promise.all([listarEventosPlat(), listarMensajes()])
    setEventos(ev)
    setMensajes(msgs)
  }

  useEffect(() => {
    load()
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>, enviar: boolean) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    setSaving(true)
    setError('')
    const result = await guardarMensaje({
      evento_id: String(fd.get('evento_id') || '') || undefined,
      canal: String(fd.get('canal') || 'email'),
      asunto: String(fd.get('asunto') || ''),
      cuerpo: String(fd.get('cuerpo') || ''),
      enviar,
    })
    setSaving(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    form.reset()
    load()
  }

  return (
    <div className="ep-page max-w-4xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--ep-muted)]">Centro de mensajes</p>
        <h1 className="ep-title mt-1">Notificaciones</h1>
      </div>

      <form
        className="ep-card p-5 space-y-3"
        onSubmit={(e) => onSubmit(e, false)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-sm space-y-1">
            <span>Evento</span>
            <select name="evento_id" className="ep-select">
              <option value="">Sin evento</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.titulo}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm space-y-1">
            <span>Canal</span>
            <select name="canal" className="ep-select">
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </label>
        </div>
        <input name="asunto" className="ep-input" placeholder="Asunto" />
        <textarea name="cuerpo" required rows={5} className="ep-textarea" placeholder="Mensaje para los asistentes" />
        {error && <p className="text-sm text-[#ba1a1a]">{error}</p>}
        <div className="flex flex-col sm:flex-row gap-2">
          <button type="submit" disabled={saving} className="ep-btn ep-btn-ghost w-full sm:w-auto">
            Guardar borrador
          </button>
          <button
            type="button"
            disabled={saving}
            className="ep-btn ep-btn-primary w-full sm:w-auto"
            onClick={(ev) => {
              const form = (ev.currentTarget as HTMLButtonElement).form
              if (form) onSubmit({ preventDefault() {}, currentTarget: form } as React.FormEvent<HTMLFormElement>, true)
            }}
          >
            Marcar como enviado
          </button>
        </div>
        <p className="text-xs text-[var(--ep-muted)]">
          Esto guarda el mensaje. El envío masivo real (Bird / WhatsApp) lo conectamos cuando lo pidas.
        </p>
      </form>

      <div className="space-y-2">
        {mensajes.map((m) => (
          <div key={m.id} className="ep-card p-4">
            <div className="flex justify-between text-xs text-[var(--ep-muted)]">
              <span>
                {m.canal} · {m.estado}
              </span>
              <span>{new Date(m.created_at).toLocaleString('es-CO')}</span>
            </div>
            {m.asunto && <p className="font-semibold mt-1">{m.asunto}</p>}
            <p className="text-sm mt-1 whitespace-pre-wrap">{m.cuerpo}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
