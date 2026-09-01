import { cmsDb, isMissingRelation, slugify, asStringArray } from './client'
import { PAIRING_LIMITS, type MemberPlan, type CmsAnalyticsRow, type CmsBenefit, type CmsCourse, type CmsDirectoryMember, type CmsEvent, type CmsGroupCoffee, type CmsHomeCard, type CmsLesson, type CmsLessonResource, type CmsMemberPairingCard, type CmsPairing } from './types'

function missingDb() {
  return { error: 'Supabase no está configurado' }
}

function tableMissing() {
  return { error: 'Falta aplicar la migración 066_members_panel_schema.sql en Supabase' }
}

function mapBenefit(row: Record<string, any>): CmsBenefit {
  const status = row.status === 'paused' || row.published === false ? 'paused' : 'active'
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    offer: row.offer || '',
    category: row.category,
    featured: Boolean(row.featured),
    logo_label: row.logo_label || row.name?.[0] || 'B',
    logo_bg: row.logo_bg || '#232F3E',
    logo_color: row.logo_color || '#FFFFFF',
    brand_email: row.brand_email || '',
    redeem_instructions: row.redeem_instructions || '',
    published: status === 'active',
    brand: row.brand || row.name || '',
    cover_url: row.cover_url || '',
    status,
  }
}

function mapHome(row: Record<string, any>): CmsHomeCard {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body || '',
    image_url: row.image_url || '',
    href: row.href || '',
    badge: row.badge || '',
    sort_order: row.sort_order ?? 0,
    published: row.published !== false,
  }
}

function mapCourse(row: Record<string, any>, lessons: CmsLesson[] = []): CmsCourse {
  const status =
    row.status === 'draft' || row.status === 'archived'
      ? row.status
      : row.published === false
        ? 'draft'
        : 'published'
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    short_title: row.short_title || row.title,
    subtitle: row.subtitle || '',
    instructor: row.instructor || '',
    category: row.category,
    image_url: row.image_url || '',
    language: row.language || 'Español',
    captions: row.captions || '',
    learnings: asStringArray(row.learnings),
    tags: asStringArray(row.tags),
    featured: Boolean(row.featured),
    published: status === 'published',
    status,
    lessons,
  }
}

function mapLesson(row: Record<string, any>, resources: CmsLessonResource[] = []): CmsLesson {
  return {
    id: row.id,
    course_id: row.course_id,
    slug: row.slug,
    title: row.title,
    about: row.about || '',
    duration: row.duration || '00:00',
    duration_seconds: row.duration_seconds || 0,
    video_url: row.video_url || '',
    sort_order: row.sort_order ?? 0,
    resources,
  }
}

function mapMember(row: Record<string, any>): CmsDirectoryMember {
  const plan = row.plan === 'pro' ? 'pro' : 'free'
  return {
    id: row.id,
    nombre: row.nombre || 'Sin nombre',
    email: row.email || '',
    empresa: row.empresa || '',
    phone: row.phone || '',
    plan,
    ciudad: row.ciudad || '',
    avatar_url: row.avatar_url || '',
    role: row.role || '',
    tags: Array.isArray(row.tags) ? row.tags.map(String).filter(Boolean) : [],
    industry: row.industry || '',
    stage: row.stage || '',
    team: row.team || '',
    founded: row.founded || '',
    revenue: row.revenue || '',
    last_active_at: row.last_active_at || null,
  }
}

export async function listHomeCards(publishedOnly = false) {
  const db = cmsDb()
  if (!db) return { data: [] as CmsHomeCard[], ...missingDb() }
  let query = db.from('member_home_cards').select('*').order('sort_order', { ascending: true })
  if (publishedOnly) query = query.eq('published', true)
  const { data, error } = await query
  if (isMissingRelation(error)) return { data: [] as CmsHomeCard[], ...tableMissing() }
  if (error) return { data: [] as CmsHomeCard[], error: error.message }
  return { data: (data || []).map(mapHome) }
}

