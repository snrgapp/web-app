/**
 * Página de formulario dinámico por slug.
 * Server Component: obtiene datos del form; FormRenderer es Client Component para interactividad.
 * force-dynamic para que siempre obtenga datos frescos tras ediciones.
 */

export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getFormBySlug } from '@/lib/forms'
import { FormRenderer } from '@/components/forms'

interface PageProps {
  params: Promise<{ formSlug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { formSlug } = await params
  const form = await getFormBySlug(formSlug)
  if (!form) return { title: 'Formulario no encontrado' }
  return {
    title: `${form.titulo} | Inscripción`,
    description: form.descripcion ?? `Formulario de inscripción: ${form.titulo}`,
  }
}

export default async function InscripcionFormPage({ params }: PageProps) {
  const { formSlug } = await params
  const form = await getFormBySlug(formSlug)

  if (!form) {
    notFound()
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
