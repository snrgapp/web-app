import { COURSES, FEATURED_COURSE_IDS } from '@/lib/miembros/courses'
import { getCourseLessons } from '@/lib/miembros/course-lessons'
import type { CmsCourse, CmsLesson } from '@/lib/cms/types'

export type AdminCourseStatus = 'published' | 'draft' | 'archived'

export type AdminCourse = CmsCourse & {
  students: number
  status: AdminCourseStatus
}

const DUMMY_STATUS: Record<string, AdminCourseStatus> = {
  b2b: 'published',
  finance: 'published',
  pmf: 'draft',
  ai: 'published',
  lead: 'published',
  ux: 'archived',
}

export const DUMMY_MENTORS = [...new Set(COURSES.map((course) => course.instructor))]

export function courseStatus(course: Pick<CmsCourse, 'published'> & { status?: AdminCourseStatus }): AdminCourseStatus {
  if (course.status) return course.status
  return course.published ? 'published' : 'draft'
}

export function toAdminCourse(course: CmsCourse, students = 0, status?: AdminCourseStatus): AdminCourse {
  return {
    ...course,
    students,
    status: status || course.status || courseStatus(course),
  }
}

function mapDummyLessons(courseId: string): CmsLesson[] {
  return getCourseLessons(courseId).map((lesson, index) => ({
    id: `${courseId}-${lesson.id}`,
    course_id: courseId,
    slug: lesson.id,
    title: lesson.title,
    about: lesson.about,
    duration: lesson.duration,
    duration_seconds: lesson.durationSeconds,
    video_url: lesson.videoUrl || `https://vimeo.com/${184200 + index}`,
    sort_order: index,
    resources: lesson.resources.map((resource, resourceIndex) => ({
      id: `${courseId}-${lesson.id}-${resource.id}`,
      lesson_id: `${courseId}-${lesson.id}`,
      title: resource.title,
      url: '',
      kind: resource.kind,
      meta: resource.meta,
      sort_order: resourceIndex,
    })),
  }))
}

export const DUMMY_ADMIN_COURSES: AdminCourse[] = COURSES.map((course) => {
  const status = DUMMY_STATUS[course.id] || 'published'
  return {
    id: course.id,
    slug: course.id,
    title: course.title,
    short_title: course.shortTitle,
    subtitle: course.subtitle,
    instructor: course.instructor,
    category: course.category,
    image_url: course.image,
    language: course.language,
    captions: course.captions,
    learnings: course.learnings,
    tags: course.tags,
    featured: FEATURED_COURSE_IDS.includes(course.id as (typeof FEATURED_COURSE_IDS)[number]),
    published: status === 'published',
    students: course.students,
    status,
    lessons: mapDummyLessons(course.id),
  }
})

export function emptyAdminCourse(): AdminCourse {
  return {
    id: '',
    slug: '',
    title: '',
    short_title: '',
    subtitle: '',
    instructor: '',
    category: 'Estrategia y Liderazgo',
    image_url: '',
    language: 'Español',
    captions: '',
    learnings: [],
    tags: [],
    featured: false,
    published: false,
    students: 0,
    status: 'draft',
    lessons: [],
  }
}

export function isDummyCourseId(id: string) {
  return Boolean(id) && (COURSES.some((course) => course.id === id) || id.startsWith('course-local-'))
}

export function emptyLesson(courseId: string): CmsLesson {
  return {
    id: `lesson-local-${Date.now()}`,
    course_id: courseId,
    slug: '',
    title: '',
    about: '',
    duration: '10:00',
    duration_seconds: 600,
    video_url: '',
    sort_order: 0,
    resources: [],
  }
}