export async function upsertHomeCard(payload: Partial<CmsHomeCard> & { title: string }) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const body = {
    kind: payload.kind || 'highlight',
    title: payload.title,
    body: payload.body || '',
    image_url: payload.image_url || '',
    href: payload.href || '',
    badge: payload.badge || '',
    sort_order: payload.sort_order ?? 0,
    published: payload.published !== false,
    updated_at: new Date().toISOString(),
  }
  if (payload.id) {
    const { data, error } = await db.from('member_home_cards').update(body).eq('id', payload.id).select('*').single()
    if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
    return { data: mapHome(data) }
  }
  const { data, error } = await db.from('member_home_cards').insert(body).select('*').single()
  if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
  return { data: mapHome(data) }
}

export async function deleteHomeCard(id: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const { error } = await db.from('member_home_cards').delete().eq('id', id)
  if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
  return { ok: true }
}

export async function listBenefits(publishedOnly = false) {
  const db = cmsDb()
  if (!db) return { data: [] as CmsBenefit[], ...missingDb() }
  let query = db.from('member_benefits').select('*').order('created_at', { ascending: false })
  if (publishedOnly) query = query.eq('published', true)
  const { data, error } = await query
  if (isMissingRelation(error)) return { data: [] as CmsBenefit[], ...tableMissing() }
  if (error) return { data: [] as CmsBenefit[], error: error.message }
  return { data: (data || []).map(mapBenefit) }
}

export async function upsertBenefit(payload: Partial<CmsBenefit> & { name: string }) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const body = {
    slug: payload.slug || slugify(payload.name),
    name: payload.name,
    description: payload.description || '',
    offer: payload.offer || '',
    category: payload.category || 'Productividad',
    featured: Boolean(payload.featured),
    logo_label: payload.logo_label || payload.name.slice(0, 2),
    logo_bg: payload.logo_bg || '#232F3E',
    logo_color: payload.logo_color || '#FFFFFF',
    brand_email: payload.brand_email || '',
    redeem_instructions: payload.redeem_instructions || '',
    brand: payload.brand || payload.name,
    cover_url: payload.cover_url || '',
    status: payload.status === 'paused' || payload.published === false ? 'paused' : 'active',
    published: payload.status === 'paused' || payload.published === false ? false : true,
    updated_at: new Date().toISOString(),
  }
  if (payload.id) {
    const { data, error } = await db.from('member_benefits').update(body).eq('id', payload.id).select('*').single()
    if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
    return { data: mapBenefit(data) }
  }
  const { data, error } = await db.from('member_benefits').insert(body).select('*').single()
  if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
  return { data: mapBenefit(data) }
}

export async function deleteBenefit(id: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const { error } = await db.from('member_benefits').delete().eq('id', id)
  if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
  return { ok: true }
}

export async function listBenefitClaims() {
  const db = cmsDb()
  if (!db) return { data: [], ...missingDb() }
  const { data, error } = await db
    .from('member_benefit_claims')
    .select('*, member_benefits(name, brand), members(nombre, email, phone, empresa)')
    .order('created_at', { ascending: false })
  if (isMissingRelation(error)) return { data: [], ...tableMissing() }
  if (error) return { data: [], error: error.message }
  return {
    data: (data || []).map((row: Record<string, any>) => ({
      id: row.id,
      status: row.status,
      created_at: row.created_at,
      benefit: row.member_benefits?.name || '',
      brand: row.member_benefits?.brand || row.member_benefits?.name || '',
      nombre: row.members?.nombre || '',
      email: row.members?.email || '',
      phone: row.members?.phone || '',
      empresa: row.members?.empresa || '',
      member_notified_at: row.member_notified_at,
      brand_notified_at: row.brand_notified_at,
      error_message: row.error_message,
    })),
  }
}

