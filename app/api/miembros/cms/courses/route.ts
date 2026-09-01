import { NextRequest, NextResponse } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { getCourseBySlugOrId, listCourses } from '@/lib/cms/queries'

export async function GET(request: NextRequest) {
  try {
    await requireMember(request)
    const id = request.nextUrl.searchParams.get('id')
    if (id) {
      const result = await getCourseBySlugOrId(id, true)
      return NextResponse.json(result)
    }
    const result = await listCourses(true)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ data: [] })
  }
}
