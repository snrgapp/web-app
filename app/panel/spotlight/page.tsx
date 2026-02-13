'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, UserCheck, BarChart3, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getResultadosSpotlight,
  getParticipacion,
  FounderResultado,
} from '@/app/actions/spotlight'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function SpotlightDashboardPage() {
  const [resultados, setResultados] = useState<FounderResultado[]>([])
  const [participacion, setParticipacion] = useState({ votaron: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const [res, part] = await Promise.all([
      getResultadosSpotlight(),
      getParticipacion(),
    ])
    setResultados(res)
    setParticipacion(part)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
    // Polling cada 10 segundos
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [loadData])

  const chartData = resultados.map((r) => ({
    name: r.nombre,
    startup: r.startup_nombre,
    'Puntaje Total': r.total_ponderado,
    'Innovación': r.promedio_innovacion,
    'Claridad': r.promedio_claridad,
    'Q&A': r.promedio_qa,
  }))

  const porcentajeParticipacion =
    participacion.total > 0
      ? Math.round((participacion.votaron / participacion.total) * 100)
      : 0

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            SPOTLIGHT
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Resultados en Vivo
          </h1>
        </div>
        <div className="flex gap-2">
          <Link href="/panel/spotlight/founders">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Founders
            </Button>
          </Link>
          <Link href="/panel/spotlight/votantes">
            <Button variant="outline" size="sm" className="gap-2">
              <UserCheck className="w-4 h-4" />
              Votantes
            </Button>
          </Link>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : (
        <>
          {/* Participación */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-600">Participación</p>
                      <p className="text-2xl font-black text-black">
                        {participacion.votaron}{' '}
                        <span className="text-sm font-medium text-zinc-400">/ {participacion.total} votantes</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-black">{porcentajeParticipacion}%</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${porcentajeParticipacion}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Gráfico de barras - Puntaje total */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-zinc-600">
                  Puntaje Total Ponderado por Founder
                </h3>
              </CardHeader>
              <CardContent>
                {resultados.length === 0 ? (
                  <p className="text-sm text-zinc-400 py-8 text-center">No hay datos aún</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e4e4e7',
                          fontSize: '12px',
                        }}
                      />
                      <Bar dataKey="Puntaje Total" fill="#18181b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Promedios por categoría */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-zinc-600">
                  Promedios por Criterio
                </h3>
              </CardHeader>
              <CardContent>
                {resultados.length === 0 ? (
                  <p className="text-sm text-zinc-400 py-8 text-center">No hay datos aún</p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} domain={[0, 5]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e4e4e7',
                          fontSize: '12px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="Innovación" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Claridad" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Q&A" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabla de ranking */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <h3 className="text-sm font-medium text-zinc-600">Ranking</h3>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100">
                        <th className="text-left py-2 px-2 font-medium text-zinc-500">#</th>
                        <th className="text-left py-2 px-2 font-medium text-zinc-500">Founder</th>
                        <th className="text-left py-2 px-2 font-medium text-zinc-500">Startup</th>
                        <th className="text-right py-2 px-2 font-medium text-zinc-500">Innovación</th>
                        <th className="text-right py-2 px-2 font-medium text-zinc-500">Claridad</th>
                        <th className="text-right py-2 px-2 font-medium text-zinc-500">Q&A</th>
                        <th className="text-right py-2 px-2 font-medium text-zinc-500">Total</th>
                        <th className="text-right py-2 px-2 font-medium text-zinc-500">Votos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...resultados]
                        .sort((a, b) => b.total_ponderado - a.total_ponderado)
                        .map((r, i) => (
                          <tr key={r.founder_id} className="border-b border-zinc-50 hover:bg-zinc-50">
                            <td className="py-2 px-2 font-bold text-zinc-400">{i + 1}</td>
                            <td className="py-2 px-2 font-medium text-black">{r.nombre}</td>
                            <td className="py-2 px-2 text-zinc-600">{r.startup_nombre}</td>
                            <td className="py-2 px-2 text-right text-amber-600 font-medium">{r.promedio_innovacion}</td>
                            <td className="py-2 px-2 text-right text-blue-600 font-medium">{r.promedio_claridad}</td>
                            <td className="py-2 px-2 text-right text-emerald-600 font-medium">{r.promedio_qa}</td>
                            <td className="py-2 px-2 text-right font-bold text-black">{r.total_ponderado}</td>
                            <td className="py-2 px-2 text-right text-zinc-500">{r.total_votos}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  )
}