export async function listCourses(publishedOnly = false) {
  const db = cmsDb()
  if (!db) return { data: [] as CmsCourse[], ...missingDb() }
  let query = db.from('member_courses').select('*').order('created_at', { ascending: false })
  if (publishedOnly) query = query.eq('published', true)
  const { data, error } = await query
  if (isMissingRelation(error)) return { data: [] as CmsCourse[], ...tableMissing() }
  if (error) return { data: [] as CmsCourse[], error: error.message }
  return { data: (data || []).map((row: Record<string, any>) => mapCourse(row)) }
}

export async function getCourseBySlugOrId(idOrSlug: string, publishedOnly = false) {
  const db = cmsDb()
  if (!db) return { data: null as CmsCourse | null, ...missingDb() }
  const bySlug = db.from('member_courses').select('*').eq('slug', idOrSlug)
  const slugQuery = publishedOnly ? bySlug.eq('published', true) : bySlug
  let { data, error } = await slugQuery.maybeSingle()
  if (!data && !error) {
    const byId = db.from('member_courses').select('*').eq('id', idOrSlug)
    const idQuery = publishedOnly ? byId.eq('published', true) : byId
    const second = await idQuery.maybeSingle()
    data = second.data
    error = second.error
  }
  if (isMissingRelation(error)) return { data: null, ...tableMissing() }
  if (error || !data) return { data: null, error: error?.message }
  const lessons = await listLessons(data.id)
  return { data: mapCourse(data, lessons.data) }
}

export async function upsertCourse(payload: Partial<CmsCourse> & { title: string }) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const body = {
    slug: payload.slug || slugify(payload.title),
    title: payload.title,
    short_title: payload.short_title || payload.title,
    subtitle: payload.subtitle || '',
    instructor: payload.instructor || '',
    category: payload.category || 'Estrategia y Liderazgo',
    image_url: payload.image_url || '',
    language: payload.language || 'Español',
    captions: payload.captions || '',
    learnings: asStringArray(payload.learnings),
    tags: asStringArray(payload.tags),
    featured: Boolean(payload.featured),
    status:
      payload.status === 'draft' || payload.status === 'archived'
        ? payload.status
        : payload.published === false
          ? 'draft'
          : 'published',
    published:
      payload.status === 'archived' || payload.status === 'draft'
        ? false
        : payload.published !== false,
    updated_at: new Date().toISOString(),
  }
  if (payload.id) {
    const { data, error } = await db.from('member_courses').update(body).eq('id', payload.id).select('*').single()
    if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
    return { data: mapCourse(data) }
  }
  const { data, error } = await db.from('member_courses').insert(body).select('*').single()
  if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
  return { data: mapCourse(data) }
}

export async function deleteCourse(id: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const { error } = await db.from('member_courses').delete().eq('id', id)
  if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
  return { ok: true }
}

export async function listLessons(courseId: string) {
  const db = cmsDb()
  if (!db) return { data: [] as CmsLesson[], ...missingDb() }
  const { data, error } = await db
    .from('member_course_lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true })
  if (isMissingRelation(error)) return { data: [] as CmsLesson[], ...tableMissing() }
  if (error) return { data: [] as CmsLesson[], error: error.message }
  const lessons = data || []
  const ids = lessons.map((row: Record<string, any>) => row.id)
  let resources: Record<string, CmsLessonResource[]> = {}
  if (ids.length) {
    const { data: resourceRows } = await db
      .from('member_lesson_resources')
      .select('*')
      .in('lesson_id', ids)
      .order('sort_order', { ascending: true })
    for (const row of resourceRows || []) {
      const item: CmsLessonResource = {
        id: row.id,
        lesson_id: row.lesson_id,
        title: row.title,
        url: row.url || '',
        kind: row.kind,
        meta: row.meta || '',
        sort_order: row.sort_order ?? 0,
      }
      resources[row.lesson_id] = [...(resources[row.lesson_id] || []), item]
    }
  }
  return { data: lessons.map((row: Record<string, any>) => mapLesson(row, resources[row.id] || [])) }
}

export async function upsertLesson(payload: Partial<CmsLesson> & { course_id: string; title: string }) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const body = {
    course_id: payload.course_id,
    slug: payload.slug || slugify(payload.title),
    title: payload.title,
    about: payload.about || '',
    duration: payload.duration || '00:00',
    duration_seconds: payload.duration_seconds || 0,
    video_url: payload.video_url || '',
    sort_order: payload.sort_order ?? 0,
  }
  if (payload.id) {
    const { data, error } = await db.from('member_course_lessons').update(body).eq('id', payload.id).select('*').single()
    if (error) return { error: error.message }
    return { data: mapLesson(data, payload.resources || []) }
  }
  const { data, error } = await db.from('member_course_lessons').insert(body).select('*').single()
  if (error) return { error: error.message }
  return { data: mapLesson(data, []) }
}

