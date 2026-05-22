'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw, Shuffle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { supabase } from '@/utils/supabase/client'
import type { HackatonSubmission } from '@/types/database.types'
import { ejecutarHackathonRecomputeDesdePanel } from '@/app/actions/hackathon-admin'

export default function PanelHackathonPage() {
  const [submissions, setSubmissions] = useState<HackatonSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [matchBusy, setMatchBusy] = useState(false)
  const [matchLog, setMatchLog] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!supabase) {
      setErr('Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY')
      setLoading(false)
      return
    }
    setErr('')
    setLoading(true)
    const sRes = await supabase.from('hackaton_submissions').select('*').order('created_at', { ascending: false })
    if (sRes.error) setErr(sRes.error.message)
    else setSubmissions((sRes.data ?? []) as HackatonSubmission[])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const poller = setInterval(() => void load(), 15000)
    return () => clearInterval(poller)
  }, [load])

  async function handleRecomputarMatching() {
    setMatchBusy(true)
    setErr('')
    setMatchLog(null)
    const res = await ejecutarHackathonRecomputeDesdePanel()
    setMatchBusy(false)
    if (!res.authorized) {
      setErr(res.error)
      return
    }
    const lines = [
      res.ok ? 'Matching aplicado correctamente.' : 'El servidor devolvió error.',
      `Inscritos: ${res.profileCount}`,
      `Aristas en BD: ${res.matchRowsWritten}`,
      `Grupos R1: ${res.ronda1Groups} · R2: ${res.ronda2Groups}`,
      ...res.messages,
    ]
    setMatchLog(lines.join('\n'))
    if (!res.ok) setErr(res.messages.join(' · ') || 'Falló recomputar conexiones')
    await load()
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Hackathon</h1>
            <p className="text-sm text-zinc-500">
              Inscripciones y conexiones sugeridas (match_hackaton). La experiencia en app es solo
              relacionamiento + badge.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => void load()}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Actualizar
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => void handleRecomputarMatching()}
              disabled={matchBusy || loading}
              title="Regenera sugerencias en match_hackaton (app Conexiones)"
            >
              {matchBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shuffle className="h-4 w-4" />}
              Recomputar conexiones
            </Button>
          </div>
        </div>

        {matchLog && (
          <pre className="whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white px-4 py-3 font-mono text-xs text-zinc-700">
            {matchLog}
          </pre>
        )}

        {err && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {err}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-zinc-200">
            <CardHeader className="pb-2">
              <p className="text-sm text-zinc-500">Total inscritos: {submissions.length}</p>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.nombre_completo}</TableCell>
                      <TableCell>{s.telefono}</TableCell>
                      <TableCell>{s.perfil}</TableCell>
                      <TableCell className="font-mono text-xs">{s.badge_id}</TableCell>
                      <TableCell className="text-xs text-zinc-500">
                        {new Date(s.created_at).toLocaleString('es-CO')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {submissions.length === 0 && !loading && (
                <p className="px-4 py-8 text-center text-sm text-zinc-500">Sin inscripciones aún.</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
