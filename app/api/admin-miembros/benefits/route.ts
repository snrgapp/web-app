import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorized, requireMembersAdmin } from '@/lib/admin-miembros/auth'
import { deleteBenefit, listBenefitClaims, listBenefits, upsertBenefit } from '@/lib/cms/queries'

export async function GET() {
  try {
    await requireMembersAdmin()
    const [benefits, claims] = await Promise.all([listBenefits(), listBenefitClaims()])
    return NextResponse.json({ benefits: benefits.data, claims: claims.data, error: benefits.error || claims.error })
  } catch (error) {
    return adminUnauthorized(error)
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireMembersAdmin(request)
    const payload = await request.json()
    if (!payload.name) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
    const result = await upsertBenefit(payload)
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
    const result = await deleteBenefit(id)
    if (result.error) return NextResponse.json(result, { status: 400 })
    return NextResponse.json(result)
  } catch (error) {
    return adminUnauthorized(error)
  }
}
