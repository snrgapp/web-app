'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams, usePathname } from 'next/navigation'
import { CoursePlayerPage } from '@/components/miembros/CoursePlayerPage'
import { getCourseLesson } from '@/lib/miembros/course-lessons'
import { getCourseById } from '@/lib/miembros/courses'
import { membersBasePath, membersHref } from '@/lib/miembros/nav'
import { mapCmsCourse, mapCmsLesson } from '@/lib/cms/mappers'
import type { Course } from '@/lib/miembros/courses'
import type { CourseLesson } from '@/lib/miembros/course-lessons'

export default function CourseLessonRoutePage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const pathname = usePathname()
  const dummyCourse = getCourseById(id)
  const dummyLesson = getCourseLesson(id, lessonId)
  const [course, setCourse] = useState<Course | undefined>(dummyCourse)
  const [lesson, setLesson] = useState<CourseLesson | undefined>(dummyLesson)
  const basePath = membersBasePath(pathname)

  useEffect(() => {
    fetch(`/api/miembros/cms/courses?id=${id}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (!payload?.data) return
        setCourse(mapCmsCourse(payload.data))
        const found = (payload.data.lessons || []).find(
          (item: { slug: string; id: string }) => item.slug === lessonId || item.id === lessonId
        )
        if (found) setLesson(mapCmsLesson(found))
      })
      .catch(() => undefined)
  }, [id, lessonId])

  if (!course || !lesson) {
    return (
      <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 md:px-10">
        <h1 className="mb-3 text-[20px] font-semibold text-members-on-surface">
          No encontramos esta clase
        </h1>
        <p className="mb-6 text-sm text-members-on-surface-variant">
          Vuelve al curso o al catálogo para continuar.
        </p>
        <Link
          href={membersHref(course ? `/aprendizaje/${course.id}` : '/aprendizaje', basePath)}
          className="inline-flex rounded-lg bg-members-primary-container px-4 py-2 text-xs text-white"
        >
          {course ? 'Volver al curso' : 'Volver a Aprendizaje'}
        </Link>
      </div>
    )
  }

  return <CoursePlayerPage course={course} lesson={lesson} />
}
