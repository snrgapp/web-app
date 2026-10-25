'use client'

import { useEffect, useState } from 'react'
import { getAjustesPlat, guardarAjustesPlat } from '@/app/actions/eventos-platform'

export default function AjustesPage() {
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState(true)
  const [avisosWa, setAvisosWa] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    getAjustesPlat().then((a) => {
      if (!a) return
      setWhatsapp(a.whatsapp_pagos ?? '')
      setEmail(a.notificar_email !== false)
      setAvisosWa(Boolean(a.notificar_whatsapp))
    })
  }, [])

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const result = await guardarAjustesPlat({
      notificar_email: email,
      notificar_whatsapp: avisosWa,
      whatsapp_pagos: whatsapp,
    })
    setMsg(result.ok ? 'Guardado' : result.error ?? 'Error')
  }

  return (
    <div className="ep-page max-w-xl space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-[var(--ep-muted)]">Plataforma</p>
        <h1 className="ep-title mt-1">Ajustes</h1>
      </div>

      <form onSubmit={save} className="ep-card p-5 space-y-4">
        <label className="text-sm space-y-1 block">
          <span>WhatsApp para completar pagos</span>
          <input
            className="ep-input"
            inputMode="tel"
            placeholder="3001234567"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <span className="text-xs text-[var(--ep-muted)]">
            Quien reserve un evento de pago te escribe aquí. Sin pasarela.
          </span>
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>Avisos por email</span>
          <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm">
          <span>Avisos por WhatsApp</span>
          <input type="checkbox" checked={avisosWa} onChange={(e) => setAvisosWa(e.target.checked)} />
        </label>
        <button type="submit" className="ep-btn ep-btn-primary">
          Guardar
        </button>
        {msg && <p className="text-sm text-[var(--ep-muted)]">{msg}</p>}
      </form>
    </div>
  )
}
