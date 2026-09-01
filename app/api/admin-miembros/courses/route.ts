import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorized, requireMembersAdmin } from '@/lib/admin-miembros/auth'
import { deleteCourse, getCourseBySlugOrId, listCourses, upsertCourse } from '@/lib/cms/queries'

export async function GET(request: NextRequest) {
  try {
    await requireMembersAdmin()
    const id = request.nextUrl.searchParams.get('id')
    if (id) {
      const result = await getCourseBySlugOrId(id)
      return NextResponse.json(result)
    }
    const result = await listCourses()
    return NextResponse.json(result)
  } catch (error) {
    return adminUnauthorized(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireMembersAdmin(request)
    const payload = await request.json()
    if (!payload.title) return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })
    const result = await upsertCourse(payload)
    if (result.error) return NextResponse.json(result, { status: 400 })
    return NextResponse.json(result)
  } catch (error) {
    return adminUnauthorized(error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireMembersAdmin(request)
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })
    const result = await deleteCourse(id)
    if (result.error) return NextResponse.json(result, { status: 400 })
    return NextResponse.json(result)
  } catch (error) {
    return adminUnauthorized(error)
  }
}
