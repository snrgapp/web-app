'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  FileEdit,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  listExperienceFormsForPanelAction,
  updateExperienceFormCamposAction,
} from '@/app/actions/experience-forms'
import type { FormFieldConfig, FormFieldType } from '@/types/form.types'
import type { ExperienceFormWithFields } from '@/lib/experience-forms/repository'
import { PAAS_RESERVED_FIELD_KEYS } from '@/lib/experience-forms/paas-default-fields'

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: 'text', label: 'Texto corto' },
  { value: 'textarea', label: 'Texto largo' },
  { value: 'email', label: 'Correo' },
  { value: 'tel', label: 'Teléfono' },
  { value: 'number', label: 'Número' },
  { value: 'select', label: 'Lista desplegable' },
  { value: 'radio', label: 'Opción única' },
  { value: 'checkbox', label: 'Varias opciones' },
  { value: 'date', label: 'Fecha' },
  { value: 'url', label: 'URL' },
]

function reservedSlugError(key: string): string | null {
  if (PAAS_RESERVED_FIELD_KEYS.has(key.trim())) {
    return `«${key}» es un campo de contacto automático; elige otra clave.`
  }
  return null
}

function slugKey(label: string, existingKeys: Set<string>): string {
  let base = label
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 48)
  if (!base) base = 'pregunta'
  let k = base
  let n = 0
  while (existingKeys.has(k) || PAAS_RESERVED_FIELD_KEYS.has(k)) {
    n += 1
    k = `${base}_${n}`
  }
  return k
}

function parseOptionsText(raw: string): Array<{ value: string; label: string }> {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const colon = line.indexOf(':')
      if (colon === -1) {
        const v = line.toLowerCase().replace(/\s+/g, '_')
        return { value: v, label: line }
      }
      const value = line.slice(0, colon).trim()
      const label = line.slice(colon + 1).trim() || value
      return { value, label }
    })
}

function optionsToText(opts?: Array<{ value: string; label: string }>): string {
  if (!opts?.length) return 'opcion_1:Opción 1\nopcion_2:Opción 2'
  return opts.map((o) => `${o.value}:${o.label}`).join('\n')
}

