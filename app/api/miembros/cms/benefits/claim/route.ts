import { NextRequest, NextResponse } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { cmsDb } from '@/lib/cms/client'
import { sendTransactionalEmail } from '@/lib/brevo-transactional'

export async function POST(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const { benefitId } = await request.json()
    const db = cmsDb()
    if (!db || !benefitId) {
      return NextResponse.json({ error: 'No se pudo reclamar el beneficio' }, { status: 400 })
    }

    const { data: benefit, error: benefitError } = await db
      .from('member_benefits')
      .select('*')
      .eq('id', benefitId)
      .eq('published', true)
      .maybeSingle()
    if (benefitError || !benefit) {
      return NextResponse.json({ error: 'Beneficio no disponible' }, { status: 404 })
    }

    const { data: existing } = await db
      .from('member_benefit_claims')
      .select('id')
      .eq('benefit_id', benefitId)
      .eq('member_id', member.id)
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ ok: true, already: true })
    }

    const memberEmail = member.email
    const brandEmail = benefit.brand_email
    const memberHtml = `
      <p>Hola ${member.nombre || 'founder'},</p>
      <p>Confirmamos tu solicitud del beneficio <strong>${benefit.name}</strong> (${benefit.offer}).</p>
      <p>${benefit.redeem_instructions || 'El equipo de la marca te contactará con los siguientes pasos para redimirlo.'}</p>
    `
    const brandHtml = `
      <p>Un emprendedor de Synergy solicitó activar <strong>${benefit.name}</strong>.</p>
      <ul>
        <li>Nombre: ${member.nombre || 'Sin nombre'}</li>
        <li>Empresa: ${member.empresa || 'No indicada'}</li>
        <li>Correo: ${member.email || 'No indicado'}</li>
        <li>Teléfono: ${member.phone || 'No indicado'}</li>
      </ul>
    `

    const memberMail = memberEmail
      ? await sendTransactionalEmail({
          to: [{ email: memberEmail, name: member.nombre || undefined }],
          subject: `Tu beneficio ${benefit.name} en Synergy`,
          html: memberHtml,
        })
      : { success: false, error: 'El emprendedor no tiene correo' }

    const brandMail = brandEmail
      ? await sendTransactionalEmail({
          to: [{ email: brandEmail, name: benefit.name }],
          subject: `${member.nombre || 'Un founder'} solicitó ${benefit.name}`,
          html: brandHtml,
        })
      : { success: false, error: 'La marca no tiene correo' }

    const status = memberMail.success || brandMail.success ? 'sent' : 'failed'
    const { error } = await db.from('member_benefit_claims').insert({
      benefit_id: benefitId,
      member_id: member.id,
      status,
      member_notified_at: memberMail.success ? new Date().toISOString() : null,
      brand_notified_at: brandMail.success ? new Date().toISOString() : null,
      error_message: [memberMail.error, brandMail.error].filter(Boolean).join(' · ') || null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({
      ok: true,
      emailedMember: memberMail.success,
      emailedBrand: brandMail.success,
    })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Error al reclamar' }, { status: 500 })
  }
}
