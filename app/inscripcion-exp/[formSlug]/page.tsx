/**
 * Inscripción sobre tablas PaaS (experience_forms), no forms legacy.
 */
export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { getExperienceFormBySlug } from '@/lib/experience-forms/repository'
import { FormRenderer } from '@/components/forms'
import { submitExperienceFormAction } from '@/app/actions/experience-forms'
import { absoluteUrl } from '@/lib/site'
import { createServerClient } from '@/utils/supabase/server'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

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
    <main
      className={cn(
        inter.className,
        'min-h-screen',
        'bg-zinc-950 text-white',
        'bg-[radial-gradient(circle,rgba(255,255,255,0.12)_1px,transparent_1px)]',
        '[background-size:22px_22px]'
      )}
    >
      <div className="mx-auto max-w-xl px-4 py-12 sm:py-16">
        <FormRenderer
          formSlug={form.slug}
          titulo={form.titulo}
          descripcion={form.descripcion}
          iconUrl={form.icon_url}
          coverUrl={form.cover_url}
          campos={form.campos}
          afterSuccess={afterSuccess}
          submitForm={submitExperienceFormAction}
          variant="paas"
        />
        <div className="mt-8 flex justify-center">
          <Link
            href="https://snrg.lat/eventos"
            className="inline-block rounded-xl border border-zinc-600 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            Volver a eventos
          </Link>
        </div>
      </div>
    </main>
  )
}
