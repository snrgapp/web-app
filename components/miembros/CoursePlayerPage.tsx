'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Captions,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Link2,
  Maximize,
  MessagesSquare,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
} from 'lucide-react'
import type { Course } from '@/lib/miembros/courses'
import {
  getAdjacentLessonIds,
  type CourseLesson,
  type LessonResource,
} from '@/lib/miembros/course-lessons'
import { membersBasePath, membersHref } from '@/lib/miembros/nav'

const SPEEDS = [1, 1.25, 1.5, 2] as const

const RESOURCE_ICONS: Record<LessonResource['kind'], typeof FileText> = {
  pdf: FileText,
  chart: BarChart3,
  repo: Link2,
  article: BookOpen,
}

function formatTime(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function CourseVideoPlayer({
  image,
  durationSeconds,
  videoUrl,
}: {
  image: string
  durationSeconds: number
  videoUrl?: string
}) {
  const shellRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [speedIndex, setSpeedIndex] = useState(0)
  const [volume, setVolume] = useState(80)
  const [captions, setCaptions] = useState(false)
  const speed = SPEEDS[speedIndex]

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setSeconds((current) => {
        const next = current + speed
        if (next >= durationSeconds) {
          setPlaying(false)
          return durationSeconds
        }
        return next
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [playing, speed, durationSeconds])

  const progress = durationSeconds > 0 ? (seconds / durationSeconds) * 100 : 0

  if (videoUrl) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-members-outline-variant bg-black shadow-2xl">
        <video className="h-full w-full" src={videoUrl} poster={image} controls />
      </div>
    )
  }

  return (
    <div
      ref={shellRef}
      className="group relative aspect-video w-full overflow-hidden rounded-lg border border-members-outline-variant bg-black shadow-2xl"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="h-full w-full object-cover opacity-80" />
      {!playing ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/35"
          aria-label="Reproducir"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <Play className="h-8 w-8 fill-black text-black" />
          </span>
        </button>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="pointer-events-auto flex flex-col gap-2 p-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white">{formatTime(seconds)}</span>
            <input
              type="range"
              min={0}
              max={durationSeconds}
              value={seconds}
              onChange={(event) => setSeconds(Number(event.target.value))}
              className="course-player-range flex-1"
              aria-label="Progreso"
            />
            <span className="text-xs text-white">{formatTime(durationSeconds)}</span>
          </div>
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPlaying((value) => !value)}
                className="hover:text-members-primary"
                aria-label={playing ? 'Pausar' : 'Reproducir'}
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-white" />}
              </button>
              <button
                type="button"
                onClick={() => setSeconds((value) => Math.max(0, value - 10))}
                className="hover:text-members-primary"
                aria-label="Retroceder 10 segundos"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setSeconds((value) => Math.min(durationSeconds, value + 10))}
                className="hover:text-members-primary"
                aria-label="Avanzar 10 segundos"
              >
                <RotateCw className="h-5 w-5" />
              </button>
              <div className="group/volume relative flex items-center gap-2">
                <button type="button" className="hover:text-members-primary" aria-label="Volumen">
                  <Volume2 className="h-5 w-5" />
                </button>
                <div className="absolute left-8 hidden w-20 group-hover/volume:block">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                    className="course-player-range w-full"
                    aria-label="Volumen"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSpeedIndex((index) => (index + 1) % SPEEDS.length)}
                className="rounded bg-members-surface-variant/50 px-2 py-1 text-xs hover:text-members-primary"
              >
                {speed}x
              </button>
              <button
                type="button"
                onClick={() => setCaptions((value) => !value)}
                className={captions ? 'text-members-primary' : 'hover:text-members-primary'}
                aria-label="Subtítulos"
              >
                <Captions className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const node = shellRef.current
                  if (!node) return
                  if (document.fullscreenElement) {
                    void document.exitFullscreen()
                    return
                  }
                  void node.requestFullscreen()
                }}
                className="hover:text-members-primary"
                aria-label="Pantalla completa"
              >
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only">Progreso {Math.round(progress)}%</span>
    </div>
  )
}