export async function deleteLesson(id: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const { error } = await db.from('member_course_lessons').delete().eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function upsertLessonResource(payload: Partial<CmsLessonResource> & { lesson_id: string; title: string }) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const body = {
    lesson_id: payload.lesson_id,
    title: payload.title,
    url: payload.url || '',
    kind: payload.kind || 'pdf',
    meta: payload.meta || '',
    sort_order: payload.sort_order ?? 0,
  }
  if (payload.id) {
    const { data, error } = await db.from('member_lesson_resources').update(body).eq('id', payload.id).select('*').single()
    if (error) return { error: error.message }
    return { data }
  }
  const { data, error } = await db.from('member_lesson_resources').insert(body).select('*').single()
  if (error) return { error: error.message }
  return { data }
}

export async function deleteLessonResource(id: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const { error } = await db.from('member_lesson_resources').delete().eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function listDirectoryMembers() {
  const db = cmsDb()
  if (!db) return { data: [] as CmsDirectoryMember[], ...missingDb() }
  const full = await db
    .from('members')
    .select('id, nombre, email, empresa, phone, plan, ciudad, avatar_url, role, tags, industry, stage, team, founded, revenue, last_active_at')
    .order('nombre', { ascending: true })
    .limit(500)
  if (!full.error) return { data: (full.data || []).map(mapMember) }
  const { data, error } = await db
    .from('members')
    .select('id, nombre, email, empresa, phone, plan')
    .order('nombre', { ascending: true })
    .limit(500)
  if (error) return { data: [] as CmsDirectoryMember[], error: error.message }
  return { data: (data || []).map(mapMember) }
}

export async function listGroupCoffees(publishedOnly = false) {
  const db = cmsDb()
  if (!db) return { data: [] as CmsGroupCoffee[], ...missingDb() }
  let query = db.from('member_group_coffees').select('*').order('fecha', { ascending: true })
  if (publishedOnly) query = query.eq('published', true)
  const { data, error } = await query
  if (isMissingRelation(error)) return { data: [] as CmsGroupCoffee[], ...tableMissing() }
  if (error) return { data: [] as CmsGroupCoffee[], error: error.message }
  const coffees = data || []
  const ids = coffees.map((row: Record<string, any>) => row.id)
  const seatsByCoffee: Record<string, CmsGroupCoffee['seats']> = {}
  if (ids.length) {
    const { data: seats } = await db
      .from('member_group_coffee_seats')
      .select('*, members(nombre, empresa, email)')
      .in('coffee_id', ids)
    for (const seat of seats || []) {
      const item = {
        id: seat.id,
        coffee_id: seat.coffee_id,
        member_id: seat.member_id,
        status: seat.status,
        nombre: seat.members?.nombre || 'Sin nombre',
        empresa: seat.members?.empresa || '',
        email: seat.members?.email || '',
      }
      seatsByCoffee[seat.coffee_id] = [...(seatsByCoffee[seat.coffee_id] || []), item]
    }
  }
  return {
    data: coffees.map((row: Record<string, any>) => ({
      id: row.id,
      titulo: row.titulo,
      anfitrion: row.anfitrion || '',
      tema: row.tema || '',
      fecha: row.fecha,
      lugar: row.lugar || '',
      cupos: row.cupos || 6,
      published: row.published !== false,
      seats: seatsByCoffee[row.id] || [],
    })),
  }
}

export async function upsertGroupCoffee(
  payload: Partial<CmsGroupCoffee> & { titulo: string; fecha: string; member_ids?: string[] }
) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const memberIds = Array.from(new Set(payload.member_ids || [])).slice(0, 6)
  const body = {
    titulo: payload.titulo,
    anfitrion: payload.anfitrion || '',
    tema: payload.tema || '',
    fecha: payload.fecha,
    lugar: payload.lugar || '',
    cupos: Math.min(payload.cupos || 6, 6),
    published: payload.published !== false,
    updated_at: new Date().toISOString(),
  }
  let coffeeId = payload.id
  if (coffeeId) {
    const { error } = await db.from('member_group_coffees').update(body).eq('id', coffeeId)
    if (error) return { error: error.message }
  } else {
    const { data, error } = await db.from('member_group_coffees').insert(body).select('id').single()
    if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
    coffeeId = data.id
  }
  if (payload.member_ids) {
    await db.from('member_group_coffee_seats').delete().eq('coffee_id', coffeeId)
    if (memberIds.length) {
      const { error } = await db.from('member_group_coffee_seats').insert(
        memberIds.map((member_id) => ({ coffee_id: coffeeId, member_id, status: 'invited' }))
      )
      if (error) return { error: error.message }
    }
  }
  const list = await listGroupCoffees()
  return { data: list.data.find((item) => item.id === coffeeId) }
}

