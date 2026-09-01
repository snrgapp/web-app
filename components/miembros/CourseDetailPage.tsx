'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Award,
  Captions,
  Check,
  ChevronRight,
  Code,
  Download,
  Heart,
  Info,
  Languages,
  Play,
  Share2,
  Smartphone,
  Sparkles,
  Users,
} from 'lucide-react'
import { CourseStars } from './CourseStars'
import { getFirstLessonId } from '@/lib/miembros/course-lessons'
import {
  formatCourseCount,
  type Course,
  type CourseInclude,
} from '@/lib/miembros/courses'
import { membersBasePath, membersHref } from '@/lib/miembros/nav'

const INCLUDE_ICONS: Record<CourseInclude['icon'], typeof Play> = {
  video: Play,
  code: Code,
  download: Download,
  mobile: Smartphone,
  captions: Captions,
  certificate: Award,
}

export function CourseDetailPage({ course }: { course: Course }) {
  const pathname = usePathname()
  const basePath = membersBasePath(pathname)
  const catalogHref = membersHref('/aprendizaje', basePath)
  const firstLessonId = course.firstLessonId || getFirstLessonId(course.id)
  const playHref = firstLessonId
    ? membersHref(`/aprendizaje/${course.id}/clase/${firstLessonId}`, basePath)
    : catalogHref

  return (
    <div>
      <section className="relative overflow-hidden border-b border-members-outline-variant bg-members-surface-container-low px-4 pb-16 pt-8 sm:px-6 md:px-10 md:pb-24 md:pt-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-members-primary-container blur-[100px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1280px]">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-members-primary">
            <Link href={catalogHref} className="hover:underline">
              Aprendizaje
            </Link>
            <ChevronRight className="h-4 w-4 text-members-on-surface-variant" />
            <span>{course.topics[0]}</span>
            <ChevronRight className="h-4 w-4 text-members-on-surface-variant" />
            <span className="text-members-on-surface">{course.topics[1]}</span>
          </nav>

          <div className="flex flex-col gap-12 lg:flex-row">
            <div className="flex max-w-3xl flex-1 flex-col gap-6">
              <h1 className="course-title text-members-on-surface">
                {course.title}
              </h1>
              <p className="course-subtitle text-members-on-surface-variant">
                {course.subtitle}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                {course.badge ? (
                  <span className="rounded bg-members-surface-variant px-3 py-1 text-xs text-members-on-surface">
                    {course.badge.label}
                  </span>
                ) : null}
                {course.extraBadges?.map((label) => (
                  <span
                    key={label}
                    className="rounded bg-[#a44100] px-3 py-1 text-xs text-[#ffd2be]"
                  >
                    {label}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex flex-col gap-2 text-sm text-members-on-surface-variant">
                <p>
                  Creado por{' '}
                  {course.instructors.map((name, index) => (
                    <span key={name}>
                      <span className="text-members-primary">{name}</span>
                      {index < course.instructors.length - 1 ? ', ' : null}
                    </span>
                  ))}
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Última actualización: {course.updatedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Languages className="h-4 w-4" />
                    {course.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Captions className="h-4 w-4" />
                    {course.captions}
                  </span>
                </div>
              </div>
            </div>
            <div className="hidden w-[360px] flex-shrink-0 xl:block xl:w-[400px]" />
          </div>
        </div>
      </section>

      <section className="relative z-20 mx-auto max-w-[1280px] px-4 pb-16 sm:px-6 md:px-10 md:pb-24">
        <div className="flex flex-col gap-8 xl:flex-row">
          <div className="order-2 flex flex-1 flex-col gap-8 xl:order-1">
            <div className="flex overflow-hidden rounded-xl border border-members-outline-variant bg-members-surface shadow-lg">
              <div className="flex min-w-[104px] flex-col items-center justify-center gap-2 bg-members-primary-container p-6 text-center text-white">
                <Check className="h-8 w-8" />
                <span className="text-xs">30 días</span>
              </div>
              <div className="flex flex-1 flex-col items-start justify-between gap-6 p-6 sm:flex-row sm:items-center">
                <p className="text-sm leading-6 text-members-on-surface md:text-base">
                  Accede a este y al resto del catálogo sin costo durante tus primeros{' '}
                  <span className="font-medium">30 días</span> en Synergy.
                </p>
                <div className="flex flex-shrink-0 gap-8 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xl text-members-on-surface md:text-2xl">
                      {course.rating.toString().replace('.', ',')}
                    </span>
                    <CourseStars rating={course.rating} size="md" />
                    <span className="mt-1 text-sm text-members-primary">
                      {formatCourseCount(course.reviews)} valoraciones
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users className="mb-1 h-5 w-5 text-members-on-surface-variant" />
                    <span className="text-lg text-members-on-surface">
                      {formatCourseCount(course.students)}
                    </span>
                    <span className="text-sm text-members-on-surface-variant">estudiantes</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-members-outline-variant bg-members-surface p-6 shadow-lg md:p-8">
              <h1 className="mb-6 text-lg text-members-on-surface md:text-2xl">
                Lo que aprenderás
              </h1>
              <div className="grid grid-cols-1 gap-4 text-sm text-members-on-surface-variant md:grid-cols-2">
                {course.learnings.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-[18px] w-[18px] shrink-0 text-members-on-surface" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h1 className="mb-4 text-base text-members-on-surface">Ver temas relacionados</h1>
              <div className="flex flex-wrap gap-3">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-members-outline-variant px-4 py-2 text-xs text-members-on-surface"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="order-1 w-full flex-shrink-0 xl:-mt-64 xl:order-2 xl:w-[360px] 2xl:w-[400px]">
            <div className="overflow-hidden rounded-xl border border-members-outline-variant bg-members-surface shadow-2xl xl:sticky xl:top-24">
              <Link href={playHref} className="group relative block h-48 bg-members-surface-variant">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={course.image} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 transition-colors group-hover:bg-black/20">
                  <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-transform group-hover:scale-105">
                    <Play className="h-8 w-8 fill-black text-black" />
                  </div>
                  <span className="text-sm font-medium text-white">Vista previa de este curso</span>
                </div>
              </Link>

              <div className="flex flex-col gap-6 p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-members-primary">
                    <div className="h-2.5 w-2.5 rounded-full bg-members-primary" />
                  </div>
                  <div>
                    <h1 className="flex items-center gap-2 text-base text-members-on-surface">
                      Acceso incluido
                      <Info className="h-4 w-4 text-members-on-surface-variant" />
                    </h1>
                    <p className="mt-1 text-sm text-members-on-surface-variant">
                      Este curso está incluido gratis durante tus primeros 30 días en la red.
                    </p>
                  </div>
                </div>

                <Link
                  href={playHref}
                  className="block w-full rounded-lg bg-members-primary-container py-3.5 text-center text-xs text-white shadow-sm transition-colors hover:brightness-110"
                >
                  Iniciar curso ahora
                </Link>

                <div className="flex items-center justify-center gap-4 border-t border-members-outline-variant/50 pt-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-members-on-surface transition-colors hover:text-members-primary"
                  >
                    <Heart className="h-5 w-5" />
                    Añadir a la lista
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-members-on-surface transition-colors hover:text-members-primary"
                  >
                    <Share2 className="h-5 w-5" />
                    Compartir
                  </button>
                </div>

                <div className="border-t border-members-outline-variant/50 pt-4">
                  <h1 className="mb-4 text-base text-members-on-surface">Este curso incluye:</h1>
                  <ul className="flex flex-col gap-3 text-sm text-members-on-surface-variant">
                    {course.includes.map((item) => {
                      const Icon = INCLUDE_ICONS[item.icon]
                      return (
                        <li key={item.label} className="flex items-center gap-3">
                          <Icon className="h-5 w-5 shrink-0" />
                          {item.label}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
