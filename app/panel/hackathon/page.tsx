'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  RefreshCw,
  Shuffle,
  Users,
  UserPlus,
  LayoutList,
  Radio,
} from 'lucide-react'
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
import type { HackatonEquipo, HackatonSubmission } from '@/types/database.types'
import {
  asignarHackathonMiembro,
  crearHackathonEquipo,
  ejecutarHackathonRecomputeDesdePanel,
  quitarHackathonMiembro,
} from '@/app/actions/hackathon-admin'

type TabKey = 'inscritos' | 'equipos'

type MiembroRow = {
  equipo_id: string
  ronda: number
  orden: number
  created_at: string
  submission_id: string
  hackaton_submissions: {
    nombre_completo: string
    badge_id: string
    telefono: string
  } | null
  hackaton_equipos: {
    numero: number
    nombre: string
    cupos_max: number
  } | null
}

export default function PanelHackathonPage() {
  const [tab, setTab] = useState<TabKey>('inscritos')
  const [submissions, setSubmissions] = useState<HackatonSubmission[]>([])
  const [equipos, setEquipos] = useState<HackatonEquipo[]>([])
  const [miembros, setMiembros] = useState<MiembroRow[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [nuevoEquipoNum, setNuevoEquipoNum] = useState('1')
  const [nuevoEquipoCupos, setNuevoEquipoCupos] = useState('5')
  const [assignEquipoId, setAssignEquipoId] = useState('')
  const [assignSubmissionId, setAssignSubmissionId] = useState('')
  const [assignRonda, setAssignRonda] = useState<'1' | '2'>('1')
  const [actionBusy, setActionBusy] = useState(false)
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
    const [sRes, eRes, mRes] = await Promise.all([
      supabase.from('hackaton_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('hackaton_equipos').select('*').order('numero', { ascending: true }),
      supabase
        .from('hackaton_equipo_miembros')
        .select(
          `
          equipo_id,
          ronda,
          orden,
          created_at,
          submission_id,
          hackaton_submissions (nombre_completo, badge_id, telefono),
          hackaton_equipos (numero, nombre, cupos_max)
        `
        )
        .order('created_at', { ascending: false }),
    ])
    if (sRes.error) setErr(sRes.error.message)
    else setSubmissions((sRes.data ?? []) as HackatonSubmission[])
    if (eRes.error) setErr(eRes.error.message)
    else setEquipos((eRes.data ?? []) as HackatonEquipo[])
    if (mRes.error) setErr(mRes.error.message)
    else setMiembros((mRes.data ?? []) as unknown as MiembroRow[])
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const sb = supabase
    if (!sb) return
    const ch = sb
      .channel('hackaton-panel-miembros')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'hackaton_equipo_miembros' },
        () => {
          void load()
        }
      )
      .subscribe()
    const poller = setInterval(() => void load(), 5000)
    return () => {
      clearInterval(poller)
      void sb.removeChannel(ch)
    }
  }, [load])

  async function handleCrearEquipo() {
    const num = Number(nuevoEquipoNum)
    const cupos = Number(nuevoEquipoCupos)
    setActionBusy(true)
    setErr('')
    const res = await crearHackathonEquipo({ numero: num, cuposMax: cupos })
    setActionBusy(false)
    if (!res.ok) {
      setErr(res.error)
      return
    }
    await load()
  }

  async function handleAsignar() {
    if (!assignEquipoId || !assignSubmissionId) {
      setErr('Elige equipo y participante')
      return
    }
    setActionBusy(true)
    setErr('')
    const res = await asignarHackathonMiembro({
      equipoId: assignEquipoId,
      submissionId: assignSubmissionId,
      ronda: assignRonda === '2' ? 2 : 1,
    })
    setActionBusy(false)
    if (!res.ok) {
      setErr(res.error)
      return
    }
    await load()
  }

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

  async function handleQuitar(m: MiembroRow) {
    setActionBusy(true)
    setErr('')
    const res = await quitarHackathonMiembro({
      equipoId: m.equipo_id,
      submissionId: m.submission_id,
      ronda: m.ronda as 1 | 2,
    })
    setActionBusy(false)
    if (!res.ok) setErr(res.error)
    else await load()
  }

  const miembrosPorEquipo = equipos.map((eq) => ({
    equipo: eq,
    filas: miembros.filter((x) => x.equipo_id === eq.id),
  }))

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">Hackathon</h1>
            <p className="text-sm text-zinc-500">
              Inscripciones y equipos en vivo (Realtime + actualización cada 5s).
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

        <div className="flex gap-2 border-b border-zinc-200 pb-2">
          <button
            type="button"
            onClick={() => setTab('inscritos')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === 'inscritos'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <LayoutList className="h-4 w-4" />
            Inscritos
          </button>
          <button
            type="button"
            onClick={() => setTab('equipos')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === 'equipos'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Radio className="h-4 w-4" />
            Equipos en vivo
          </button>
        </div>

        {tab === 'inscritos' && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-zinc-200">
              <CardHeader className="pb-2">
                <p className="text-sm text-zinc-500">Total: {submissions.length}</p>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Badge</TableHead>
                      <TableHead>Nivel</TableHead>
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
                        <TableCell>{s.nivel_experiencia}</TableCell>
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
        )}

        {tab === 'equipos' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="border-zinc-200">
              <CardHeader>
                <h3 className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Nuevo equipo / asignar
                </h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <div className="flex flex-wrap items-end gap-3 border-b border-zinc-100 pb-4 sm:border-b-0 sm:pb-0">
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Nº equipo</label>
                    <input
                      className="mt-1 block h-9 w-24 rounded-md border border-zinc-200 px-2 text-sm"
                      value={nuevoEquipoNum}
                      onChange={(e) => setNuevoEquipoNum(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Cupos</label>
                    <input
                      className="mt-1 block h-9 w-24 rounded-md border border-zinc-200 px-2 text-sm"
                      value={nuevoEquipoCupos}
                      onChange={(e) => setNuevoEquipoCupos(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={actionBusy}
                    onClick={() => void handleCrearEquipo()}
                  >
                    Crear equipo
                  </Button>
                </div>
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1 min-w-[180px]">
                    <label className="text-xs font-medium text-zinc-500">Equipo</label>
                    <select
                      className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm"
                      value={assignEquipoId}
                      onChange={(e) => setAssignEquipoId(e.target.value)}
                    >
                      <option value="">—</option>
                      {equipos.map((e) => (
                        <option key={e.id} value={e.id}>
                          Equipo {e.numero}
                          {e.nombre ? ` · ${e.nombre}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <label className="text-xs font-medium text-zinc-500">Participante</label>
                    <select
                      className="mt-1 h-9 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm"
                      value={assignSubmissionId}
                      onChange={(e) => setAssignSubmissionId(e.target.value)}
                    >
                      <option value="">—</option>
                      {submissions.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nombre_completo} ({s.badge_id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500">Ronda</label>
                    <select
                      className="mt-1 h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm"
                      value={assignRonda}
                      onChange={(e) => setAssignRonda(e.target.value as '1' | '2')}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={actionBusy}
                    onClick={() => void handleAsignar()}
                  >
                    Asignar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {miembrosPorEquipo.map(({ equipo, filas }) => (
                <Card key={equipo.id} className="border-zinc-200">
                  <CardHeader className="flex flex-row items-center gap-2 pb-2">
                    <Users className="h-4 w-4 text-zinc-500" />
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900">
                        Equipo {equipo.numero}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Cupos {equipo.cupos_max} · {filas.length} asignados (mostrando todas las rondas)
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {filas.length === 0 ? (
                      <p className="text-sm text-zinc-500">Sin miembros.</p>
                    ) : (
                      <ul className="space-y-2">
                        {filas.map((m) => (
                          <li
                            key={`${m.equipo_id}-${m.submission_id}-${m.ronda}`}
                            className="flex items-center justify-between gap-2 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm"
                          >
                            <div>
                              <span className="font-medium text-zinc-900">
                                {m.hackaton_submissions?.nombre_completo ?? m.submission_id}
                              </span>
                              <span className="ml-2 text-xs text-zinc-500">
                                Ronda {m.ronda} · {m.hackaton_submissions?.badge_id}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              disabled={actionBusy}
                              onClick={() => void handleQuitar(m)}
                            >
                              Quitar
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              ))}
              {equipos.length === 0 && (
                <p className="text-sm text-zinc-500 md:col-span-2">
                  Crea al menos un equipo para comenzar a asignar participantes.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
