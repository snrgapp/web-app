import Link from 'next/link'
import { getPublishedTenantExperienceByPublicSlug } from '@/lib/paas/tenant-experience-public'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ publicSlug: string }>
}

export default async function ExpSalonPage({ params }: PageProps) {
  const { publicSlug } = await params
  const te = await getPublishedTenantExperienceByPublicSlug(publicSlug)
  if (!te) notFound()

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 text-center max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-[var(--net-fg)] mb-3">Salón del evento</h1>
      <p className="text-[var(--net-muted)] text-sm leading-relaxed mb-8">
        Esta es la experiencia de networking dedicada a tu evento. Aquí conectarás la dinámica
        personalizada (mesas, rondas, preguntas) sin usar las rutas legacy de /networking.
      </p>
      <Link
        href={`/exp/${publicSlug}`}
        className="text-sm font-medium underline text-[var(--net-fg)]"
      >
        Volver al inicio de la experiencia
      </Link>
    </div>
  )
}
