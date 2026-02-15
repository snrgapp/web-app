'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  Download,
  Star,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { getFeedbackNetworking, type FeedbackConAsistente } from '@/app/actions/networking'
import Papa from 'papaparse'

const PAGE_SIZE = 8
type SortOption = 'best' | 'worst' | 'recent' | 'oldest'

function formatTelefono(tel: string | number | null | undefined): string {
  if (tel == null || tel === '') return '-'
  const str = typeof tel === 'string' ? tel : String(tel)
  const digits = str.replace(/\D/g, '')
  if (digits.length === 10 && digits.startsWith('3')) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return str
}

function getRatingBg(rating: number): string {
  if (rating >= 5) return 'bg-emerald-100 text-emerald-800'
  if (rating >= 4) return 'bg-emerald-50 text-emerald-700'
  if (rating >= 3) return 'bg-amber-100 text-amber-800'
  if (rating >= 2) return 'bg-red-100 text-red-800'
  return 'bg-red-100 text-red-800'
}

export default function NetworkingFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackConAsistente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('best')
  const [sortOpen, setSortOpen] = useState(false)
  const [page, setPage] = useState(1)

  async function fetchFeedback() {
    setLoading(true)
    const data = await getFeedbackNetworking()
    setFeedback(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  const filtered = useMemo(() => {
    let list = [...feedback]
    const q = search.toLowerCase().trim()
    if (q) {
      list = list.filter((f) => {
        const a = f.asistentes
        const nombre = [a?.nombre, a?.apellido].filter(Boolean).join(' ').toLowerCase()
        const empresa = (a?.empresa ?? '').toLowerCase()
        const telefono = (a?.telefono ?? '').toLowerCase()
        return nombre.includes(q) || empresa.includes(q) || telefono.includes(q)
      })
    }
    switch (sort) {
      case 'best':
        list.sort((a, b) => b.rating - a.rating)
        break
      case 'worst':
        list.sort((a, b) => a.rating - b.rating)
        break
      case 'recent':
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
    }
    return list
  }, [feedback, search, sort])

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1

  function exportToCsv() {
    const headers = ['Fecha', 'Nombre', 'Empresa', 'Teléfono', 'Rating']
    const rows = filtered.map((f) => {
      const a = f.asistentes
      const nombre = [a?.nombre, a?.apellido].filter(Boolean).join(' ') || '-'
      return {
        Fecha: new Date(f.created_at).toLocaleString('es-CO', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
        Nombre: nombre,
        Empresa: a?.empresa ?? '-',
        Teléfono: a?.telefono ?? '-',
        Rating: f.rating,
      }
    })
    const csv = Papa.unparse({ fields: headers, data: rows })
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `feedback-networking-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const sortLabels: Record<SortOption, string> = {
    best: 'Mejor',
    worst: 'Peor',
    recent: 'Más reciente',
    oldest: 'Más antiguo',
  }

  return (
    <div className="min-h-screen bg-zinc-100 pt-4 pr-4 pb-4 pl-2 lg:pt-8 lg:pr-8 lg:pb-8 lg:pl-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center w-full max-w-3xl mx-auto"
      >
        <div className="w-full overflow-hidden shadow-xl rounded-2xl bg-white border border-zinc-100">
          <div className="bg-white p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg font-light text-black tracking-tight">Todos los respuestas</h2>
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial min-w-[180px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setPage(1)
                    }}
                    className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 text-sm text-black placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300"
                  />
                </div>

                {/* Sort */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg border border-zinc-200 text-sm text-black hover:bg-zinc-50 min-w-[120px] justify-between"
                  >
                    <span>Sort by: {sortLabels[sort]}</span>
                    <ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" strokeWidth={2} />
                  </button>
                  {sortOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setSortOpen(false)}
                        aria-hidden
                      />
                      <div className="absolute right-0 top-full mt-1 z-20 w-full rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
                        {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setSort(opt)
                              setSortOpen(false)
                              setPage(1)
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-black hover:bg-zinc-50"
                          >
                            {sortLabels[opt]}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {feedback.length > 0 && (
                  <button
                    type="button"
                    onClick={exportToCsv}
                    className="flex items-center gap-2 h-9 px-3 rounded-lg border border-zinc-200 text-sm text-black hover:bg-zinc-50 shrink-0"
                  >
                    <Download className="h-4 w-4" strokeWidth={2} />
                    Exportar
                  </button>
                )}
              </div>
            </div>

            {/* Tabla compacta con líneas delgadas */}
            <div className="overflow-x-auto rounded-lg border border-zinc-200/80">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="px-3 py-2.5 text-left font-medium text-zinc-600">Fecha</th>
                    <th className="px-3 py-2.5 text-left font-medium text-zinc-600">Nombre</th>
                    <th className="px-3 py-2.5 text-left font-medium text-zinc-600">Empresa</th>
                    <th className="px-3 py-2.5 text-left font-medium text-zinc-600">Telefono</th>
                    <th className="px-3 py-2.5 text-left font-medium text-zinc-600">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-10 text-center text-zinc-500">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                        Cargando...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-3 py-10 text-center text-zinc-500">
                        No hay feedback aún.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((f) => {
                      const a = f.asistentes
                      const nombre =
                        [a?.nombre, a?.apellido].filter(Boolean).join(' ') || '-'
                      return (
                        <tr
                          key={f.id}
                          className="border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors"
                        >
                          <td className="px-3 py-2.5 text-zinc-500 whitespace-nowrap">
                            {new Date(f.created_at).toLocaleString('es-CO', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-3 py-2.5 text-black font-medium">{nombre}</td>
                          <td className="px-3 py-2.5 text-zinc-600">{a?.empresa ?? '-'}</td>
                          <td className="px-3 py-2.5 text-zinc-600">
                            {formatTelefono(a?.telefono ?? null)}
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex items-center gap-0.5 rounded-md px-2 py-0.5 text-xs font-medium ${getRatingBg(
                                f.rating
                              )}`}
                            >
                              {f.rating}
                              <Star
                                className="h-3.5 w-3.5 opacity-80"
                                strokeWidth={1.5}
                                fill="currentColor"
                              />
                            </span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {!loading && filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-zinc-100">
                <p className="text-xs text-zinc-500">
                  Showing data {(page - 1) * PAGE_SIZE + 1} to{' '}
                  {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
                </p>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </button>
                  {(() => {
                    const pages: number[] = []
                    if (totalPages <= 5) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i)
                    } else {
                      const showFirst = page <= 3
                      const showLast = page >= totalPages - 2
                      if (showFirst) {
                        for (let i = 1; i <= 4; i++) pages.push(i)
                        pages.push(-1)
                        pages.push(totalPages)
                      } else if (showLast) {
                        pages.push(1)
                        pages.push(-1)
                        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
                      } else {
                        pages.push(1)
                        pages.push(-1)
                        for (let i = page - 1; i <= page + 1; i++) pages.push(i)
                        pages.push(-1)
                        pages.push(totalPages)
                      }
                    }
                    return pages.map((p) =>
                      p === -1 ? (
                        <span key="ellipsis" className="h-8 flex items-center px-1 text-zinc-500">
                          ...
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          className={`h-8 min-w-[32px] px-2 flex items-center justify-center rounded-md text-sm font-medium ${
                            p === page
                              ? 'bg-violet-600 text-white border border-violet-600'
                              : 'border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )
                  })()}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="h-8 w-8 flex items-center justify-center rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

