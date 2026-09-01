'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { CourseDetailPage } from '@/components/miembros/CourseDetailPage'
import { getCourseById } from '@/lib/miembros/courses'
import { membersBasePath, membersHref } from '@/lib/miembros/nav'
import { mapCmsCourse } from '@/lib/cms/mappers'
import type { Course } from '@/lib/miembros/courses'

export default function CourseDetailRoutePage() {
  const { id } = useParams<{ id: string }>()
  const pathname = usePathname()
  const dummy = getCourseById(id)
  const [course, setCourse] = useState<Course | undefined>(dummy)

  useEffect(() => {
    fetch(`/api/miembros/cms/courses?id=${id}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload?.data) setCourse(mapCmsCourse(payload.data))
      })
      .catch(() => undefined)
  }, [id])

  if (!course) {
    const catalogHref = membersHref('/aprendizaje', membersBasePath(pathname))
    return (
      <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 md:px-10">
        <h1 className="mb-3 text-[20px] font-semibold text-members-on-surface">
          No encontramos este curso
        </h1>
        <p className="mb-6 text-sm text-members-on-surface-variant">
          Puede que el enlace haya cambiado. Vuelve al catálogo para ver los cursos disponibles.
        </p>
        <Link
          href={catalogHref}
          className="inline-flex rounded-lg bg-members-primary-container px-4 py-2 text-xs text-white"
        >
          Volver a Aprendizaje
        </Link>
      </div>
    )
  }

  return <CourseDetailPage course={course} />
}
