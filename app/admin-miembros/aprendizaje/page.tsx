'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  Bold,
  CloudUpload,
  Filter,
  GripVertical,
  Italic,
  Link2,
  List,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Users,
} from 'lucide-react'
import { adminFetch, useBusy } from '@/components/admin-miembros/admin-ui'
import { COURSE_CATEGORIES } from '@/lib/miembros/courses'
import {
  DUMMY_ADMIN_COURSES,
  DUMMY_MENTORS,
  emptyAdminCourse,
  emptyLesson,
  isDummyCourseId,
  toAdminCourse,
  type AdminCourse,
  type AdminCourseStatus,
} from '@/lib/admin-miembros/aprendizaje-dummy'
import type { CmsCourse, CmsLesson } from '@/lib/cms/types'

const STATUS_LABEL: Record<AdminCourseStatus, string> = {
  published: 'Publicado',
  draft: 'Borrador',
  archived: 'Archivado',
}

const STATUS_CLASS: Record<AdminCourseStatus, string> = {
  published: 'text-members-success bg-members-success/10',
  draft: 'text-members-pending bg-members-pending/10',
  archived: 'text-members-outline bg-members-outline/10',
}

const fieldClass =
  'w-full rounded-lg border border-members-outline-variant bg-members-surface-container px-4 py-3 text-members-on-surface outline-none transition-all placeholder:text-members-on-surface-variant focus:border-members-primary focus:ring-1 focus:ring-members-primary'

function mentorsFor(course: AdminCourse) {
  return course.instructor && !DUMMY_MENTORS.includes(course.instructor)
    ? [course.instructor, ...DUMMY_MENTORS]
    : DUMMY_MENTORS
}

const INITIAL_DRAFT =
  DUMMY_ADMIN_COURSES.find((course) => course.status === 'draft') || DUMMY_ADMIN_COURSES[0]

