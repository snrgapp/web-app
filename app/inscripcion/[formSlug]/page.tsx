/**
 * Página de formulario dinámico por slug.
 * Server Component: obtiene datos del form; FormRenderer es Client Component para interactividad.
 */

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
      <p className="mt-8 text-center text-sm text-zinc-500">
        <Link href="https://snrg.lat" className="hover:text-zinc-700">
          ← Volver a Synergy
        </Link>
      </p>
    </main>
  )
}
