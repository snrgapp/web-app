import Link from 'next/link'
import { ClipboardList, ExternalLink } from 'lucide-react'
import { listExperienceFormsForOrg } from '@/lib/experience-forms/repository'
import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { absoluteUrl } from '@/lib/site'

export default async function PanelExpInscripcionesPage() {
  const forms = await listExperienceFormsForOrg()
  const orgId = await getDefaultOrgId()
  let slugByFormId = new Map<string, string>()
  if (orgId) {
    const supabase = await createServerClient()
    if (supabase) {
      const { data } = await supabase
        .from('tenant_experiences')
        .select('experience_form_id, public_slug')
        .eq('organizacion_id', orgId)
      for (const row of data ?? []) {
        if (row.experience_form_id && row.public_slug) {
          slugByFormId.set(row.experience_form_id, row.public_slug)
        }
      }
    }
  }

  return (
    <div className="pt-4 pr-4 pb-4 pl-2 lg:pt-6 lg:pr-6 lg:pb-6 lg:pl-2">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-zinc-700" />
          <div>
            <h1 className="text-2xl font-light text-black tracking-tight">Inscripciones PaaS</h1>
            <p className="text-sm text-zinc-500">
              Formularios en tabla <code className="font-mono text-xs">experience_forms</code> (aislados
              de Formularios legacy).
            </p>
          </div>
        </div>

        <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white">
          {forms.map((f) => {
            const pub = slugByFormId.get(f.id)
            return (
              <li key={f.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="font-medium text-zinc-900">{f.titulo}</p>
                  <p className="text-xs font-mono text-zinc-500">{f.slug}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={absoluteUrl(`/inscripcion-exp/${f.slug}`)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-zinc-700 hover:underline"
                  >
                    Abrir inscripción <ExternalLink className="w-3 h-3" />
                  </Link>
                  {pub && (
                    <Link
                      href={absoluteUrl(`/exp/${pub}`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:underline"
                    >
                      Experiencia <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
        {forms.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-12">
            Crea una desde <Link href="/panel/plantillas" className="underline">Plantillas</Link>.
          </p>
        )}
      </div>
    </div>
  )
}
