'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { supabase } from '@/utils/supabase/client'
import type { Evento } from '@/types/database.types'
import { Sparkles, MapPin, ChevronRight } from 'lucide-react'

function isLocalUrl(url: string) {
  return url.startsWith('/') && !url.startsWith('//')
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10)
}

const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function formatFecha(fechaStr: string | null) {
  if (!fechaStr) return null
  const d = new Date(fechaStr + 'T12:00:00')
  const dia = d.getDate()
  const mes = MESES[d.getMonth()]
  const diaSemana = DIAS_SEMANA[d.getDay()]
  return { dia, mes, diaSemana, label: `${dia} ${mes}` }
}

/** Agrupa eventos por fecha */
function agruparPorFecha(eventos: Evento[]) {
  const grupos = new Map<string, Evento[]>()
  for (const e of eventos) {
    const key = e.fecha ?? 'sin-fecha'
    if (!grupos.has(key)) grupos.set(key, [])
    grupos.get(key)!.push(e)
  }
  return Array.from(grupos.entries())
    .sort(([a], [b]) => (a === 'sin-fecha' ? 1 : b === 'sin-fecha' ? -1 : a.localeCompare(b)))
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
  const grupos = useMemo(() => agruparPorFecha(list), [list])
  const emptyMessage =
    tab === 'proximos'
      ? 'No hay próximos eventos.'
      : 'No hay eventos pasados.'

  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a] pb-12">
      <Navbar />
      <div className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con título y tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a]">Eventos</h1>
          <div className="flex gap-1 p-1 rounded-full bg-[#1a1a1a]/10">
            <button
              type="button"
              onClick={() => setTab('proximos')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 ${
                tab === 'proximos'
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
              }`}
            >
              Próximos
            </button>
            <button
              type="button"
              onClick={() => setTab('pasados')}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2 ${
                tab === 'pasados'
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-[#1a1a1a]/70 hover:text-[#1a1a1a]'
              }`}
            >
              Pasados
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-[#1a1a1a]/20 border-t-[#1a1a1a] rounded-full animate-spin" />
          </div>
        ) : list.length === 0 ? (
          <p className="text-[#1a1a1a]/60 text-center py-12">{emptyMessage}</p>
        ) : (
          <div className="space-y-8">
            {grupos.map(([fechaKey, items]) => {
              const primera = items[0]
              const f = formatFecha(primera?.fecha ?? null)
              return (
                <div key={fechaKey} className="flex gap-6">
                  {/* Columna izquierda: fecha + timeline */}
                  <div className="flex-shrink-0 w-20 sm:w-24 flex flex-col items-center">
                    {f ? (
                      <>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-[#1a1a1a]">{`${f.dia} ${f.mes}`}</p>
                          <p className="text-sm text-[#1a1a1a]/70 capitalize">{f.diaSemana}</p>
                        </div>
                        <div className="mt-2 w-px flex-1 min-h-[24px] border-l-2 border-dashed border-[#1a1a1a]/25" />
                      </>
                    ) : (
                      <div className="w-px flex-1 min-h-[24px] border-l-2 border-dashed border-[#1a1a1a]/25" />
                    )}
                  </div>

                  {/* Columna derecha: tarjetas */}
                  <div className="flex-1 min-w-0 space-y-4 pb-4">
                    {items.map((evento) => (
                      <a
                        key={evento.id}
                        href={evento.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <article className="flex gap-4 p-4 rounded-xl bg-white border border-[#1a1a1a]/8 shadow-sm hover:shadow-md hover:border-[#1a1a1a]/15 transition-all">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1a1a1a]/80 mb-2">19:00</p>
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-[#E5B318] flex-shrink-0" />
                              <h2 className="font-semibold text-[#1a1a1a] line-clamp-2">
                                {evento.titulo || 'Evento'}
                              </h2>
                            </div>
                            {evento.ciudad && (
                              <p className="flex items-center gap-2 text-sm text-[#1a1a1a]/60">
                                <MapPin className="w-4 h-4 flex-shrink-0 text-[#1a1a1a]/50" />
                                <span>{evento.ciudad}</span>
                              </p>
                            )}
                            <p className="mt-3 text-sm text-[#1a1a1a]/70 group-hover:text-[#1a1a1a] flex items-center gap-1">
                              {tab === 'proximos' ? 'Registrarse' : 'Ver evento'}
                              <ChevronRight className="w-4 h-4" />
                            </p>
                          </div>
                          <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-[#1a1a1a]/5">
                            {isLocalUrl(evento.image_url) ? (
                              <Image
                                src={evento.image_url}
                                alt={evento.titulo ?? 'Evento'}
                                width={112}
                                height={112}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={evento.image_url}
                                alt={evento.titulo ?? 'Evento'}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            )}
                          </div>
                        </article>
                      </a>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