export async function deleteGroupCoffee(id: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const { error } = await db.from('member_group_coffees').delete().eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function confirmCoffeeSeat(coffeeId: string, memberId: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const { data: seat, error } = await db
    .from('member_group_coffee_seats')
    .select('id, status')
    .eq('coffee_id', coffeeId)
    .eq('member_id', memberId)
    .maybeSingle()
  if (error) return { error: isMissingRelation(error) ? tableMissing().error : error.message }
  if (!seat) return { error: 'Este café es solo por invitación del equipo Synergy' }
  const { error: updateError } = await db
    .from('member_group_coffee_seats')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
    .eq('id', seat.id)
  if (updateError) return { error: updateError.message }
  return { ok: true, status: 'confirmed' as const }
}

export async function listEvents(publishedOnly = false) {
  const db = cmsDb()
  if (!db) return { data: [] as CmsEvent[], ...missingDb() }
  let query = db.from('member_events').select('*').order('fecha_inicio', { ascending: true })
  if (publishedOnly) query = query.eq('published', true)
  const { data, error } = await query
  if (error) return { data: [] as CmsEvent[], error: error.message }
  const events = data || []
  const ids = events.map((row: Record<string, any>) => row.id)
  const counts: Record<string, number> = {}
  if (ids.length) {
    const { data: attendance } = await db.from('event_attendance').select('event_id').in('event_id', ids)
    for (const row of attendance || []) {
      counts[row.event_id] = (counts[row.event_id] || 0) + 1
    }
  }
  return {
    data: events.map((row: Record<string, any>) => ({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion || '',
      fecha_inicio: row.fecha_inicio,
      ciudad: row.ciudad || row.lugar || '',
      lugar: row.lugar || '',
      image_url: row.image_url || '',
      link: row.link || '',
      published: row.published !== false,
      asistentes: counts[row.id] || 0,
    })),
  }
}

export async function upsertEvent(payload: Partial<CmsEvent> & { titulo: string }) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const body = {
    titulo: payload.titulo,
    descripcion: payload.descripcion || '',
    fecha_inicio: payload.fecha_inicio || null,
    ciudad: payload.ciudad || '',
    lugar: payload.lugar || payload.ciudad || '',
    image_url: payload.image_url || '',
    link: payload.link || '',
    published: payload.published !== false,
    updated_at: new Date().toISOString(),
  }
  if (payload.id) {
    const { data, error } = await db.from('member_events').update(body).eq('id', payload.id).select('*').single()
    if (error) return { error: error.message }
    return { data }
  }
  const { data, error } = await db.from('member_events').insert(body).select('*').single()
  if (error) return { error: error.message }
  return { data }
}

