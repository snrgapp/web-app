'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, UserCheck, Loader2 } from 'lucide-react'
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

  const maxPuntaje =
    resultados.length > 0
      ? Math.ceil(Math.max(...resultados.map((r) => r.total_ponderado)) * 1.15) || 5
      : 5

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
          {/* Participación - diseño tipo gauge con balance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="rounded-2xl bg-[#FFFBEB] border border-[#FFE100]/30 shadow-lg overflow-hidden">
              <div className="flex flex-col sm:flex-row items-stretch min-h-[200px]">
                {/* Lado izquierdo - Balance */}
                <div className="flex-1 p-6 flex flex-col justify-center">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-4">
                    Balance
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-black shrink-0" />
                      <span className="text-sm font-medium text-black">
                        Quienes votaron - {porcentajeParticipacion}%
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-zinc-400 shrink-0" />
                      <span className="text-sm font-medium text-zinc-500">
                        Inscritos (no votaron) - {participacion.total > 0 ? 100 - porcentajeParticipacion : 0}%
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Centro - Gauge semi-circular */}
                <div className="flex-1 flex items-center justify-center p-6 relative">
                  <div className="relative w-[180px] h-[100px]">
                    <svg viewBox="0 0 200 110" className="w-full h-full">
                      {/* Arco base (fondo gris) */}
                      <path
                        d="M 20 95 A 80 80 0 0 1 180 95"
                        fill="none"
                        stroke="#e4e4e7"
                        strokeWidth="12"
                        strokeLinecap="round"
                      />
                      {/* Arco de progreso (amarillo) */}
                      <path
                        d="M 20 95 A 80 80 0 0 1 180 95"
                        fill="none"
                        stroke="#FFE100"
                        strokeWidth="12"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: `${(porcentajeParticipacion / 100) * 251.2} 999`,
                          transition: 'stroke-dasharray 0.7s ease-out',
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                      <span className="text-2xl font-black text-black">{porcentajeParticipacion}%</span>
                      <span className="text-xs font-medium text-black/70 mt-0.5">progreso</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gráficos lado a lado - Puntaje total y Promedios por criterio */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <Card className="overflow-hidden bg-[#FFFBEB]/50">
              <CardHeader className="pb-1 pt-4 px-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Puntaje Total Ponderado por Founder
                </h3>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                {resultados.length === 0 ? (
                  <p className="text-sm text-zinc-400 py-12 text-center">No hay datos aún</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 8, right: 12, bottom: 4, left: -8 }}
                      barCategoryGap="1%"
                      barGap={2}
                      barSize={24}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#e4e4e7' }} interval={0} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} domain={[0, maxPuntaje]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e4e4e7',
                          fontSize: '11px',
                          padding: '8px 12px',
                          backgroundColor: 'white',
                        }}
                        formatter={(value) => [value != null ? Number(value).toFixed(2) : '-', 'Puntaje']}
                      />
                      <Bar
                        dataKey="Puntaje Total"
                        fill="#18181b"
                        radius={[8, 8, 8, 8]}
                        name="Puntaje"
                        background={{ fill: '#e4e4e7' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden bg-[#FFFBEB]/50">
              <CardHeader className="pb-1 pt-4 px-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
                  Promedios por Criterio
                </h3>
              </CardHeader>
              <CardContent className="px-4 pb-4 pt-0">
                {resultados.length === 0 ? (
                  <p className="text-sm text-zinc-400 py-12 text-center">No hay datos aún</p>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 8, right: 12, bottom: 4, left: -8 }}
                      barCategoryGap="4%"
                      barGap={2}
                      barSize={24}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#e4e4e7' }} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={28} domain={[0, 5]} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e4e4e7',
                          fontSize: '11px',
                          padding: '8px 12px',
                          backgroundColor: 'white',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} iconType="circle" iconSize={6} />
                      <Bar
                        dataKey="Innovación"
                        fill="#FFE100"
                        radius={[8, 8, 8, 8]}
                        name="Innovación"
                        background={{ fill: '#e4e4e7' }}
                      />
                      <Bar
                        dataKey="Claridad"
                        fill="#3b82f6"
                        radius={[8, 8, 8, 8]}
                        name="Claridad"
                        background={{ fill: '#e4e4e7' }}
                      />
                      <Bar
                        dataKey="Q&A"
                        fill="#10b981"
                        radius={[8, 8, 8, 8]}
                        name="Q&A"
                        background={{ fill: '#e4e4e7' }}
                      />
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
