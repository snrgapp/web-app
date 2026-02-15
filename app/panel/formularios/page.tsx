'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Loader2,
  Plus,
  Trash2,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertCircle,
  Smile,
  ImageIcon,
  X,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/utils/supabase/client'
import {
  getAllFormsClient,
  createFormClient,
  updateFormClient,
  getSubmissionCountClient,
  deleteFormClient,
  type FormWithParsedFields,
  type FormInsertInput,
} from '@/lib/forms/form-repository-client'
import type { FormFieldConfig } from '@/types/form.types'
import type { Evento } from '@/types/database.types'

const BUCKET = 'formularios'
const SLUG_MAX_LENGTH = 20
const COVER_MIN_WIDTH = 1500
const COVER_MAX_SIZE_MB = 10

const FIELD_TYPES: { value: FormFieldConfig['type']; label: string }[] = [
  { value: 'text', label: 'Texto' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Teléfono' },
  { value: 'number', label: 'Número' },
  { value: 'textarea', label: 'Área de texto' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Opciones' },
  { value: 'checkbox', label: 'Checkboxes' },
  { value: 'date', label: 'Fecha' },
  { value: 'url', label: 'URL' },
]

function validateSlug(slug: string): string | null {
  const trimmed = slug.trim().toLowerCase()
  if (!trimmed) return 'El slug es obligatorio'
  if (trimmed.length > SLUG_MAX_LENGTH) return `Máximo ${SLUG_MAX_LENGTH} caracteres`
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(trimmed)) {
    return 'Solo letras minúsculas, números y guiones (ej: fh-2025)'
  }
  return null
}

export default function PanelFormulariosPage() {
  const [forms, setForms] = useState<FormWithParsedFields[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const [titulo, setTitulo] = useState('')
  const [slug, setSlug] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [coverError, setCoverError] = useState<string | null>(null)
  const [campos, setCampos] = useState<FormFieldConfig[]>([])
  const [brevoListId, setBrevoListId] = useState('')
  const [selectedEventoId, setSelectedEventoId] = useState<string>('')
  const [showCreator, setShowCreator] = useState(false)
  const [editingForm, setEditingForm] = useState<FormWithParsedFields | null>(null)
  const iconInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  async function fetchForms() {
    setLoading(true)
    const data = await getAllFormsClient()
    setForms(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchForms()
  }, [])

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('eventos')
      .select('*')
      .order('orden', { ascending: true })
      .order('created_at', { ascending: false })
      .then(({ data }) => setEventos(data ?? []))
  }, [])

  function handleIconChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      setIconFile(f)
      setIconPreview(URL.createObjectURL(f))
    }
    e.target.value = ''
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    setCoverError(null)
    if (!f) return
    if (f.size > COVER_MAX_SIZE_MB * 1024 * 1024) {
      setCoverError(`Máximo ${COVER_MAX_SIZE_MB}MB`)
      return
    }
    const img = new Image()
    img.onload = () => {
      const maxDim = Math.max(img.naturalWidth, img.naturalHeight)
      if (maxDim < COVER_MIN_WIDTH) {
        setCoverError(`Mínimo ${COVER_MIN_WIDTH}px (ancho o alto)`)
        return
      }
      setCoverFile(f)
      setCoverPreview(URL.createObjectURL(f))
    }
    img.onerror = () => setCoverError('No se pudo leer la imagen')
    img.src = URL.createObjectURL(f)
    e.target.value = ''
  }

  function clearIcon() {
    setIconFile(null)
    if (iconPreview) URL.revokeObjectURL(iconPreview)
    setIconPreview(null)
  }

  function clearCover() {
    setCoverFile(null)
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverPreview(null)
    setCoverError(null)
  }

  function addField() {
    setCampos([
      ...campos,
      {
        key: `campo_${campos.length + 1}`,
        label: 'Nuevo campo',
        type: 'text',
        required: false,
      },
    ])
  }

  function updateField(idx: number, patch: Partial<FormFieldConfig>) {
    setCampos(
      campos.map((c, i) => (i === idx ? { ...c, ...patch } : c))
    )
  }

  function removeField(idx: number) {
    setCampos(campos.filter((_, i) => i !== idx))
  }

  function startEdit(form: FormWithParsedFields) {
    setEditingForm(form)
    setTitulo(form.titulo)
    setSlug(form.slug)
    setDescripcion(form.descripcion ?? '')
    setCampos([...form.campos])
    setBrevoListId(form.brevo_list_id?.toString() ?? '')
    setSelectedEventoId(form.evento_id ?? '')
    setIconPreview(form.icon_url)
    setCoverPreview(form.cover_url)
    setIconFile(null)
    setCoverFile(null)
    setCoverError(null)
    setShowCreator(true)
    setStatus({ type: null, message: '' })
  }

  function cancelEdit() {
    setEditingForm(null)
    setTitulo('')
    setSlug('')
    setDescripcion('')
    setCampos([])
    setBrevoListId('')
    setSelectedEventoId('')
    clearIcon()
    clearCover()
    setShowCreator(false)
    setStatus({ type: null, message: '' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const slugErr = validateSlug(slug)
    if (slugErr || !titulo.trim()) {
      setStatus({
        type: 'error',
        message: slugErr ?? 'Título y slug son obligatorios.',
      })
      return
    }

    const trimmedSlug = slug.trim().toLowerCase()

    let iconUrl: string | null = null
    let coverUrl: string | null = null

    if (supabase) {
      if (iconFile) {
        const ext = iconFile.name.split('.').pop() ?? 'jpg'
        const path = `icons/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, iconFile, { upsert: false })
        if (uploadError) {
          setStatus({ type: 'error', message: `Ícono: ${uploadError.message}` })
          return
        }
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path)
        iconUrl = urlData.publicUrl
      }
      if (coverFile) {
        const ext = coverFile.name.split('.').pop() ?? 'jpg'
        const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, coverFile, { upsert: false })
        if (uploadError) {
          setStatus({ type: 'error', message: `Portada: ${uploadError.message}` })
          return
        }
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path)
        coverUrl = urlData.publicUrl
      }
    }

    const processedCampos = campos.map((c) => ({
      ...c,
      key: c.key.trim() || `field_${Math.random().toString(36).slice(2, 8)}`,
      label: c.label.trim() || c.key,
      options:
        (c.type === 'select' || c.type === 'radio' || c.type === 'checkbox') && c.options?.length
          ? c.options
          : undefined,
    }))

    setSaving(true)
    setStatus({ type: null, message: '' })

    if (editingForm) {
      // Modo edición
      const input: Partial<FormInsertInput> = {
        slug: trimmedSlug,
        titulo: titulo.trim(),
        evento_id: selectedEventoId || null,
        descripcion: descripcion.trim() || null,
        icon_url: iconUrl ?? editingForm.icon_url,
        cover_url: coverUrl ?? editingForm.cover_url,
        campos: processedCampos,
        brevo_list_id: brevoListId ? parseInt(brevoListId, 10) : null,
      }

      const result = await updateFormClient(editingForm.id, input)

      if (result.success) {
        setStatus({ type: 'success', message: 'Formulario actualizado correctamente.' })
        cancelEdit()
        fetchForms()
      } else {
        setStatus({
          type: 'error',
          message: result.error ?? 'Error al actualizar el formulario',
        })
      }
    } else {
      // Modo creación
      const input: FormInsertInput = {
        slug: trimmedSlug,
        titulo: titulo.trim(),
        evento_id: selectedEventoId || null,
        descripcion: descripcion.trim() || null,
        icon_url: iconUrl,
        cover_url: coverUrl,
        campos: processedCampos,
        brevo_list_id: brevoListId ? parseInt(brevoListId, 10) : null,
        activo: true,
      }

      const result = await createFormClient(input)

      if (result.success) {
        setStatus({ type: 'success', message: 'Formulario creado correctamente.' })
        setTitulo('')
        setSlug('')
        setDescripcion('')
        setBrevoListId('')
        setSelectedEventoId('')
        clearIcon()
        clearCover()
        setCampos([])
        setShowCreator(false)
        fetchForms()
      } else {
        setStatus({
          type: 'error',
          message: result.error ?? 'Error al crear el formulario',
        })
      }
    }
    setSaving(false)
  }

  // URL canónica de inscripciones. Usar NEXT_PUBLIC_INSCRIPCION_BASE_URL en Vercel si hace falta.
  const inscripcionBase =
    process.env.NEXT_PUBLIC_INSCRIPCION_BASE_URL ?? 'https://inscripcion.snrg.lat'

  return (
    <div className="pt-4 pr-4 pb-4 pl-2 lg:pt-6 lg:pr-6 lg:pb-6 lg:pl-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col w-full max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-light text-black tracking-tight">
            Formularios de inscripción
          </h1>
          <Button
            onClick={() => {
              if (showCreator) {
                cancelEdit()
              } else {
                setShowCreator(true)
              }
            }}
            className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
          >
            {showCreator ? (
              <>
                <X className="w-4 h-4" />
                Cancelar
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Nuevo formulario
              </>
            )}
          </Button>
        </div>

        {showCreator && (
          <form
            onSubmit={handleSubmit}
            className="mb-10 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6"
          >
            <h2 className="text-lg font-medium text-zinc-900 mb-4">
              {editingForm ? 'Editar formulario' : 'Crear formulario'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Título
                </label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Inscripción Founder House 2025"
                  className="rounded-xl bg-white border-zinc-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Slug (URL corto)
                </label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.slice(0, SLUG_MAX_LENGTH))}
                  placeholder="fh-2025"
                  maxLength={SLUG_MAX_LENGTH}
                  className="rounded-xl bg-white border-zinc-200 font-mono text-sm"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  Máx. {SLUG_MAX_LENGTH} caracteres. Ej: fh-2025, ev-mar24 · URL: {inscripcionBase}/{slug || '[slug]'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Evento vinculado (opcional)
                </label>
                <select
                  value={selectedEventoId}
                  onChange={(e) => setSelectedEventoId(e.target.value)}
                  className="w-full max-w-md h-10 rounded-xl border border-zinc-200 bg-white px-4 text-sm"
                >
                  <option value="">Ninguno</option>
                  {eventos.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.titulo ?? 'Sin título'} {ev.checkin_slug ? `(${ev.checkin_slug})` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-zinc-500 mt-1">
                  Vincula este formulario a un evento. Aparecerá como opción &quot;Registrarse&quot; en la página del evento.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Agregar ícono
                  </label>
                  <input
                    ref={iconInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIconChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => iconInputRef.current?.click()}
                    className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-white cursor-pointer hover:bg-zinc-50 transition-colors w-fit"
                  >
                    {iconPreview ? (
                      <>
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={iconPreview} alt="Ícono" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm text-zinc-700">Ícono seleccionado</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); clearIcon() }}
                          className="p-1 rounded text-zinc-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                          <Smile className="w-6 h-6 text-zinc-400" />
                        </div>
                        <span className="text-sm text-zinc-600">Agregar un ícono</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-2">
                    Agregar portada
                  </label>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-zinc-50 min-w-[200px] cursor-pointer hover:bg-zinc-100 transition-colors"
                  >
                    {coverPreview ? (
                      <>
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={coverPreview} alt="Portada" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-zinc-700 block truncate">Portada seleccionada</span>
                          <span className="text-xs text-zinc-500">Mín. 1500px · Máx. 10MB</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); clearCover() }}
                          className="p-1 rounded text-zinc-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-12 rounded-lg bg-zinc-200 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-8 h-8 text-zinc-400" />
                        </div>
                        <div>
                          <span className="text-sm text-zinc-600 block">Agregar portada</span>
                          <span className="text-xs text-zinc-500">Mín. 1500px · Máx. 10MB</span>
                          {coverError && <span className="text-xs text-red-600 block">{coverError}</span>}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Breve descripción del formulario. Los saltos de línea se respetarán."
                  className="flex min-h-[80px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Brevo List ID (opcional)
                </label>
                <Input
                  value={brevoListId}
                  onChange={(e) => setBrevoListId(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ej: 3"
                  className="rounded-xl bg-white border-zinc-200 font-mono text-sm w-32"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  ID numérico de la lista en Brevo. Los inscritos se añadirán automáticamente.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Campos
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addField}
                    className="rounded-lg"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar campo
                  </Button>
                </div>

                <div className="space-y-4">
                  {campos.map((campo, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-200 bg-white p-4 space-y-3"
                    >
                      <div className="flex gap-2 flex-wrap">
                        <Input
                          value={campo.key}
                          onChange={(e) =>
                            updateField(idx, {
                              key: e.target.value.replace(/\s/g, '_'),
                            })
                          }
                          placeholder="key (ej: nombre)"
                          className="rounded-lg bg-zinc-50 w-32 font-mono text-sm"
                        />
                        <Input
                          value={campo.label}
                          onChange={(e) =>
                            updateField(idx, { label: e.target.value })
                          }
                          placeholder="Etiqueta"
                          className="rounded-lg bg-zinc-50 flex-1 min-w-[120px]"
                        />
                        <select
                          value={campo.type}
                          onChange={(e) =>
                            updateField(idx, {
                              type: e.target
                                .value as FormFieldConfig['type'],
                            })
                          }
                          className="h-9 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm"
                        >
                          {FIELD_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                        <label className="flex items-center gap-1.5 text-sm">
                          <input
                            type="checkbox"
                            checked={campo.required ?? false}
                            onChange={(e) =>
                              updateField(idx, { required: e.target.checked })
                            }
                          />
                          Obligatorio
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeField(idx)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {(campo.type === 'select' ||
                        campo.type === 'radio' ||
                        campo.type === 'checkbox') && (
                        <div>
                          <Input
                            placeholder="Opciones: valor:Etiqueta (una por línea)"
                            className="rounded-lg bg-zinc-50 text-sm"
                            defaultValue={
                              campo.options
                                ?.map((o) => `${o.value}:${o.label}`)
                                .join('\n') ?? ''
                            }
                            onBlur={(e) => {
                              const lines = e.target.value.split('\n').filter(Boolean)
                              const options = lines.map((l) => {
                                const [value, ...rest] = l.split(':')
                                return {
                                  value: (value ?? '').trim(),
                                  label: rest.join(':').trim() || (value ?? ''),
                                }
                              })
                              updateField(idx, { options })
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingForm ? (
                  'Guardar cambios'
                ) : (
                  'Crear formulario'
                )}
              </Button>
            </div>
          </form>
        )}

        {status.type && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl text-sm mb-6 ${
              status.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            {status.message}
          </div>
        )}

        <h2 className="text-lg font-light text-black tracking-tight mb-4">
          Formularios creados
        </h2>
        {loading ? (
          <div className="flex gap-2 text-zinc-500 py-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            Cargando...
          </div>
        ) : forms.length === 0 ? (
          <p className="text-zinc-500 py-8">
            No hay formularios. Crea uno para empezar.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
            {forms.map((form) => (
              <FormListItem
                key={form.id}
                form={form}
                eventos={eventos}
                inscripcionBase={inscripcionBase}
                onRefresh={fetchForms}
                onEdit={startEdit}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

function FormListItem({
  form,
  eventos,
  inscripcionBase,
  onRefresh,
  onEdit,
}: {
  form: FormWithParsedFields
  eventos: Evento[]
  inscripcionBase: string
  onRefresh: () => void
  onEdit: (form: FormWithParsedFields) => void
}) {
  const [count, setCount] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const url = `${inscripcionBase}/${form.slug}`

  useEffect(() => {
    getSubmissionCountClient(form.id).then(setCount)
  }, [form.id])

  function copyUrl() {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar el formulario "${form.titulo}"? Se borrarán también todas las inscripciones.`)) return
    setDeleting(true)
    const result = await deleteFormClient(form.id)
    setDeleting(false)
    if (result.success) {
      onRefresh()
    } else {
      alert(result.error ?? 'Error al eliminar el formulario')
    }
  }

  return (
    <div className="flex flex-col rounded-xl border border-[#FFE100]/30 bg-[#FFFBEB] overflow-hidden">
      <div className="p-4 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-zinc-900 truncate">{form.titulo}</p>
            <p className="text-sm text-zinc-500 font-mono mt-0.5 truncate">{form.slug}</p>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Eliminar formulario"
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-zinc-400 mt-2">
          {form.campos.length} campo(s)
          {count !== null && ` · ${count} inscripción(es)`}
          {form.evento_id && (
            <>
              {' · '}
              {eventos.find((e) => e.id === form.evento_id)?.titulo ?? eventos.find((e) => e.id === form.evento_id)?.checkin_slug ?? 'Evento'}
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(form)}
            className="rounded-lg text-xs h-8"
            title="Editar formulario"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copyUrl}
            className="rounded-lg text-xs h-8"
          >
            {copied ? (
              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            Copiar
          </Button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline h-8 px-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Abrir
          </a>
        </div>
      </div>
    </div>
  )
}
