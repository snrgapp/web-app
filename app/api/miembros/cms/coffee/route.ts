import { NextRequest, NextResponse } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { confirmCoffeeSeat, listConfirmedOneToOnes, listEvents, listGroupCoffees } from '@/lib/cms/queries'

export async function GET(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const [ones, groups, events] = await Promise.all([
      listConfirmedOneToOnes(member.id),
      listGroupCoffees(true),
      listEvents(true),
    ])
    return NextResponse.json({
      ones: ones.data,
      groups: groups.data.map((group) => ({
        ...group,
        ocupados: group.seats.filter((seat) => seat.status === 'confirmed').length,
        invited: group.seats.some((seat) => seat.member_id === member.id),
        confirmed: group.seats.some((seat) => seat.member_id === member.id && seat.status === 'confirmed'),
      })),
      events: events.data,
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ ones: [], groups: [], events: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const { coffeeId } = await request.json()
    const result = await confirmCoffeeSeat(coffeeId, member.id)
    if (result.error) return NextResponse.json(result, { status: 400 })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'No se pudo confirmar' }, { status: 500 })
  }
}