export default function AdminAprendizajePage() {
  const [courses, setCourses] = useState<AdminCourse[]>(DUMMY_ADMIN_COURSES)
  const [draft, setDraft] = useState<AdminCourse>(INITIAL_DRAFT)
  const [filter, setFilter] = useState('')
  const [statsId, setStatsId] = useState<string | null>(null)
  const { busy, error, setError, run } = useBusy()

  async function load(selectId?: string) {
    try {
      const result = await adminFetch<{ data: CmsCourse[]; error?: string }>('/api/admin-miembros/courses')
      const next = result.data?.length
        ? result.data.map((course) => toAdminCourse(course))
        : DUMMY_ADMIN_COURSES
      setCourses(next)
      const preferred = selectId || draft.id
      const selected = next.find((course) => course.id === preferred)
      if (selected) {
        if (selected.lessons?.length || isDummyCourseId(selected.id)) {
          setDraft(selected)
        } else {
          const detail = await adminFetch<{ data: CmsCourse }>(`/api/admin-miembros/courses?id=${selected.id}`)
          setDraft(toAdminCourse(detail.data || selected, selected.students, selected.status))
        }
      }
    } catch {
      setCourses(DUMMY_ADMIN_COURSES)
    }
  }

  useEffect(() => {
    void load(INITIAL_DRAFT.id)
  }, [])

  const visible = useMemo(() => {
    const query = filter.trim().toLowerCase()
    if (!query) return courses
    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query)
    )
  }, [courses, filter])

  const activeCount = courses.filter((course) => course.status === 'published').length
  const statsCourse = courses.find((course) => course.id === statsId)

  function startNew() {
    setDraft(emptyAdminCourse())
    setError(null)
  }

  function updateLesson(lessonId: string, patch: Partial<CmsLesson>) {
    setDraft((current) => ({
      ...current,
      lessons: (current.lessons || []).map((lesson) =>
        lesson.id === lessonId ? { ...lesson, ...patch } : lesson
      ),
    }))
  }

  function saveLocal(course: AdminCourse) {
    const saved: AdminCourse = {
      ...course,
      id: course.id || `course-local-${Date.now()}`,
      slug: course.slug || course.title.toLowerCase().replace(/\s+/g, '-'),
      short_title: course.short_title || course.title,
      published: course.status === 'published',
      lessons: (course.lessons || []).map((lesson, index) => ({
        ...lesson,
        course_id: course.id || lesson.course_id,
        sort_order: index,
      })),
    }
    setCourses((current) => {
      const exists = current.some((item) => item.id === saved.id)
      return exists ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]
    })
    setDraft(saved)
  }

  function saveCourse() {
    void run(async () => {
      if (!draft.title.trim()) {
        setError('El nombre del curso es obligatorio')
        return
      }
      const payload = {
        ...draft,
        published: draft.status === 'published',
        short_title: draft.short_title || draft.title,
      }
      if (!draft.id || isDummyCourseId(draft.id)) {
        saveLocal(payload)
        return
      }
      try {
        const result = await adminFetch<{ data: CmsCourse }>('/api/admin-miembros/courses', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        const courseId = result.data.id
        for (const lesson of draft.lessons || []) {
          await adminFetch('/api/admin-miembros/lessons', {
            method: 'POST',
            body: JSON.stringify({ ...lesson, course_id: courseId }),
          })
        }
        await load(courseId)
      } catch {
        saveLocal(payload)
      }
    })
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="admin-display mb-2 text-members-on-surface">Gestor de Capacitación</h1>
          <p className="admin-editor-body text-members-on-surface-variant">
            Cursos, mentores, clases y materiales que ven los emprendedores.
          </p>
        </div>
        <button
          type="button"
          onClick={startNew}
          className="admin-table-cell rounded-lg bg-members-primary px-4 py-2 font-medium text-members-admin-surface transition-colors hover:bg-[#e2dfff]"
        >
          Nuevo curso
        </button>
      </div>

      {error ? (
        <p className="mb-6 rounded-lg border border-members-outline-variant bg-members-surface-container-low px-3 py-2 text-sm text-members-on-surface-variant">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-12">
        <div className="flex flex-col gap-8 xl:col-span-7">
          <section className="rounded-xl border border-members-outline-variant bg-members-surface-container-lowest p-8 shadow-sm">
            <div className="mb-6 border-b border-members-outline-variant pb-4">
              <h1 className="admin-editor-body font-semibold text-members-on-surface">Datos del curso</h1>
              <p className="admin-table-cell mt-1 text-members-on-surface-variant">
                Información principal de este módulo de capacitación.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="admin-label-caps mb-2 block text-members-on-surface">Nombre del curso</label>
                <input
                  className={fieldClass}
                  placeholder="Ej. Liderazgo para founders en etapa seed"
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="admin-label-caps mb-2 block text-members-on-surface">Mentor / instructor</label>
                  <div className="relative">
                    <select
                      className={`${fieldClass} appearance-none`}
                      value={draft.instructor}
                      onChange={(event) => setDraft({ ...draft, instructor: event.target.value })}
                    >
                      <option value="">Elegir mentor...</option>
                      {mentorsFor(draft).map((mentor) => (
                        <option key={mentor} value={mentor}>
                          {mentor}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="admin-label-caps mb-2 block text-members-on-surface">Categoría</label>
                  <select
                    className={`${fieldClass} appearance-none`}
                    value={draft.category}
                    onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                  >
                    {COURSE_CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="admin-label-caps mb-2 block text-members-on-surface">Descripción</label>
                <div className="overflow-hidden rounded-lg border border-members-outline-variant bg-members-surface-container-lowest">
                  <div className="flex items-center gap-1 border-b border-members-outline-variant bg-members-surface-container-high px-3 py-2">
                    <ToolbarIcon icon={Bold} label="Negrita" />
                    <ToolbarIcon icon={Italic} label="Cursiva" />
                    <ToolbarIcon icon={List} label="Lista" />
                    <div className="mx-2 h-4 w-px bg-members-outline-variant" />
                    <ToolbarIcon icon={Link2} label="Enlace" />
                  </div>
                  <textarea
                    className="admin-editor-body min-h-[120px] w-full resize-none border-none bg-transparent px-4 py-3 text-members-on-surface outline-none placeholder:text-members-on-surface-variant focus:ring-0"
                    placeholder="Describe el curso..."
                    value={draft.subtitle}
                    onChange={(event) => setDraft({ ...draft, subtitle: event.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="admin-label-caps mb-2 block text-members-on-surface">Portada del curso</label>
                {draft.image_url ? (
                  <div className="overflow-hidden rounded-xl border border-members-outline-variant">
                    <img src={draft.image_url} alt="" className="h-40 w-full object-cover" />
                    <input
                      className={`${fieldClass} rounded-none border-0 border-t`}
                      placeholder="URL de la imagen"
                      value={draft.image_url}
                      onChange={(event) => setDraft({ ...draft, image_url: event.target.value })}
                    />
                  </div>
                ) : (
                  <label className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-members-outline-variant bg-members-surface-container-low p-8 text-center transition-colors hover:bg-members-surface-container">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-members-surface-container-highest transition-transform group-hover:scale-110">
                      <CloudUpload className="h-5 w-5 text-members-primary" />
                    </div>
                    <p className="admin-table-cell mb-1 text-members-on-surface">Pega una URL de imagen</p>
                    <p className="text-xs text-members-on-surface-variant">PNG, JPG o GIF (máx. 800×400)</p>
                    <input
                      className={`${fieldClass} mt-4 max-w-md`}
                      placeholder="https://..."
                      value={draft.image_url}
                      onChange={(event) => setDraft({ ...draft, image_url: event.target.value })}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="admin-label-caps mb-2 block text-members-on-surface">Estado</label>
                <select
                  className={`${fieldClass} appearance-none md:max-w-xs`}
                  value={draft.status}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      status: event.target.value as AdminCourseStatus,
                      published: event.target.value === 'published',
                    })
                  }
                >
                  <option value="published">Publicado</option>
                  <option value="draft">Borrador</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-members-outline-variant bg-members-surface-container-lowest p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-members-outline-variant pb-4">
              <div>
                <h1 className="admin-editor-body font-semibold text-members-on-surface">Lecciones</h1>
                <p className="admin-table-cell mt-1 text-members-on-surface-variant">
                  Estructura los módulos del curso.
                </p>
              </div>
              <button
                type="button"
                className="admin-table-cell flex items-center gap-2 font-medium text-members-primary transition-colors hover:text-members-primary/80"
                onClick={() =>
                  setDraft({
                    ...draft,
                    lessons: [...(draft.lessons || []), emptyLesson(draft.id)],
                  })
                }
              >
                <Plus className="h-4 w-4" />
                Añadir lección
              </button>
            </div>

            <div className="space-y-4">
              {(draft.lessons || []).length === 0 ? (
                <p className="admin-table-cell text-members-on-surface-variant">
                  Aún no hay lecciones. Añade la primera para estructurar el curso.
                </p>
              ) : (
                (draft.lessons || []).map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onChange={(patch) => updateLesson(lesson.id, patch)}
                    onDelete={() =>
                      setDraft({
                        ...draft,
                        lessons: (draft.lessons || []).filter((item) => item.id !== lesson.id),
                      })
                    }
                  />
                ))
              )}
            </div>
          </section>

          <div className="mt-2 flex justify-end gap-4">
            <button
              type="button"
              onClick={startNew}
              className="admin-table-cell rounded-lg border border-members-outline-variant px-6 py-2.5 text-members-on-surface transition-colors hover:bg-members-surface-container-high"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={saveCourse}
              className="admin-table-cell rounded-lg bg-members-primary px-6 py-2.5 font-medium text-members-admin-surface shadow-sm transition-colors hover:bg-[#e2dfff] disabled:opacity-50"
            >
              Guardar curso
            </button>
          </div>
        </div>

        <aside className="xl:col-span-5">
          <div className="flex flex-col overflow-hidden rounded-xl border border-members-outline-variant bg-members-surface-container-lowest shadow-sm xl:sticky xl:top-24 xl:h-[calc(100vh-140px)]">
            <div className="relative z-10 border-b border-members-outline-variant bg-members-admin-surface-container p-6 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="admin-editor-body font-semibold text-members-on-surface">Cursos actuales</h1>
                <span className="rounded-full border border-members-outline-variant bg-members-surface-container-high px-2.5 py-1 text-xs text-members-on-surface">
                  {activeCount} activos
                </span>
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-members-on-surface-variant" />
                <input
                  className="admin-table-cell w-full rounded-lg border border-members-outline-variant bg-members-surface-container py-2 pl-9 pr-4 text-members-on-surface outline-none focus:ring-1 focus:ring-members-primary"
                  placeholder="Filtrar cursos..."
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {visible.map((course) => {
                const selected = draft.id === course.id
                return (
                  <article
                    key={course.id}
                    className={`group mx-2 my-1 flex flex-col rounded-lg border-b border-members-outline-variant p-4 transition-colors last:border-0 hover:bg-members-surface-container-high ${
                      selected ? 'bg-members-surface-container-highest' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-members-surface-container ${
                          selected ? 'border-members-primary/50' : 'border-members-outline-variant'
                        }`}
                      >
                        {course.image_url ? (
                          <img src={course.image_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-members-on-surface-variant">
                            {course.title.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        {selected ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-members-primary/20">
                            <Pencil className="h-3.5 w-3.5 text-members-primary" />
                          </div>
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h1
                          className={`admin-table-cell truncate font-medium ${
                            selected ? 'text-members-primary' : 'text-members-on-surface'
                          }`}
                        >
                          {course.short_title || course.title}
                        </h1>
                        <p className="mt-0.5 text-xs text-members-on-surface-variant">{course.instructor}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span
                            className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_CLASS[course.status]}`}
                          >
                            {STATUS_LABEL[course.status]}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-members-on-surface-variant">
                            <Users className="h-3.5 w-3.5" />
                            {course.students ? course.students.toLocaleString('es-CO') : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`mt-4 flex justify-end gap-2 transition-opacity ${
                        selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded border border-members-outline-variant bg-members-surface-container px-3 py-1.5 text-xs font-medium text-members-on-surface-variant transition-colors hover:bg-members-surface-container-highest hover:text-members-on-surface"
                        onClick={() => setStatsId(course.id)}
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                        Stats
                      </button>
                      <button
                        type="button"
                        className={
                          selected
                            ? 'flex items-center gap-1 rounded border border-members-primary/40 bg-members-primary/20 px-3 py-1.5 text-xs font-medium text-members-primary'
                            : 'flex items-center gap-1 rounded border border-members-primary/20 bg-members-primary/10 px-3 py-1.5 text-xs font-medium text-members-primary transition-colors hover:bg-members-primary/20'
                        }
                        onClick={() => {
                          setDraft(course)
                          setError(null)
                          if (course.id && !isDummyCourseId(course.id) && !course.lessons?.length) {
                            void run(async () => {
                              const detail = await adminFetch<{ data: CmsCourse }>(
                                `/api/admin-miembros/courses?id=${course.id}`
                              )
                              if (detail.data) setDraft(toAdminCourse(detail.data, course.students, course.status))
                            })
                          }
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {selected ? 'Editando' : 'Editar'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </aside>
      </div>

      {statsCourse ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setStatsId(null)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-members-outline-variant bg-members-surface-container-lowest p-6">
            <h1 className="admin-editor-body mb-1 font-semibold text-members-on-surface">
              {statsCourse.short_title || statsCourse.title}
            </h1>
            <p className="admin-table-cell mb-5 text-members-on-surface-variant">{statsCourse.instructor}</p>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Inscritos" value={statsCourse.students ? statsCourse.students.toLocaleString('es-CO') : '—'} />
              <StatBox label="Lecciones" value={String(statsCourse.lessons?.length || 0)} />
              <StatBox label="Estado" value={STATUS_LABEL[statsCourse.status]} />
              <StatBox label="Categoría" value={statsCourse.category} />
            </div>
            <button
              type="button"
              className="admin-table-cell mt-5 w-full rounded-lg border border-members-outline-variant py-2 text-members-on-surface hover:bg-members-surface-container-high"
              onClick={() => setStatsId(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ToolbarIcon({ icon: Icon, label }: { icon: typeof Bold; label: string }) {
  return (
    <button
      type="button"
      className="rounded p-1.5 text-members-on-surface-variant hover:bg-members-surface-container-highest hover:text-members-on-surface"
      aria-label={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-members-outline-variant bg-members-surface-container p-3">
      <p className="admin-label-caps text-members-on-surface-variant">{label}</p>
      <p className="admin-table-cell mt-1 font-semibold text-members-on-surface">{value}</p>
    </div>
  )
}

function LessonCard({
  lesson,
  onChange,
  onDelete,
}: {
  lesson: CmsLesson
  onChange: (patch: Partial<CmsLesson>) => void
  onDelete: () => void
}) {
  const [materialUrl, setMaterialUrl] = useState('')

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-members-outline-variant bg-members-surface-container-low p-4">
      <div className="flex items-start justify-between">
        <div className="flex w-full items-center gap-3">
          <GripVertical className="h-5 w-5 cursor-grab text-members-on-surface-variant" />
          <input
            className="admin-editor-body flex-1 border-none bg-transparent p-0 font-medium text-members-on-surface outline-none focus:ring-0"
            placeholder="Nombre de la lección"
            value={lesson.title}
            onChange={(event) => onChange({ title: event.target.value })}
          />
        </div>
        <button
          type="button"
          className="text-members-on-surface-variant transition-colors hover:text-red-300"
          aria-label="Borrar lección"
          onClick={onDelete}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 pl-9 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-members-on-surface-variant">Video (Vimeo / YouTube)</label>
          <input
            className="admin-table-cell w-full rounded-md border border-members-outline-variant bg-members-surface-container px-3 py-2 text-members-on-surface outline-none focus:border-members-primary focus:ring-1 focus:ring-members-primary"
            value={lesson.video_url}
            onChange={(event) => onChange({ video_url: event.target.value })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-members-on-surface-variant">Materiales (PDF / enlace)</label>
          <div className="flex gap-2">
            <input
              className="admin-table-cell w-full rounded-md border border-members-outline-variant bg-members-surface-container px-3 py-2 text-members-on-surface outline-none focus:border-members-primary focus:ring-1 focus:ring-members-primary"
              placeholder="URL del material..."
              value={materialUrl}
              onChange={(event) => setMaterialUrl(event.target.value)}
            />
            <button
              type="button"
              className="flex items-center justify-center rounded-md border border-members-outline-variant bg-members-surface-container-high px-3 transition-colors hover:bg-members-surface-container-highest"
              aria-label="Añadir material"
              onClick={() => {
                if (!materialUrl.trim()) return
                onChange({
                  resources: [
                    ...lesson.resources,
                    {
                      id: `res-local-${Date.now()}`,
                      lesson_id: lesson.id,
                      title: 'Material',
                      url: materialUrl.trim(),
                      kind: 'pdf',
                      meta: '',
                      sort_order: lesson.resources.length,
                    },
                  ],
                })
                setMaterialUrl('')
              }}
            >
              <Upload className="h-4 w-4 text-members-on-surface" />
            </button>
          </div>
          {lesson.resources.length ? (
            <ul className="mt-2 space-y-1 text-xs text-members-on-surface-variant">
              {lesson.resources.map((resource) => (
                <li key={resource.id} className="truncate">
                  {resource.title}
                  {resource.url ? ` · ${resource.url}` : ''}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  )
}
