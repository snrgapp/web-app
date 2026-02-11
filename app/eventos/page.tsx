'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { supabase } from '@/utils/supabase/client'
import type { Evento } from '@/types/database.types'

function isLocalUrl(url: string) {
  return url.startsWith('/') && !url.startsWith('//')
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10)
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'proximos' | 'pasados'>('proximos')

  useEffect(() => {
    async function fetchEventos() {
      if (!supabase) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('orden', { ascending: true })
        .order('created_at', { ascending: false })

      if (!error) setEventos(data ?? [])
      setLoading(false)
    }
    fetchEventos()
  }, [])

  const today = getTodayISO()
  const { proximos, pasados } = useMemo(() => {
    const p: Evento[] = []
    const q: Evento[] = []
    for (const e of eventos) {
      if (!e.fecha || e.fecha >= today) p.push(e)
      else q.push(e)
    }
    p.sort((a, b) => (a.fecha ?? '').localeCompare(b.fecha ?? '') || a.orden - b.orden)
    q.sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? '') || b.orden - a.orden)
    return { proximos: p, pasados: q }
  }, [eventos, today])

  const list = tab === 'proximos' ? proximos : pasados
  const emptyMessage =
    tab === 'proximos'
      ? 'No hay próximos eventos.'
      : 'No hay eventos pasados.'

  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a] pb-12">
      <Navbar />
      <div className="pt-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pestañas */}
        <div className="flex gap-0 border-b border-[#1a1a1a]/15 mb-8">
          <button
            type="button"
            onClick={() => setTab('proximos')}
            className={`px-4 py-3 text-base font-medium lowercase border-b-2 transition-colors -mb-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 ${
              tab === 'proximos'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#1a1a1a]/60'
            }`}
          >
            próximos eventos
          </button>
          <button
            type="button"
            onClick={() => setTab('pasados')}
            className={`px-4 py-3 text-base font-medium lowercase border-b-2 transition-colors -mb-px focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 ${
              tab === 'pasados'
                ? 'border-[#1a1a1a] text-[#1a1a1a]'
                : 'border-transparent text-[#1a1a1a]/60'
            }`}
          >
            eventos pasados
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#1a1a1a]/20 border-t-[#1a1a1a] rounded-full animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-[#1a1a1a]/60 text-center py-12">
            {emptyMessage}
          </p>
        ) : (
          <ul className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {list.map((evento) => (
              <li key={evento.id} className="flex-shrink-0">
                <a
                  href={evento.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative w-[250px] h-[250px] overflow-hidden rounded-xl border border-black/5 shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 bg-white"
                >
                  {isLocalUrl(evento.image_url) ? (
                    <Image
                      src={evento.image_url}
                      alt={evento.titulo ?? 'Evento'}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="250px"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={evento.image_url}
                      alt={evento.titulo ?? 'Evento'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                    <span className="text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">
                      Registrarse →
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
