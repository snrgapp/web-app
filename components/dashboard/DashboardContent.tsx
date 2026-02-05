'use client'

import { motion } from 'framer-motion'
import { Plus, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TotalAsistentesChart } from './charts/TotalAsistentesChart'
import { SegmentosChart } from './charts/SegmentosChart'
import { TotalEventosChart } from './charts/TotalEventosChart'

export function DashboardContent() {
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
            <h1 className="text-2xl sm:text-3xl font-hero text-black">
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

      {/* Total Asistentes */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
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
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Provisions Month</span>
              <Button variant="outline" size="sm" className="text-xs h-8">
                Marzo 2025
              </Button>
              <button
                className="p-1 text-zinc-400 hover:text-zinc-600"
                aria-label="Más opciones"
              >
                <span className="text-lg">⋯</span>
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <TotalAsistentesChart />
          </CardContent>
        </Card>
      </motion.div>

      {/* Segmentos y Total Eventos - grid responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <h3 className="text-sm font-medium text-zinc-600">Segmentos</h3>
              <button
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label="Información"
              >
                <Info className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent>
              <SegmentosChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <h3 className="text-sm font-medium text-zinc-600">
                Total Suma de Eventos
              </h3>
              <button
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
                aria-label="Información"
              >
                <Info className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent>
              <TotalEventosChart />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
