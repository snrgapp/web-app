'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Download, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { getFeedbackNetworking, type FeedbackConAsistente } from '@/app/actions/networking'
import Papa from 'papaparse'

export default function NetworkingFeedbackPage() {
  const [feedback, setFeedback] = useState<FeedbackConAsistente[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchFeedback() {
    setLoading(true)
    const data = await getFeedbackNetworking()
    setFeedback(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  function exportToCsv() {
    const headers = ['Fecha', 'Nombre', 'Empresa', 'Teléfono', 'Rating']
    const rows = feedback.map((f) => {
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

  return (
    <div className="p-4 lg:p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center w-full max-w-7xl mx-auto"
      >
        <div className="w-full mb-6">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            FEEDBACK
          </p>
          <h1 className="text-2xl sm:text-3xl font-hero text-black">
            Feedback Networking
          </h1>
          <p className="mt-2 text-zinc-500">
            Calificaciones de los asistentes al networking (1-5 estrellas).
          </p>
        </div>

        <Card className="w-full overflow-hidden shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Respuestas
              </h2>
              {feedback.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={exportToCsv}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exportar CSV
                </Button>
              )}
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                    <TableHead className="px-4 py-3 text-zinc-600 font-medium whitespace-nowrap">
                      Fecha
                    </TableHead>
                    <TableHead className="px-4 py-3 text-zinc-600 font-medium whitespace-nowrap">
                      Nombre
                    </TableHead>
                    <TableHead className="px-4 py-3 text-zinc-600 font-medium whitespace-nowrap">
                      Empresa
                    </TableHead>
                    <TableHead className="px-4 py-3 text-zinc-600 font-medium whitespace-nowrap">
                      Teléfono
                    </TableHead>
                    <TableHead className="px-4 py-3 text-zinc-600 font-medium whitespace-nowrap">
                      Rating
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="px-4 py-8 text-center text-zinc-500"
                      >
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : feedback.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="px-4 py-8 text-center text-zinc-500"
                      >
                        No hay feedback aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    feedback.map((f) => {
                      const a = f.asistentes
                      const nombre = [a?.nombre, a?.apellido].filter(Boolean).join(' ') || '-'
                      return (
                        <TableRow key={f.id} className="hover:bg-zinc-50/50">
                          <TableCell className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">
                            {new Date(f.created_at).toLocaleString('es-CO', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-zinc-900">
                            {nombre}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-zinc-600">
                            {a?.empresa ?? '-'}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-zinc-600 font-mono text-sm">
                            {a?.telefono ?? '-'}
                          </TableCell>
                          <TableCell className="px-4 py-3">
                            <span className="inline-flex items-center gap-0.5">
                              {f.rating}
                              <Star className="w-4 h-4 fill-[#FFE100] text-[#FFE100]" />
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {!loading && feedback.length > 0 && (
              <p className="mt-4 text-sm text-zinc-500">
                Total: {feedback.length} respuesta(s)
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
