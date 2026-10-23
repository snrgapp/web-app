'use client'

import { useMemo, useState } from 'react'
import { Clock, Mail, MessageCircle, Search } from 'lucide-react'
import type { DirectorioAsistente } from '@/app/actions/directorio'
import {
  DIRECTORIO_CARD_TONES,
  categoriaSector,
  iniciales,
  mesaCorta,
  recorte,
  telefonoVisible,
  telefonoWhatsApp,
} from '@/lib/directorio'

type Props = {
  asistentes: DirectorioAsistente[]
  diasRestantes: number
}

export function DirectorioGrid({ asistentes, diasRestantes }: Props) {
  const [q, setQ] = useState('')
  const [filtro, setFiltro] = useState('Todos')

  const chips = useMemo(() => {
    const set = new Set(asistentes.map((a) => categoriaSector(a.sector)))
    return ['Todos', ...[...set].sort()]
  }, [asistentes])

  const visibles = useMemo(() => {
    const query = q.trim().toLowerCase()
    return asistentes.filter((a) => {
      const cat = categoriaSector(a.sector)
      if (filtro !== 'Todos' && cat !== filtro) return false
      if (!query) return true
      const blob = [a.nombre, a.apellido, a.empresa, a.soluciones, a.desafios, a.sector]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return blob.includes(query)
    })
  }, [asistentes, filtro, q])

  return (
    <div className="min-h-dvh bg-[#111318] text-[#e2e2e9] pb-16">
      <header className="bg-[#111318] sticky top-0 z-40 w-full px-4 py-3 flex justify-between items-center dir-gold border-b border-t-0 border-x-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0c0e13] dir-gold-strong flex items-center justify-center shadow-lg">
            <span className="font-bold text-lg text-[#ecc246]" style={{ fontFamily: 'var(--dir-display)' }}>
              S
            </span>
          </div>
          <div>
            <span
              className="block text-xl font-bold text-[#e2e2e9]"
              style={{ fontFamily: 'var(--dir-display)' }}
            >
              Directorio
            </span>
            <span className="block text-xs text-[#c7c6cb]">Synergy</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#0c0e13] dir-gold-strong flex items-center justify-center shadow-lg">
          <span className="font-bold text-lg text-[#ecc246]" style={{ fontFamily: 'var(--dir-display)' }}>
            S
          </span>
        </div>
      </header>

      <main className="px-4 py-6 max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#282a2f] dir-gold text-[#ecc246] text-xs font-medium tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {diasRestantes === 1 ? 'Último día disponible' : `Disponible ${diasRestantes} días más`}
            </span>
          </div>
          <h1
            className="text-3xl font-semibold tracking-tight text-[#e2e2e9]"
            style={{ fontFamily: 'var(--dir-display)' }}
          >
            Quiénes estuvieron
          </h1>
          <p className="text-sm font-medium text-[#c7c6cb]">{asistentes.length} asistentes</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#919095]" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar asistente, empresa o solución..."
            className="w-full pl-11 pr-4 py-3 bg-[#1a1b21] dir-gold rounded-xl text-[#e2e2e9] placeholder:text-[#919095] text-sm outline-none focus:border-[#ecc246]"
          />
        </div>

        <div className="overflow-x-auto dir-no-scroll -mx-4 px-4 flex gap-2 py-1">
          {chips.map((chip) => {
            const active = chip === filtro
            return (
              <button
                key={chip}
                type="button"
                onClick={() => setFiltro(chip)}
                className={
                  active
                    ? 'px-4 py-2 rounded-xl bg-[#ecc246] text-[#3d2e00] text-sm font-medium whitespace-nowrap'
                    : 'px-4 py-2 rounded-xl bg-[#282a2f] dir-gold text-[#e2e2e9] text-sm font-medium whitespace-nowrap'
                }
              >
                {chip}
              </button>
            )
          })}
        </div>

        <div className="space-y-4">
          {visibles.length === 0 && (
            <p className="text-sm text-[#c7c6cb] py-8 text-center">No hay resultados con ese filtro.</p>
          )}
          {visibles.map((a, i) => {
            const tone = DIRECTORIO_CARD_TONES[i % DIRECTORIO_CARD_TONES.length]
            const nombre = [a.nombre, a.apellido].filter(Boolean).join(' ')
            const wa = telefonoWhatsApp(a.telefono)
            return (
              <article
                key={a.id}
                className="rounded-xl p-5 shadow-xl"
                style={{ backgroundColor: tone.bg, color: tone.fg }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span
                      className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-1 inline-block"
                      style={{ backgroundColor: tone.chip, color: tone.fg }}
                    >
                      {mesaCorta(a.codigo_mesa, a.mesa)}
                    </span>
                    <h3
                      className="text-lg font-bold"
                      style={{ fontFamily: 'var(--dir-display)', color: tone.fg }}
                    >
                      {nombre}
                    </h3>
                    <p className="text-sm font-semibold" style={{ color: tone.onMuted }}>
                      {a.empresa || '—'}
                    </p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: tone.divider, backgroundColor: tone.panel }}
                  >
                    <span className="font-bold text-sm" style={{ fontFamily: 'var(--dir-display)' }}>
                      {iniciales(a.nombre, a.apellido)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 p-3 rounded-lg" style={{ backgroundColor: tone.panel }}>
                  <p className="text-sm">
                    <strong className="font-bold">Soluciona:</strong> {recorte(a.soluciones)}
                  </p>
                  <p className="text-sm">
                    <strong className="font-bold">Desafío:</strong> {recorte(a.desafios, 80)}
                  </p>
                </div>

                <div
                  className="flex items-center justify-between gap-2 pt-2"
                  style={{ borderTop: `1px solid ${tone.divider}` }}
                >
                  <span className="text-xs font-semibold min-w-0 break-all" style={{ color: tone.onMuted }}>
                    {telefonoVisible(a.telefono)}
                    {a.correo ? ` — ${a.correo}` : ''}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noreferrer"
                        title="WhatsApp"
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: tone.actionBg, color: tone.actionFg }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}
                    {a.correo && (
                      <a
                        href={`mailto:${a.correo}`}
                        title="Correo"
                        className="w-9 h-9 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: tone.actionBg, color: tone.actionFg }}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
