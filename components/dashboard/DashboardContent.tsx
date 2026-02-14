'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TotalAsistentesChart } from './charts/TotalAsistentesChart'
import { SegmentosChart } from './charts/SegmentosChart'
import { RegistroPorEventosChart } from './charts/RegistroPorEventosChart'
import { StatsOverviewCard } from './StatsOverviewCard'

const MONTHS_2026 = [
  { value: '2026-01', label: 'Enero 2026' },
  { value: '2026-02', label: 'Febrero 2026' },
  { value: '2026-03', label: 'Marzo 2026' },
  { value: '2026-04', label: 'Abril 2026' },
  { value: '2026-05', label: 'Mayo 2026' },
  { value: '2026-06', label: 'Junio 2026' },
  { value: '2026-07', label: 'Julio 2026' },
  { value: '2026-08', label: 'Agosto 2026' },
  { value: '2026-09', label: 'Septiembre 2026' },
  { value: '2026-10', label: 'Octubre 2026' },
  { value: '2026-11', label: 'Noviembre 2026' },
  { value: '2026-12', label: 'Diciembre 2026' },
]

export function DashboardContent() {
  const [selectedMonth, setSelectedMonth] = useState('2026-01')
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
            DASHBOARD
          </p>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-light text-black tracking-tight">
              Asistentes
            </h1>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full h-8 w-8 bg-zinc-100 hover:bg-zinc-200"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Total Asistentes + Stats Overview - lado a lado (en mobile stats primero) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="order-2 lg:order-1"
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-zinc-600">
                  Total Asistentes
                </h3>
                <button
                  className="text-zinc-400 hover:text-zinc-600 transition-colors"
                  aria-label="Información"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="h-8 rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-400"
              >
                {MONTHS_2026.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </CardHeader>
            <CardContent>
              <TotalAsistentesChart selectedMonth={selectedMonth} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="order-1 lg:order-2"
        >
          <StatsOverviewCard />
        </motion.div>
      </div>

      {/* Segmentos y Registro por eventos - mismas dimensiones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:grid-rows-[1fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="min-h-0"
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 pb-2 shrink-0">
              <h3 className="text-sm font-medium text-zinc-600">Segmentos</h3>
              <button
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label="Información"
              >
                <Info className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="flex-1 min-h-[200px]">
              <SegmentosChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="min-h-0"
        >
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-2 pb-2 shrink-0">
              <h3 className="text-sm font-medium text-zinc-600">
                Registro por eventos
              </h3>
              <button
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label="Información"
              >
                <Info className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent className="flex-1 min-h-[200px]">
              <RegistroPorEventosChart />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