export function CoursePlayerPage({
  course,
  lesson,
}: {
  course: Course
  lesson: CourseLesson
}) {
  const pathname = usePathname()
  const basePath = membersBasePath(pathname)
  const catalogHref = membersHref('/aprendizaje', basePath)
  const courseHref = membersHref(`/aprendizaje/${course.id}`, basePath)
  const { prevId, nextId } = useMemo(
    () => getAdjacentLessonIds(course.id, lesson.id),
    [course.id, lesson.id]
  )
  const prevHref = prevId ? membersHref(`/aprendizaje/${course.id}/clase/${prevId}`, basePath) : undefined
  const nextHref = nextId ? membersHref(`/aprendizaje/${course.id}/clase/${nextId}`, basePath) : undefined

  return (
    <div className="px-4 py-6 sm:px-6 md:px-10 md:py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-1 flex-col gap-4 lg:w-2/3 xl:w-3/4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-members-on-surface-variant">
              <Link href={catalogHref} className="transition-colors hover:text-members-primary">
                Aprendizaje
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={courseHref} className="transition-colors hover:text-members-primary">
                {course.shortTitle}
              </Link>
            </div>
            <h1 className="course-lesson-title text-members-on-surface">
              {lesson.title}
            </h1>
          </div>

          <CourseVideoPlayer
            key={lesson.id}
            image={course.image}
            durationSeconds={lesson.durationSeconds}
            videoUrl={lesson.videoUrl}
          />

          <div className="flex flex-col items-start justify-between gap-6 rounded-lg border border-members-outline-variant bg-members-surface-container p-6 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h1 className="mb-2 text-base text-members-on-surface md:text-lg">
                Acerca de esta clase
              </h1>
              <p className="text-sm leading-6 text-members-on-surface-variant md:text-base">
                {lesson.about}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {prevHref ? (
                <Link
                  href={prevHref}
                  className="flex items-center gap-2 rounded-lg border border-members-outline-variant px-4 py-2 text-xs text-members-on-surface transition-colors hover:bg-members-surface-variant"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Clase anterior
                </Link>
              ) : (
                <span className="flex items-center gap-2 rounded-lg border border-members-outline-variant/50 px-4 py-2 text-xs text-members-on-surface-variant opacity-50">
                  <ArrowLeft className="h-4 w-4" />
                  Clase anterior
                </span>
              )}
              {nextHref ? (
                <Link
                  href={nextHref}
                  className="flex items-center gap-2 rounded-lg bg-members-primary-container px-4 py-2 text-xs text-white transition-colors hover:brightness-110"
                >
                  Siguiente clase
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href={courseHref}
                  className="flex items-center gap-2 rounded-lg bg-members-primary-container px-4 py-2 text-xs text-white transition-colors hover:brightness-110"
                >
                  Volver al curso
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <aside className="flex flex-col lg:w-1/3 xl:w-1/4">
          <div className="flex h-full flex-col rounded-lg border border-members-outline-variant bg-members-surface-container">
            <div className="flex items-center justify-between border-b border-members-outline-variant p-4">
              <h1 className="flex items-center gap-2 text-base text-members-on-surface">
                <FolderOpen className="h-5 w-5 text-members-primary" />
                Recursos de la clase
              </h1>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto p-4">
              {lesson.resources.map((resource) => {
                const Icon = RESOURCE_ICONS[resource.kind]
                const external = resource.kind === 'repo' || resource.kind === 'article'
                return (
                  <div
                    key={resource.id}
                    className="group flex items-start gap-3 rounded-lg border border-transparent bg-members-surface p-3 transition-all hover:border-members-outline-variant hover:bg-members-surface-variant"
                  >
                    <div className="rounded bg-members-surface-variant p-2 text-members-on-surface-variant transition-colors group-hover:bg-members-primary-container/20 group-hover:text-members-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-sm text-members-on-surface transition-colors group-hover:text-members-primary">
                        {resource.title}
                      </h1>
                      <p className="mt-1 text-xs text-members-on-surface-variant">{resource.meta}</p>
                    </div>
                    <span className="p-1 text-members-on-surface-variant transition-colors group-hover:text-members-primary">
                      {external ? <ExternalLink className="h-5 w-5" /> : <Download className="h-5 w-5" />}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-auto rounded-b-lg border-t border-members-outline-variant bg-members-surface-variant/30 p-4">
              <p className="mb-3 text-xs text-members-on-surface-variant">
                ¿Tienes dudas sobre el material?
              </p>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-members-outline-variant px-4 py-2 text-xs text-members-on-surface transition-colors hover:bg-members-surface-variant"
              >
                <MessagesSquare className="h-4 w-4" />
                Ir a discusiones
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
