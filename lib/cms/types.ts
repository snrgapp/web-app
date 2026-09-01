export const PAIRING_LIMITS = {
  free: 4,
  pro: 30,
} as const

export type MemberPlan = keyof typeof PAIRING_LIMITS

export type HomeCardKind = 'highlight' | 'discover'

export type CmsHomeCard = {
  id: string
  kind: HomeCardKind
  title: string
  body: string
  image_url: string
  href: string
  badge: string
  sort_order: number
  published: boolean
}

export type BenefitStatus = 'active' | 'paused'

export type CourseStatus = 'published' | 'draft' | 'archived'

export type CmsBenefit = {
  id: string
  slug: string
  name: string
  description: string
  offer: string
  category: string
  featured: boolean
  logo_label: string
  logo_bg: string
  logo_color: string
  brand_email: string
  redeem_instructions: string
  published: boolean
  brand: string
  cover_url: string
  status: BenefitStatus
}

export type CmsCourse = {
  id: string
  slug: string
  title: string
  short_title: string
  subtitle: string
  instructor: string
  category: string
  image_url: string
  language: string
  captions: string
  learnings: string[]
  tags: string[]
  featured: boolean
  published: boolean
  status: CourseStatus
  lessons?: CmsLesson[]
}

export type CmsLesson = {
  id: string
  course_id: string
  slug: string
  title: string
  about: string
  duration: string
  duration_seconds: number
  video_url: string
  sort_order: number
  resources: CmsLessonResource[]
}

export type CmsLessonResource = {
  id: string
  lesson_id: string
  title: string
  url: string
  kind: 'pdf' | 'chart' | 'repo' | 'article'
  meta: string
  sort_order: number
}

export type CmsGroupCoffee = {
  id: string
  titulo: string
  anfitrion: string
  tema: string
  fecha: string
  lugar: string
  cupos: number
  published: boolean
  seats: CmsCoffeeSeat[]
}

export type CmsCoffeeSeat = {
  id: string
  coffee_id: string
  member_id: string
  status: 'invited' | 'confirmed'
  nombre: string
  empresa: string
  email: string
}

export type CmsEvent = {
  id: string
  titulo: string
  descripcion: string
  fecha_inicio: string | null
  ciudad: string
  lugar: string
  image_url: string
  link: string
  published: boolean
  asistentes: number
}

export type CmsPairing = {
  id: string
  requester_id: string
  target_id: string
  status: 'requested' | 'confirmed' | 'declined'
  meet_at: string | null
  created_at: string
  requester_nombre: string
  requester_empresa: string
  target_nombre: string
  target_empresa: string
}

export type CmsDirectoryMember = {
  id: string
  nombre: string
  email: string
  empresa: string
  phone: string
  plan: MemberPlan
  ciudad?: string
  avatar_url?: string
  role?: string
  tags?: string[]
  industry?: string
  stage?: string
  team?: string
  founded?: string
  revenue?: string
  last_active_at?: string | null
}

export type CmsMemberPairingCard = {
  member: CmsDirectoryMember
  requested: number
  confirmed: number
  declined: number
  monthUsed: number
  monthLimit: number
}

export type CmsAnalyticsRow = {
  member: CmsDirectoryMember
  pairings: number
  coffees: number
  events: number
}
