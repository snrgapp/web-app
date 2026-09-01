import type { CmsBenefit, CmsCourse, CmsEvent, CmsGroupCoffee, CmsLesson } from './types'
import type { Benefit } from '@/lib/miembros/benefits'
import type { Course } from '@/lib/miembros/courses'
import type { CourseLesson } from '@/lib/miembros/course-lessons'
import type { GroupCoffee, NetworkingEvent } from '@/lib/miembros/coffee-meets'

export function mapCmsBenefit(item: CmsBenefit): Benefit {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    offer: item.offer,
    category: item.category as Benefit['category'],
    featured: item.featured,
    logo: { label: item.logo_label, bg: item.logo_bg, color: item.logo_color },
  }
}

export function mapCmsCourse(item: CmsCourse): Course {
  return {
    id: item.slug || item.id,
    title: item.title,
    shortTitle: item.short_title || item.title,
    subtitle: item.subtitle,
    instructor: item.instructor,
    instructors: [item.instructor].filter(Boolean),
    rating: 5,
    reviews: 0,
    students: 0,
    category: item.category as Course['category'],
    topics: [item.category, item.tags[0] || item.category],
    badge: item.featured ? { label: 'Destacado', tone: 'hot' } : undefined,
    image: item.image_url,
    updatedAt: new Date().toLocaleDateString('es-CO'),
    language: item.language,
    captions: item.captions || item.language,
    learnings: item.learnings,
    tags: item.tags,
    includes: [
      { icon: 'video', label: 'Vídeo bajo demanda' },
      { icon: 'download', label: 'Materiales de clase' },
      { icon: 'certificate', label: 'Certificado de finalización' },
    ],
    firstLessonId: item.lessons?.[0]?.slug || item.lessons?.[0]?.id,
  }
}

export function mapCmsLesson(item: CmsLesson): CourseLesson & { videoUrl?: string } {
  return {
    id: item.slug || item.id,
    title: item.title,
    duration: item.duration,
    durationSeconds: item.duration_seconds,
    about: item.about,
    resources: item.resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      meta: resource.meta || resource.url,
      kind: resource.kind,
    })),
    videoUrl: item.video_url,
  }
}

export function mapCmsGroup(item: CmsGroupCoffee & { ocupados?: number; invited?: boolean; confirmed?: boolean }): GroupCoffee & {
  invited?: boolean
  confirmed?: boolean
} {
  return {
    id: item.id,
    titulo: item.titulo,
    anfitrion: item.anfitrion,
    tema: item.tema,
    fecha: item.fecha,
    lugar: item.lugar,
    ocupados: item.ocupados ?? item.seats.filter((seat) => seat.status === 'confirmed').length,
    cupos: item.cupos,
    invited: item.invited,
    confirmed: item.confirmed,
  }
}

export function mapCmsEvent(item: CmsEvent): NetworkingEvent {
  return {
    id: item.id,
    titulo: item.titulo,
    descripcion: item.descripcion,
    fecha: item.fecha_inicio || new Date().toISOString(),
    ciudad: item.ciudad,
    asistentes: item.asistentes,
    image: item.image_url,
    link: item.link || '#',
  }
}
