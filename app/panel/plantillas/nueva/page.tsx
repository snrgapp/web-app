'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  listExperienceTemplatesAction,
  provisionTenantExperienceAction,
} from '@/app/actions/tenant-experience'
import type { ExperienceTemplate } from '@/types/database.types'

function WizardInner() {
  const searchParams = useSearchParams()
  const preTemplateId = searchParams.get('templateId') ?? ''

  const [templates, setTemplates] = useState<ExperienceTemplate[]>([])
  const [templateId, setTemplateId] = useState(preTemplateId)
  const [eventTitle, setEventTitle] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    inscripcionUrl: string
    expUrl: string
  } | null>(null)

  useEffect(() => {
    void (async () => {
      const t = await listExperienceTemplatesAction()
      setTemplates(t)
      setLoading(false)
      if (preTemplateId && t.some((x) => x.id === preTemplateId)) {
        setTemplateId(preTemplateId)
      } else if (t[0]) {
        setTemplateId(t[0].id)
      }
    })()
  }, [preTemplateId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setResult(null)
    const r = await provisionTenantExperienceAction({
      templateId,
      eventTitle,
      formSlug,
      publish,
    })
    setSubmitting(false)
    if (r.ok) {
      setResult({ inscripcionUrl: r.inscripcionUrl, expUrl: r.expUrl })
    } else setError(r.error)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 text-zinc-500 py-24">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando…
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg mx-auto space-y-6"
    >
      <Link
        href="/panel/plantillas"
        className="inline-flex items-center gap-1 text-sm text-zinc-600 hover:text-black"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Link>
      <div>
        <h1 className="text-2xl font-light text-black tracking-tight">Nueva experiencia</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Formulario PaaS y experiencia con rutas /inscripcion-exp y /exp (sin tablas eventos/forms legacy).
        </p>
      </div>

      {result && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900 space-y-2">
          <p className="font-medium">Listo</p>
          <p>
            Inscripción:{' '}
            <a href={result.inscripcionUrl} className="underline break-all" target="_blank" rel="noreferrer">
              {result.inscripcionUrl}
            </a>
          </p>
          <p>
            Experiencia (networking):{' '}
            <a href={result.expUrl} className="underline break-all" target="_blank" rel="noreferrer">
              {result.expUrl}
            </a>
          </p>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/panel/plantillas">Ver listado</Link>
          </Button>
        </div>
      )}

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <label className="block space-y-1 text-xs text-zinc-600">
          Plantilla
          <select
            className="w-full h-10 rounded-md border border-zinc-200 px-3 text-sm bg-white"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            required
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1 text-xs text-zinc-600">
          Nombre del evento
          <Input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} required placeholder="Mi evento 2026" />
        </label>
        <label className="block space-y-1 text-xs text-zinc-600">
          Slug del formulario (URL)
          <Input
            value={formSlug}
            onChange={(e) => setFormSlug(e.target.value)}
            required
            placeholder="mi-evento-2026"
            className="font-mono text-sm"
          />
          <span className="text-[10px] text-zinc-400">Solo letras minúsculas, números y guiones. También se usa como check-in slug.</span>
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-700 cursor-pointer">
          <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
          Publicar y marcar como experiencia activa en ajustes de la org
        </label>
        <Button type="submit" disabled={submitting || !templateId} className="w-full sm:w-auto">
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creando…
            </>
          ) : (
            'Crear experiencia'
          )}
        </Button>
      </form>
    </motion.div>
  )
}

export default function PanelPlantillasNuevaPage() {
  return (
    <div className="pt-4 pr-4 pb-4 pl-2 lg:pt-6 lg:pr-6 lg:pb-6 lg:pl-2">
      <Suspense
        fallback={
          <div className="flex justify-center py-24 text-zinc-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        }
      >
        <WizardInner />
      </Suspense>
    </div>
  )
}
