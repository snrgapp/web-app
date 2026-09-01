import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorized, requireMembersAdmin } from '@/lib/admin-miembros/auth'
import {
  deleteEvent,
  deleteGroupCoffee,
  listDirectoryMembers,
  listEvents,
  listGroupCoffees,
  listPairings,
  upsertEvent,
  upsertGroupCoffee,
} from '@/lib/cms/queries'

export async function GET() {
  try {
    await requireMembersAdmin()
    const [coffees, events, pairings, members] = await Promise.all([
      listGroupCoffees(),
      listEvents(),
      listPairings(),
      listDirectoryMembers(),
    ])
    return NextResponse.json({
      coffees: coffees.data,
      events: events.data,
      pairings: pairings.data.filter((item) => item.status === 'confirmed'),
      members: members.data,
      error: coffees.error || events.error || pairings.error || members.error,
    })
  } catch (error) {
    return adminUnauthorized(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireMembersAdmin(request)
    const payload = await request.json()
    if (payload.kind === 'event') {
      if (!payload.titulo) return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })
      const result = await upsertEvent(payload)
      if (result.error) return NextResponse.json(result, { status: 400 })
      return NextResponse.json(result)
    }
    if (!payload.titulo || !payload.fecha) {
      return NextResponse.json({ error: 'Título y fecha son obligatorios' }, { status: 400 })
    }
    if ((payload.member_ids || []).length > 6) {
      return NextResponse.json({ error: 'Un café grupal admite máximo 6 personas' }, { status: 400 })
    }
    const result = await upsertGroupCoffee(payload)
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
    const result = payload.kind === 'event' ? await deleteEvent(payload.id) : await deleteGroupCoffee(payload.id)
    if (result.error) return NextResponse.json(result, { status: 400 })
    return NextResponse.json(result)
  } catch (error) {
    return adminUnauthorized(error)
  }
}