export async function deleteEvent(id: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const { error } = await db.from('member_events').delete().eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function listPairings() {
  const db = cmsDb()
  if (!db) return { data: [] as CmsPairing[], ...missingDb() }
  const { data, error } = await db
    .from('member_pairings')
    .select('*, requester:members!member_pairings_requester_id_fkey(nombre, empresa), target:members!member_pairings_target_id_fkey(nombre, empresa)')
    .order('created_at', { ascending: false })
  if (isMissingRelation(error)) return { data: [] as CmsPairing[], ...tableMissing() }
  if (error) {
    const fallback = await db.from('member_pairings').select('*').order('created_at', { ascending: false })
    if (fallback.error) return { data: [] as CmsPairing[], error: fallback.error.message }
    const members = await listDirectoryMembers()
    const byId = Object.fromEntries(members.data.map((item) => [item.id, item]))
    return {
      data: (fallback.data || []).map((row: Record<string, any>) => ({
        id: row.id,
        requester_id: row.requester_id,
        target_id: row.target_id,
        status: row.status,
        meet_at: row.meet_at,
        created_at: row.created_at,
        requester_nombre: byId[row.requester_id]?.nombre || 'Emprendedor',
        requester_empresa: byId[row.requester_id]?.empresa || '',
        target_nombre: byId[row.target_id]?.nombre || 'Emprendedor',
        target_empresa: byId[row.target_id]?.empresa || '',
      })),
    }
  }
  return {
    data: (data || []).map((row: Record<string, any>) => ({
      id: row.id,
      requester_id: row.requester_id,
      target_id: row.target_id,
      status: row.status,
      meet_at: row.meet_at,
      created_at: row.created_at,
      requester_nombre: row.requester?.nombre || 'Emprendedor',
      requester_empresa: row.requester?.empresa || '',
      target_nombre: row.target?.nombre || 'Emprendedor',
      target_empresa: row.target?.empresa || '',
    })),
  }
}

export async function listPairingCards() {
  const members = await listDirectoryMembers()
  const pairings = await listPairings()
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const cards: CmsMemberPairingCard[] = members.data.map((member) => {
    const mine = pairings.data.filter(
      (item) => item.requester_id === member.id || item.target_id === member.id
    )
    const requestedByMe = pairings.data.filter((item) => item.requester_id === member.id)
    const monthUsed = requestedByMe.filter((item) => new Date(item.created_at) >= startOfMonth).length
    return {
      member,
      requested: mine.filter((item) => item.status === 'requested').length,
      confirmed: mine.filter((item) => item.status === 'confirmed').length,
      declined: mine.filter((item) => item.status === 'declined').length,
      monthUsed,
      monthLimit: PAIRING_LIMITS[member.plan],
    }
  })
  return { data: cards, error: members.error || pairings.error }
}

export async function confirmPairing(id: string, meetAt?: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  const { error } = await db
    .from('member_pairings')
    .update({
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      meet_at: meetAt || new Date().toISOString(),
    })
    .eq('id', id)
  if (error) return { error: error.message }
  return { ok: true }
}

export async function requestPairing(requesterId: string, targetId: string) {
  const db = cmsDb()
  if (!db) return { error: missingDb().error }
  if (requesterId === targetId) return { error: 'No puedes emparejarte contigo mismo' }
  const { data: member } = await db.from('members').select('id, plan').eq('id', requesterId).maybeSingle()
  const plan: MemberPlan = member?.plan === 'pro' ? 'pro' : 'free'
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)
  const { data: usedRows, error: usedError } = await db
    .from('member_pairings')
    .select('id, created_at')
    .eq('requester_id', requesterId)
    .gte('created_at', startOfMonth.toISOString())
  if (usedError && !isMissingRelation(usedError)) return { error: usedError.message }
  const used = usedRows?.length || 0
  const limit = PAIRING_LIMITS[plan]
  if (used >= limit) {
    return { error: `Tu plan ${plan} permite ${limit} emparejamientos este mes` }
  }
  const { data, error } = await db
    .from('member_pairings')
    .insert({ requester_id: requesterId, target_id: targetId, status: 'requested' })
    .select('*')
    .single()
  if (error) {
    if (error.code === '23505') return { error: 'Ya solicitaste este emparejamiento' }
    return { error: isMissingRelation(error) ? tableMissing().error : error.message }
  }
  return { data, remaining: limit - used - 1 }
}

