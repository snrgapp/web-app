'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, Play } from 'lucide-react'
import { CourseStars } from './CourseStars'
import {
  COURSE_CATEGORIES,
  COURSES,
  FEATURED_COURSE_IDS,
  type Course,
  type CourseCategory,
} from '@/lib/miembros/courses'
import { mapCmsCourse } from '@/lib/cms/mappers'
import type { CmsCourse } from '@/lib/cms/types'
import { membersBasePath, membersHref } from '@/lib/miembros/nav'

export function AprendizajePage() {
  const pathname = usePathname()
  const basePath = membersBasePath(pathname)
  const [category, setCategory] = useState<CourseCategory>('Estrategia y Liderazgo')
  const [courses, setCourses] = useState<Course[]>(COURSES)

  useEffect(() => {
    fetch('/api/miembros/cms/courses')
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (payload?.data?.length) setCourses(payload.data.map((item: CmsCourse) => mapCmsCourse(item)))
      })
      .catch(() => undefined)
  }, [])

  const visibleCourses = useMemo(() => {
    if (category === 'Estrategia y Liderazgo') {
      const featured = courses.filter((course) => course.category === category || FEATURED_COURSE_IDS.includes(course.id as (typeof FEATURED_COURSE_IDS)[number]))
      return featured.length ? featured : courses
    }
    return courses.filter((course) => course.category === category)
  }, [category, courses])

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-8 pt-6 sm:px-6 md:px-10 md:pb-10 md:pt-10">
      <div className="mb-6">
        <h1 className="mb-2 text-[20px] font-semibold leading-7 text-members-on-surface md:text-4xl md:leading-[44px] md:tracking-tight">
          Cursos destacados
        </h1>
        <p className="text-sm leading-6 text-members-on-surface-variant md:text-base">
          Habilidades para transformar tu carrera y tu empresa. Incluidos gratis durante tus
          primeros 30 días.
        </p>
      </div>

      <div className="mb-8 flex gap-6 overflow-x-auto border-b border-members-outline-variant/30">
        {COURSE_CATEGORIES.map((item) => {
          const active = item === category
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={
                active
                  ? 'whitespace-nowrap border-b-2 border-members-primary pb-3 text-base font-medium text-members-on-surface'
                  : 'whitespace-nowrap pb-3 text-base font-medium text-members-on-surface-variant transition-colors hover:text-members-on-surface'
              }
            >
              {item}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleCourses.map((course) => (
          <Link
            key={course.id}
            href={membersHref(`/aprendizaje/${course.id}`, basePath)}
            className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-members-outline-variant bg-members-surface-container transition-colors hover:bg-members-surface-container-high"
          >
            <div className="relative aspect-video w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={course.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-members-primary-container text-white">
                  <Play className="h-6 w-6 fill-white" />
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h1 className="course-card-title mb-1 line-clamp-2 text-members-on-surface transition-colors group-hover:text-members-primary">
                {course.title}
              </h1>
              <p className="mb-1 line-clamp-1 text-sm text-members-on-surface-variant">
                {course.instructor}
              </p>
              <div className="mb-2 flex items-center gap-1">
                <span className="text-xs font-medium text-members-tertiary">{course.rating}</span>
                <CourseStars rating={course.rating} />
                <span className="text-[11px] text-members-on-surface-variant">
                  ({course.reviews} valoraciones)
                </span>
              </div>
              <span className="mb-3 mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-members-primary-container px-4 py-2 text-xs text-white transition-colors group-hover:brightness-110">
                Ir al Curso
                <ArrowRight className="h-4 w-4" />
              </span>
              {course.badge ? (
                <div className="flex flex-wrap gap-2">
                  <span
                    className={
                      course.badge.tone === 'hot'
                        ? 'rounded bg-[#d2f4d3] px-2 py-0.5 text-[10px] font-medium text-[#003824]'
                        : 'rounded bg-[#ffdad6] px-2 py-0.5 text-[10px] font-medium text-[#93000a]'
                    }
                  >
                    {course.badge.label}
                  </span>
                </div>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
