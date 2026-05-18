/**
 * Inscripción sobre tablas PaaS (experience_forms), no forms legacy.
 */
export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getExperienceFormBySlug } from '@/lib/experience-forms/repository'
import { FormRenderer } from '@/components/forms'
import { submitExperienceFormAction } from '@/app/actions/experience-forms'
import { absoluteUrl } from '@/lib/site'
import { createServerClient } from '@/utils/supabase/server'

interface PageProps {
  params: Promise<{ formSlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { formSlug } = await params
  const form = await getExperienceFormBySlug(formSlug)
  if (!form) return { title: 'Formulario no encontrado' }
  return {
    title: `${form.titulo} | Inscripción`,
    description: form.descripcion ?? `Formulario: ${form.titulo}`,
  }
}

export default async function InscripcionExperienceFormPage({ params }: PageProps) {
  const { formSlug } = await params
  const form = await getExperienceFormBySlug(formSlug)
  if (!form) notFound()

  let afterSuccess: { href: string; label: string } | undefined
  const supabase = await createServerClient()
  if (supabase) {
    const { data: te } = await supabase
      .from('tenant_experiences')
      .select('public_slug, status')
      .eq('experience_form_id', form.id)
      .eq('status', 'published')
      .maybeSingle()
    if (te?.public_slug) {
      afterSuccess = {
        href: absoluteUrl(`/exp/${te.public_slug}`),
        label: 'Ir al networking del evento',
      }
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-12 sm:py-16">
      <FormRenderer
        formSlug={form.slug}
        titulo={form.titulo}
        descripcion={form.descripcion}
        iconUrl={form.icon_url}
        coverUrl={form.cover_url}
        campos={form.campos}
        afterSuccess={afterSuccess}
        submitForm={(slug, fd) => submitExperienceFormAction(slug, fd)}
      />
      <div className="mt-8 flex justify-center">
        <Link
          href="https://snrg.lat/eventos"
          className="inline-block px-5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-500 hover:text-zinc-700 hover:border-zinc-300 transition-colors"
        >
          Volver a eventos
        </Link>
      </div>
    </main>
  )
}
