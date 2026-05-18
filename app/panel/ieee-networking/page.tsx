'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, RefreshCw, Share2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/utils/supabase/client'
import { ejecutarIeeeRecomputeDesdePanel } from '@/app/actions/ieee-admin'

export default function PanelIeeeNetworkingPage() {
  const [inscritos, setInscritos] = useState<number | null>(null)
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
    const { count, error } = await supabase
      .from('ieee_networking_submissions')
      .select('*', { count: 'exact', head: true })
    if (error) setErr(error.message)
    else setInscritos(count ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleRecomputarMatching() {
    setMatchBusy(true)
    setErr('')
    setMatchLog(null)
    const res = await ejecutarIeeeRecomputeDesdePanel()
    setMatchBusy(false)
    if (!res.authorized) {
      setErr(res.error)
      return
    }
    const lines = [
      res.ok ? 'Matching IEEE aplicado correctamente.' : 'El proceso devolvió error.',
      `Inscritos: ${res.profileCount}`,
      `Filas en match_ieee: ${res.matchRowsWritten}`,
      `Grupos R1: ${res.ronda1Groups} · R2: ${res.ronda2Groups}`,
      ...res.messages,
    ]
    setMatchLog(lines.join('\n'))
    if (!res.ok) setErr(res.messages.join(' · ') || 'Falló recomputar conexiones')
    await load()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Share2 className="h-8 w-8 text-zinc-700" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-black">IEEE · Matching</h1>
          <p className="text-sm text-zinc-600">
            Regenerar sugerencias de networking (misma lógica que al enviar el formulario).
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-zinc-700">
          {loading ? (
            <div className="flex items-center gap-2 text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando…
            </div>
          ) : (
            <p>
              Inscripciones en{' '}
              <code className="rounded bg-zinc-100 px-1 text-xs">ieee_networking_submissions</code>:{' '}
              <strong>{inscritos ?? '—'}</strong>
            </p>
          )}

          <div className="rounded-lg border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-950">
            <p className="font-medium">Solo 2 inscritos</p>
            <p className="mt-1 leading-relaxed">
              En la <strong>ronda 1</strong> siempre quedan en el mismo grupo de 2: se verán mutuamente
              (no es azar). En la <strong>ronda 2</strong> el sistema evita repetir la misma pareja, así
              que con exactamente 2 personas <strong>no habrá sugerencias en ronda 2</strong>. Con 3 o más
              participantes sí se generan grupos distintos entre rondas.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => void handleRecomputarMatching()}
            disabled={matchBusy}
            className="w-full sm:w-auto"
          >
            {matchBusy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recomputando…
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerar matches IEEE
              </>
            )}
          </Button>

          {matchLog ? (
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-zinc-900 p-3 font-mono text-xs text-zinc-100">
              {matchLog}
            </pre>
          ) : null}

          {err ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{err}</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
