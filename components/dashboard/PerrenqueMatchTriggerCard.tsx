'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ejecutarPerrenqueRecomputeDesdePanel } from '@/app/actions/perrenque-admin'
import type { PerrenqueRecomputePanelResult } from '@/app/actions/perrenque-admin'

export function PerrenqueMatchTriggerCard() {
  const [loading, setLoading] = useState(false)
  const [last, setLast] = useState<PerrenqueRecomputePanelResult | null>(null)

  async function run() {
    setLoading(true)
    setLast(null)
    try {
      const res = await ejecutarPerrenqueRecomputeDesdePanel()
      setLast(res)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.12 }}
    >
      <Card className="border-zinc-200">
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-2">
          <div>
            <h3 className="text-sm font-medium text-zinc-800">Perrenque Creativo</h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Ejecutar agente de grupos y matches (misma lógica que el registro y el cron).
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={run}
            className="gap-2 shrink-0 bg-zinc-900 text-white hover:bg-zinc-800"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <PlayCircle className="h-4 w-4" aria-hidden />
            )}
            {loading ? 'Ejecutando…' : 'Ejecutar matching'}
          </Button>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {last && !last.authorized && (
            <p className="text-sm text-red-600 font-medium" role="alert">
              {last.error}
            </p>
          )}
          {last && last.authorized && (
            <div className="rounded-lg border border-zinc-100 bg-zinc-50/80 px-3 py-2 text-xs space-y-2">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-zinc-700">
                <span>
                  Estado:{' '}
                  <strong className={last.ok ? 'text-green-700' : 'text-red-700'}>
                    {last.ok ? 'OK' : 'Error'}
                  </strong>
                </span>
                <span>
                  Inscritos: <strong>{last.profileCount}</strong>
                </span>
                <span>
                  Groq (key):{' '}
                  <strong>{last.groqApiKeyConfigured ? 'sí' : 'no'}</strong>
                </span>
                <span>
                  Groq intentado:{' '}
                  <strong>{last.groqAttempted ? 'sí' : 'no'}</strong>
                </span>
                <span>
                  Groq partición OK:{' '}
                  <strong>{last.groqPartitionOk ? 'sí' : 'no'}</strong>
                </span>
                <span>
                  Fallback local: <strong>{last.usedFallback ? 'sí' : 'no'}</strong>
                </span>
                <span>
                  Grupos escritos: <strong>{last.grupoRowsWritten}</strong>
                </span>
                <span>
                  Matches escritos: <strong>{last.matchRowsWritten}</strong>
                </span>
              </div>
              {last.messages.length > 0 && (
                <ul className="list-disc pl-4 text-zinc-600 space-y-0.5">
                  {last.messages.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
