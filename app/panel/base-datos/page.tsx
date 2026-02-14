'use client'

import { useState, useEffect, useRef } from 'react'
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
import type { Asistente } from '@/types/database.types'
import type { FormFieldConfig } from '@/types/form.types'

const headers = [
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

export default function BaseDatosPage() {
  const [asistentes, setAsistentes] = useState<Asistente[]>([])
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

  async function fetchAsistentes() {
    setLoading(true)
    if (!supabase) {
      setUploadStatus({ type: 'error', message: 'Supabase no configurado. Añade NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local' })
      setAsistentes([])
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('asistentes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setUploadStatus({ type: 'error', message: error.message })
      setAsistentes([])
    } else {
      setAsistentes(data ?? [])
      setUploadStatus({ type: null, message: '' })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAsistentes()
  }, [])

  useEffect(() => {
    getAllFormsClient().then(setForms)
  }, [])

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

      const BATCH_SIZE = 100
      let inserted = 0
      let failed = 0

      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE)
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
          message: `Se importaron ${inserted} asistentes correctamente.`,
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
            BASE DE DATOS
          </p>
          <h1 className="text-2xl sm:text-3xl font-hero text-black">
            Base de Datos
          </h1>
          <p className="mt-2 text-zinc-500">
            Importa asistentes desde un archivo CSV para llenar la base de datos.
          </p>
        </div>

        <Card className="w-full mb-6 overflow-hidden shadow-sm border-2 border-dashed border-zinc-200 hover:border-neon-lime/50 transition-colors">
          <CardContent className="p-6 sm:p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
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
                El CSV debe tener columnas: Nombre, Apellido, Teléfono, Correo, Empresa, Sector, Soluciones, Desafíos, Mesa, Código de mesa, Mesa ronda 2 (opcional)
              </p>
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

        <Card className="w-full overflow-hidden shadow-sm">
          <CardContent className="p-6 sm:p-8">
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
                  ) : asistentes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={headers.length}
                        className="px-4 py-8 text-center text-zinc-500"
                      >
                        No hay asistentes. Sube un archivo CSV para importar datos.
                      </TableCell>
                    </TableRow>
                  ) : (
                    asistentes.map((asistente) => (
                      <TableRow key={asistente.id} className="hover:bg-zinc-50/50">
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
        <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Inscripciones de formularios
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Respuestas enviadas desde los formularios de inscripción.
        </p>
      </div>

      <Card className="w-full overflow-hidden shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-700 mb-2">
              Seleccionar formulario
            </label>
            <select
              value={selectedFormId}
              onChange={(e) => setSelectedFormId(e.target.value)}
              className="w-full max-w-md h-10 rounded-lg border border-zinc-200 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
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
