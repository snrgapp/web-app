'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, Loader2, CheckCircle, AlertCircle, FileText, Download } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import Papa from 'papaparse'
import { parseCsvToAsistentes } from '@/lib/csv-parser'
import {
  getAllFormsClient,
  getSubmissionsByFormIdClient,
  type FormWithParsedFields,
  type FormSubmissionWithForm,
} from '@/lib/forms/form-repository-client'
import type { Asistente, Evento } from '@/types/database.types'
import type { FormFieldConfig } from '@/types/form.types'
import { useOrgId } from '@/components/panel/OrgProvider'

const headers = [
  'Evento',
  'Nombre',
  'Apellido',
  'Teléfono',
  'Correo',
  'Empresa',
  'Sector',
  'Soluciones',
  'Desafíos',
  'Mesa',
  'Código de mesa',
  'Mesa ronda 2',
]

type AsistenteConEvento = Asistente & { eventos?: { titulo: string | null; checkin_slug: string | null } | null }

export default function BaseDatosPage() {
  const orgId = useOrgId()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [selectedEventoId, setSelectedEventoId] = useState<string>('')
  const [filterEventoId, setFilterEventoId] = useState<string>('')
  const [asistentes, setAsistentes] = useState<AsistenteConEvento[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Inscripciones de formularios
  const [forms, setForms] = useState<FormWithParsedFields[]>([])
  const [selectedFormId, setSelectedFormId] = useState<string>('')
  const [submissions, setSubmissions] = useState<FormSubmissionWithForm[]>([])
  const [submissionsLoading, setSubmissionsLoading] = useState(false)

  const fetchEventos = useCallback(async () => {
    if (!supabase || !orgId) return
    const { data } = await supabase
      .from('eventos')
      .select('*')
      .eq('organizacion_id', orgId)
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false })
    setEventos(data ?? [])
  }, [orgId])

  const fetchAsistentes = useCallback(async () => {
    setLoading(true)
    if (!supabase || !orgId) {
      setUploadStatus({ type: 'error', message: 'Supabase no configurado. Añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local' })
      setAsistentes([])
      setLoading(false)
      return
    }
    const { data: eventosData } = await supabase.from('eventos').select('id').eq('organizacion_id', orgId)
    const eventoIds = (eventosData ?? []).map((e) => e.id)
    let asistentesQuery = supabase.from('asistentes').select('*').order('created_at', { ascending: false })
    if (eventoIds.length > 0) {
      asistentesQuery = asistentesQuery.or(`evento_id.in.(${eventoIds.join(',')}),evento_id.is.null`)
    }
    const { data: asistentesRows, error: asistentesError } = await asistentesQuery

    if (asistentesError) {
      setUploadStatus({ type: 'error', message: asistentesError.message })
      setAsistentes([])
      setLoading(false)
      return
    }

    const { data: eventosForMap } = await supabase
      .from('eventos')
      .select('id, titulo, checkin_slug')
      .eq('organizacion_id', orgId)

    const eventosMap = new Map(
      (eventosForMap ?? []).map((e) => [e.id, { titulo: e.titulo, checkin_slug: e.checkin_slug }])
    )

    const asistentesConEvento: AsistenteConEvento[] = (asistentesRows ?? []).map((a: AsistenteConEvento) => ({
      ...a,
      eventos: a.evento_id ? (eventosMap.get(a.evento_id) ?? null) : null,
    }))

    setAsistentes(asistentesConEvento)
    setUploadStatus({ type: null, message: '' })
    setLoading(false)
  }, [orgId])

  useEffect(() => {
    fetchEventos()
  }, [fetchEventos])

  useEffect(() => {
    fetchAsistentes()
  }, [fetchAsistentes])

  useEffect(() => {
    if (!orgId) return
    getAllFormsClient(orgId).then(setForms)
  }, [orgId])

  useEffect(() => {
    if (!selectedFormId) {
      setSubmissions([])
      return
    }
    setSubmissionsLoading(true)
    getSubmissionsByFormIdClient(selectedFormId).then((data) => {
      setSubmissions(data)
      setSubmissionsLoading(false)
    })
  }, [selectedFormId])

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!selectedEventoId) {
      setUploadStatus({ type: 'error', message: 'Selecciona un evento antes de importar' })
      return
    }

    if (!file.name.endsWith('.csv')) {
      setUploadStatus({ type: 'error', message: 'Solo se permiten archivos CSV' })
      return
    }

    setUploading(true)
    setUploadStatus({ type: null, message: '' })

    try {
      const text = await file.text()
      const rows = parseCsvToAsistentes(text)

      if (rows.length === 0) {
        setUploadStatus({ type: 'error', message: 'El CSV no contiene datos válidos' })
        setUploading(false)
        return
      }

      if (!supabase) {
        throw new Error('Supabase no está configurado. Revisa las variables de entorno.')
      }

      const { error: deleteError } = await supabase
        .from('asistentes')
        .delete()
        .eq('evento_id', selectedEventoId)

      if (deleteError) {
        console.warn('No se pudieron eliminar asistentes previos:', deleteError)
      }

      const BATCH_SIZE = 100
      let inserted = 0
      let failed = 0

      const rowsWithEvento = rows.map((row) => ({ ...row, evento_id: selectedEventoId }))

      for (let i = 0; i < rowsWithEvento.length; i += BATCH_SIZE) {
        const batch = rowsWithEvento.slice(i, i + BATCH_SIZE)
        const { error } = await supabase.from('asistentes').insert(batch)

        if (error) {
          failed += batch.length
          console.error('Error insertando batch:', error)
        } else {
          inserted += batch.length
        }
      }

      if (failed > 0) {
        setUploadStatus({
          type: 'error',
          message: `Se insertaron ${inserted} registros. Fallaron ${failed}.`,
        })
      } else {
        setUploadStatus({
          type: 'success',
          message: `Se importaron ${inserted} asistentes correctamente al evento seleccionado.`,
        })
      }

      await fetchAsistentes()
    } catch (err) {
      setUploadStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Error al procesar el archivo',
      })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const filteredAsistentes = filterEventoId
    ? asistentes.filter((a) => a.evento_id === filterEventoId)
    : asistentes

  function exportAsistentesCsv() {
    const ev = filterEventoId ? eventos.find((e) => e.id === filterEventoId) : null
    const toExport = filteredAsistentes
    const csvHeaders = ['Evento', ...headers.slice(1)]
    const csvRows = toExport.map((a) => ({
      Evento: (a.eventos as { titulo?: string } | null)?.titulo ?? a.evento_id ?? '-',
      Nombre: a.nombre ?? '',
      Apellido: a.apellido ?? '',
      Teléfono: a.telefono ?? '',
      Correo: a.correo ?? '',
      Empresa: a.empresa ?? '',
      Sector: a.sector ?? '',
      Soluciones: a.soluciones ?? '',
      Desafíos: a.desafios ?? '',
      Mesa: a.mesa ?? '',
      'Código de mesa': a.codigo_mesa ?? '',
      'Mesa ronda 2': a.mesa_ronda2 ?? '',
    }))
    const csv = Papa.unparse({ fields: csvHeaders, data: csvRows })
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `asistentes${ev ? `-${ev.checkin_slug ?? ev.titulo ?? ev.id}` : ''}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="pt-4 pr-4 pb-4 pl-2 lg:pt-6 lg:pr-6 lg:pb-6 lg:pl-2 min-w-0 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center w-full max-w-7xl mx-auto min-w-0"
      >
        <div className="w-full mb-6">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
            BASE DE DATOS
          </p>
          <h1 className="text-2xl sm:text-3xl font-light text-black tracking-tight">
            Base de Datos
          </h1>
          <p className="mt-2 text-zinc-500">
            Importa asistentes desde un archivo CSV para llenar la base de datos.
          </p>
        </div>

        <Card className="w-full min-w-0 mb-6 overflow-hidden shadow-sm border-2 border-dashed border-zinc-200 hover:border-neon-lime/50 transition-colors">
          <CardContent className="p-6 sm:p-8 min-w-0 overflow-hidden">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col gap-4">
              <div className="min-w-0 w-full overflow-hidden">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Evento destino (obligatorio para importar)
                </label>
                <select
                  value={selectedEventoId}
                  onChange={(e) => setSelectedEventoId(e.target.value)}
                  className="w-full max-w-full sm:max-w-md h-9 sm:h-10 rounded-lg border border-zinc-200 bg-white px-3 sm:px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 min-w-0 box-border"
                >
                  <option value="">-- Seleccionar evento --</option>
                  {eventos.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.titulo ?? 'Sin título'} {ev.checkin_slug ? `(${ev.checkin_slug})` : ''}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-zinc-500">
                  Los asistentes existentes del evento serán reemplazados por el CSV
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || !selectedEventoId}
                  className="bg-pure-dark hover:bg-zinc-800 text-white gap-2"
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? 'Importando...' : 'Subir archivo CSV'}
                </Button>
                <p className="text-sm text-zinc-500">
                  Columnas: Nombre, Apellido, Teléfono, Correo, Empresa, Sector, Soluciones, Desafíos, Mesa, Código de mesa, Mesa ronda 2 (opcional)
                </p>
              </div>
            </div>
            {uploadStatus.type && (
              <div
                className={`mt-4 flex items-center gap-2 p-3 rounded-lg text-sm ${
                  uploadStatus.type === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {uploadStatus.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                )}
                {uploadStatus.message}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full min-w-0 overflow-hidden shadow-sm">
          <CardContent className="p-6 sm:p-8 min-w-0 overflow-hidden">
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1 sm:flex-initial sm:min-w-[200px] overflow-hidden">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Filtrar por evento</label>
                <select
                  value={filterEventoId}
                  onChange={(e) => setFilterEventoId(e.target.value)}
                  className="w-full sm:w-auto sm:min-w-[200px] h-9 sm:h-10 rounded-lg border border-zinc-200 bg-white px-3 sm:px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 min-w-0"
                >
                  <option value="">Todos los eventos</option>
                  {eventos.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.titulo ?? ev.checkin_slug ?? ev.id}
                    </option>
                  ))}
                </select>
              </div>
              {filteredAsistentes.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={exportAsistentesCsv}
                  className="gap-2 self-end"
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
                    {headers.map((header) => (
                      <TableHead
                        key={header}
                        className="px-4 py-3 text-zinc-600 font-medium whitespace-nowrap"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={headers.length}
                        className="px-4 py-8 text-center text-zinc-500"
                      >
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Cargando...
                      </TableCell>
                    </TableRow>
                  ) : filteredAsistentes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={headers.length}
                        className="px-4 py-8 text-center text-zinc-500"
                      >
                        {filterEventoId
                          ? 'No hay asistentes en este evento.'
                          : 'No hay asistentes. Selecciona un evento y sube un archivo CSV.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAsistentes.map((asistente) => (
                      <TableRow key={asistente.id} className="hover:bg-zinc-50/50">
                        <TableCell className="px-4 py-3 text-zinc-600 text-sm">
                          {(asistente.eventos as { titulo?: string } | null)?.titulo ?? asistente.evento_id ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-900">
                          {asistente.nombre ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-900">
                          {asistente.apellido ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-600">
                          {asistente.telefono ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-600">
                          {asistente.correo ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-900">
                          {asistente.empresa ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-600">
                          {asistente.sector ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-600">
                          {asistente.soluciones ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-600">
                          {asistente.desafios ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-900">
                          {asistente.mesa ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-600 font-mono text-sm">
                          {asistente.codigo_mesa ?? '-'}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-zinc-600">
                          {asistente.mesa_ronda2 ?? '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <InscripcionesSection
          forms={forms}
          selectedFormId={selectedFormId}
          setSelectedFormId={setSelectedFormId}
          submissions={submissions}
          submissionsLoading={submissionsLoading}
        />
      </motion.div>
    </div>
  )
}

function exportSubmissionsToCsv(
  submissions: FormSubmissionWithForm[],
  form: FormWithParsedFields
) {
  const headers = ['Fecha', ...form.campos.map((c) => c.label)]
  const rows = submissions.map((sub) => {
    const row: Record<string, string> = {
      Fecha: new Date(sub.created_at).toLocaleString('es-CO', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    }
    form.campos.forEach((campo) => {
      row[campo.label] = formatSubmissionValue(sub.datos[campo.key])
    })
    return row
  })
  const csv = Papa.unparse({ fields: headers, data: rows })
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `inscripciones-${form.slug}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function formatSubmissionValue(value: unknown): string {
  if (value === null || value === undefined) return '-'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  return String(value)
}

function InscripcionesSection({
  forms,
  selectedFormId,
  setSelectedFormId,
  submissions,
  submissionsLoading,
}: {
  forms: FormWithParsedFields[]
  selectedFormId: string
  setSelectedFormId: (id: string) => void
  submissions: FormSubmissionWithForm[]
  submissionsLoading: boolean
}) {
  const selectedForm = forms.find((f) => f.id === selectedFormId)
  const colsCount = (selectedForm?.campos?.length ?? 0) + 1

  return (
    <div className="w-full mt-10">
      <div className="mb-4">
        <h2 className="text-xl font-light text-black tracking-tight flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Inscripciones de formularios
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Respuestas enviadas desde los formularios de inscripción.
        </p>
      </div>

      <Card className="w-full min-w-0 overflow-hidden shadow-sm">
        <CardContent className="p-6 sm:p-8 min-w-0 overflow-hidden">
          <div className="mb-4 min-w-0 overflow-hidden">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Seleccionar formulario
            </label>
            <select
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              className="w-full max-w-full sm:max-w-md h-9 sm:h-10 rounded-lg border border-zinc-200 bg-white px-3 sm:px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 min-w-0"
            >
              <option value="">-- Elegir formulario --</option>
              {forms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.titulo} ({f.slug})
                </option>
              ))}
            </select>
          </div>

          {selectedFormId && (
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                    <TableHead className="px-4 py-3 text-zinc-600 font-medium whitespace-nowrap">
                      Fecha
                    </TableHead>
                    {(selectedForm?.campos ?? []).map((campo: FormFieldConfig) => (
                      <TableHead
                        key={campo.key}
                        className="px-4 py-3 text-zinc-600 font-medium whitespace-nowrap"
                      >
                        {campo.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionsLoading ? (
                    <TableRow>
                      <TableCell colSpan={colsCount} className="px-4 py-8 text-center text-zinc-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        Cargando inscripciones...
                      </TableCell>
                    </TableRow>
                  ) : submissions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={colsCount} className="px-4 py-8 text-center text-zinc-500">
                        No hay inscripciones en este formulario.
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions.map((sub) => (
                      <TableRow key={sub.id} className="hover:bg-zinc-50/50">
                        <TableCell className="px-4 py-3 text-zinc-500 text-sm whitespace-nowrap">
                          {new Date(sub.created_at).toLocaleString('es-CO', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </TableCell>
                        {(selectedForm?.campos ?? []).map((campo: FormFieldConfig) => (
                          <TableCell
                            key={campo.key}
                            className="px-4 py-3 text-zinc-900 max-w-[200px] truncate"
                            title={formatSubmissionValue(sub.datos[campo.key])}
                          >
                            {formatSubmissionValue(sub.datos[campo.key]) ?? '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {selectedFormId && !submissionsLoading && submissions.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <p className="text-sm text-zinc-500">
                Total: {submissions.length} inscripción(es)
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  selectedForm && exportSubmissionsToCsv(submissions, selectedForm)
                }
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
