import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorized, requireMembersAdmin } from '@/lib/admin-miembros/auth'
import { deleteLesson, deleteLessonResource, upsertLesson, upsertLessonResource } from '@/lib/cms/queries'

export async function POST(request: NextRequest) {
  try {
    await requireMembersAdmin(request)
    const payload = await request.json()
    if (payload.resource) {
      if (!payload.lesson_id || !payload.title) {
        return NextResponse.json({ error: 'Faltan datos del material' }, { status: 400 })
      }
      const result = await upsertLessonResource(payload)
      if (result.error) return NextResponse.json(result, { status: 400 })
      return NextResponse.json(result)
    }
    if (!payload.course_id || !payload.title) {
      return NextResponse.json({ error: 'Faltan datos de la clase' }, { status: 400 })
    }
    const result = await upsertLesson(payload)
    if (result.error) return NextResponse.json(result, { status: 400 })
    return NextResponse.json(result)
  } catch (error) {
    return adminUnauthorized(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireMembersAdmin(request)
    const payload = await request.json()
    const result = payload.resource
      ? await deleteLessonResource(payload.id)
      : await deleteLesson(payload.id)
    if (result.error) return NextResponse.json(result, { status: 400 })
    return NextResponse.json(result)
  } catch (error) {
    return adminUnauthorized(error)
  }
}