export async function listConfirmedOneToOnes(memberId: string) {
  const pairings = await listPairings()
  return {
    data: pairings.data
      .filter((item) => item.status === 'confirmed')
      .filter((item) => item.requester_id === memberId || item.target_id === memberId)
      .map((item) => {
        const isRequester = item.requester_id === memberId
        return {
          id: item.id,
          nombre: isRequester ? item.target_nombre : item.requester_nombre,
          empresa: isRequester ? item.target_empresa : item.requester_empresa,
          rol: 'Founder',
          fecha: item.meet_at || item.created_at,
          estado: 'aceptado' as const,
        }
      }),
    error: pairings.error,
  }
}

export async function memberAnalytics(memberId: string) {
  const db = cmsDb()
  if (!db) return { pairings: 0, events: 0, coffees: 0, ...missingDb() }
  const [pairings, events, coffees] = await Promise.all([
    db
      .from('member_pairings')
      .select('id', { count: 'exact', head: true })
      .or(`requester_id.eq.${memberId},target_id.eq.${memberId}`)
      .eq('status', 'confirmed'),
    db.from('event_attendance').select('id', { count: 'exact', head: true }).eq('member_id', memberId),
    db
      .from('member_group_coffee_seats')
      .select('id', { count: 'exact', head: true })
      .eq('member_id', memberId)
      .eq('status', 'confirmed'),
  ])
  return {
    pairings: pairings.count || 0,
    events: events.count || 0,
    coffees: coffees.count || 0,
    error: isMissingRelation(pairings.error) || isMissingRelation(coffees.error)
      ? tableMissing().error
      : pairings.error?.message || events.error?.message || coffees.error?.message,
  }
}

export async function adminAnalytics() {
  const members = await listDirectoryMembers()
  const db = cmsDb()
  if (!db) return { data: [] as CmsAnalyticsRow[], ...missingDb() }
  const [pairings, seats, attendance] = await Promise.all([
    db.from('member_pairings').select('requester_id, target_id, status'),
    db.from('member_group_coffee_seats').select('member_id, status'),
    db.from('event_attendance').select('member_id'),
  ])
  const pairingCount: Record<string, number> = {}
  for (const row of pairings.data || []) {
    if (row.status !== 'confirmed') continue
    pairingCount[row.requester_id] = (pairingCount[row.requester_id] || 0) + 1
    pairingCount[row.target_id] = (pairingCount[row.target_id] || 0) + 1
  }
  const coffeeCount: Record<string, number> = {}
  for (const row of seats.data || []) {
    if (row.status !== 'confirmed') continue
    coffeeCount[row.member_id] = (coffeeCount[row.member_id] || 0) + 1
  }
  const eventCount: Record<string, number> = {}
  for (const row of attendance.data || []) {
    eventCount[row.member_id] = (eventCount[row.member_id] || 0) + 1
  }
  return {
    data: members.data.map((member) => ({
      member,
      pairings: pairingCount[member.id] || 0,
      coffees: coffeeCount[member.id] || 0,
      events: eventCount[member.id] || 0,
    })),
    error: members.error,
  }
}
