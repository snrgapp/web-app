'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutTemplate, Loader2, ExternalLink, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  listExperienceTemplatesAction,
  listTenantExperiencesAction,
  updateTenantExperienceStatusAction,
  type TenantExperienceRow,
} from '@/app/actions/tenant-experience'
import type { ExperienceTemplate } from '@/types/database.types'
import { absoluteUrl } from '@/lib/site'

export default function PanelPlantillasPage() {
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState<ExperienceTemplate[]>([])
  const [instances, setInstances] = useState<TenantExperienceRow[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [t, i] = await Promise.all([listExperienceTemplatesAction(), listTenantExperiencesAction()])
    setTemplates(t)
    setInstances(i)
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function setStatus(id: string, status: 'draft' | 'published' | 'archived') {
    setBusyId(id)
    setMsg(null)
    const r = await updateTenantExperienceStatusAction(id, status)
    setBusyId(null)
    if (r.ok) {
      setMsg('Estado actualizado.')
      void load()
    } else setMsg(r.error)
  }

  if (loading) {
    return (
      <div className="pt-4 pr-4 pb-4 pl-2 lg:pt-6 lg:pr-6 lg:pb-6 lg:pl-2 flex items-center justify-center gap-2 text-zinc-500 py-24">
        <Loader2 className="w-5 h-5 animate-spin" />
        Cargando plantillas…
      </div>
    )
  }

  return (
    <div className="pt-4 pr-4 pb-4 pl-2 lg:pt-6 lg:pr-6 lg:pb-6 lg:pl-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-light text-black tracking-tight flex items-center gap-2">
              <LayoutTemplate className="w-7 h-7 text-zinc-700" />
              Plantillas de experiencia
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Crea evento + formulario desde un preset (PaaS). Ejecuta la migración SQL 051 si aún no existe el catálogo.
            </p>
          </div>
          <Button asChild>
            <Link href="/panel/plantillas/nueva" className="inline-flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Nueva experiencia
            </Link>
          </Button>
        </div>

        {msg && (
          <p className={`text-sm ${msg.includes('actualizado') ? 'text-green-700' : 'text-red-600'}`}>{msg}</p>
        )}

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">Catálogo</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((tm) => (
              <div
                key={tm.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm flex flex-col gap-2"
              >
                <p className="font-medium text-zinc-900">{tm.label}</p>
                <p className="text-xs text-zinc-500 line-clamp-3">{tm.description}</p>
                <p className="text-[10px] font-mono text-zinc-400">{tm.key}</p>
                <Button variant="outline" size="sm" className="mt-auto w-full" asChild>
                  <Link href={`/panel/plantillas/nueva?templateId=${encodeURIComponent(tm.id)}`}>Usar plantilla</Link>
                </Button>
              </div>
            ))}
          </div>
          {templates.length === 0 && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg p-4">
              No hay plantillas en la base de datos. Aplica{' '}
              <code className="font-mono text-xs">supabase/migrations/051_experience_templates_tenant_experiences.sql</code>.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-zinc-700 uppercase tracking-wide">Tus experiencias</h2>
          <div className="rounded-xl border border-zinc-200 overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-600 text-left">
                <tr>
                  <th className="p-3 font-medium">Plantilla</th>
                  <th className="p-3 font-medium">Estado</th>
                  <th className="p-3 font-medium">Enlaces</th>
                  <th className="p-3 font-medium w-40">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {instances.map((row) => (
                  <tr key={row.id} className="border-t border-zinc-100">
                    <td className="p-3">
                      <p className="font-medium text-zinc-900">{row.experience_templates?.label ?? '—'}</p>
                      <p className="text-xs text-zinc-400 font-mono">{row.experience_templates?.base_path}</p>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex rounded-full px-2 py-0.5 text-xs bg-zinc-100 text-zinc-700 capitalize">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {row.form_slug ? (
                        <a
                          href={absoluteUrl(`/inscripcion/${row.form_slug}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-zinc-700 hover:underline text-xs"
                        >
                          Inscripción <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        '—'
                      )}
                      {row.experience_templates?.base_path && (
                        <a
                          href={absoluteUrl(row.experience_templates.base_path)}
                          target="_blank"
                          rel="noreferrer"
                          className="block mt-1 text-xs text-zinc-500 hover:underline inline-flex items-center gap-1"
                        >
                          Networking <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="p-3 space-x-1 flex flex-wrap gap-1">
                      {row.status !== 'published' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={busyId === row.id}
                          onClick={() => void setStatus(row.id, 'published')}
                        >
                          Publicar
                        </Button>
                      )}
                      {row.status === 'published' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === row.id}
                          onClick={() => void setStatus(row.id, 'draft')}
                        >
                          Borrador
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {instances.length === 0 && (
              <p className="p-6 text-sm text-zinc-500 text-center">Aún no has creado experiencias desde plantilla.</p>
            )}
          </div>
        </section>
      </motion.div>
    </div>
  )
}