export default function PanelFormularioPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [forms, setForms] = useState<ExperienceFormWithFields[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [campos, setCampos] = useState<FormFieldConfig[]>([])
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const list = await listExperienceFormsForPanelAction()
    setForms(list)
    setLoading(false)
    return list
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (forms.length > 0 && !selectedId) {
      setSelectedId(forms[0].id)
    }
  }, [forms, selectedId])

  useEffect(() => {
    const f = forms.find((x) => x.id === selectedId)
    if (f) setCampos(f.campos ?? [])
  }, [selectedId, forms])

  async function handleSave() {
    if (!selectedId) return
    const keys = new Set<string>()
    for (const c of campos) {
      const k = c.key.trim()
      if (!k) {
        setMsg('Cada pregunta necesita una clave interna.')
        return
      }
      if (keys.has(k)) {
        setMsg(`Clave duplicada: ${k}`)
        return
      }
      keys.add(k)
      const reserved = reservedSlugError(k)
      if (reserved) {
        setMsg(reserved)
        return
      }
    }
    setSaving(true)
    setMsg(null)
    const r = await updateExperienceFormCamposAction(selectedId, campos)
    setSaving(false)
    if (r.ok) {
      setMsg('Preguntas guardadas.')
      void load()
    } else setMsg(r.error)
  }

  function addQuestion() {
    const existing = new Set(campos.map((c) => c.key))
    const label = 'Nueva pregunta'
    const key = slugKey(label, existing)
    setCampos((prev) => [
      ...prev,
      {
        key,
        label,
        type: 'text',
        required: false,
        placeholder: '',
      },
    ])
  }

  function removeAt(i: number) {
    setCampos((prev) => prev.filter((_, j) => j !== i))
  }

  function move(i: number, dir: -1 | 1) {
    setCampos((prev) => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const copy = [...prev]
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy
    })
  }

  function updateField(i: number, patch: Partial<FormFieldConfig>) {
    setCampos((prev) => {
      const copy = [...prev]
      const cur = { ...copy[i], ...patch }
      if (patch.type !== undefined) {
        const needsOpts =
          patch.type === 'select' || patch.type === 'radio' || patch.type === 'checkbox'
        if (needsOpts && (!cur.options || cur.options.length === 0)) {
          cur.options = parseOptionsText(optionsToText())
        }
        if (!needsOpts) delete cur.options
      }
      copy[i] = cur
      return copy
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-zinc-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Cargando formularios…
      </div>
    )
  }

  return (
    <div className="pl-2 pr-4 pb-4 pt-4 lg:pl-2 lg:pr-6 lg:pb-6 lg:pt-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl space-y-8"
      >
        <div>
          <Link
            href="/panel/plantillas"
            className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Plantillas
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-light tracking-tight text-black">
            <FileEdit className="h-7 w-7 text-zinc-700" />
            Formulario
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            La primera pantalla pública siempre pide nombre, apellido, WhatsApp y correo. Aquí defines las
            preguntas adicionales (una por paso) para la inscripción PaaS.
          </p>
        </div>

        {forms.length === 0 ? (
          <p className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
            No hay formularios PaaS. Crea una experiencia desde{' '}
            <Link href="/panel/plantillas/nueva" className="underline">
              Nueva experiencia
            </Link>
            .
          </p>
        ) : (
          <>
            <label className="block space-y-1 text-xs text-zinc-600">
              Formulario a editar
              <select
                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {forms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.titulo} ({f.slug})
                  </option>
                ))}
              </select>
            </label>

            {msg && (
              <p
                className={`text-sm ${msg.includes('guardad') ? 'text-green-700' : 'text-red-600'}`}
              >
                {msg}
              </p>
            )}

            <div className="space-y-4">
              {campos.map((field, i) => {
                const needsOptions =
                  field.type === 'select' || field.type === 'radio' || field.type === 'checkbox'
                return (
                  <div
                    key={`${field.key}-${i}`}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm space-y-3"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-zinc-400">Paso {i + 2}</span>
                      <div className="ml-auto flex gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          disabled={i === 0}
                          onClick={() => move(i, -1)}
                          aria-label="Subir"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          disabled={i === campos.length - 1}
                          onClick={() => move(i, 1)}
                          aria-label="Bajar"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => removeAt(i)}
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1 text-xs text-zinc-600">
                        Etiqueta (visible)
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(i, { label: e.target.value })}
                        />
                      </label>
                      <label className="space-y-1 text-xs text-zinc-600">
                        Clave interna
                        <Input
                          value={field.key}
                          onChange={(e) => updateField(i, { key: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </label>
                      <label className="space-y-1 text-xs text-zinc-600">
                        Tipo
                        <select
                          className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm"
                          value={field.type}
                          onChange={(e) =>
                            updateField(i, { type: e.target.value as FormFieldType })
                          }
                        >
                          {FIELD_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex items-center gap-2 pt-6 text-sm text-zinc-700">
                        <input
                          type="checkbox"
                          checked={field.required ?? false}
                          onChange={(e) => updateField(i, { required: e.target.checked })}
                        />
                        Obligatorio
                      </label>
                    </div>
                    <label className="block space-y-1 text-xs text-zinc-600">
                      Placeholder (opcional)
                      <Input
                        value={field.placeholder ?? ''}
                        onChange={(e) => updateField(i, { placeholder: e.target.value })}
                      />
                    </label>
                    {needsOptions && (
                      <label className="block space-y-1 text-xs text-zinc-600">
                        Opciones por línea: <code className="text-[10px]">valor:Etiqueta visible</code>
                        <textarea
                          className="min-h-[88px] w-full rounded-md border border-zinc-200 px-3 py-2 font-mono text-xs"
                          value={optionsToText(field.options)}
                          onChange={(e) =>
                            updateField(i, { options: parseOptionsText(e.target.value) })
                          }
                        />
                      </label>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={addQuestion}>
                <Plus className="mr-1 h-4 w-4" />
                Añadir pregunta
              </Button>
              <Button type="button" disabled={saving || !selectedId} onClick={() => void handleSave()}>
                {saving ? (
                  <>
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    Guardando…
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}
