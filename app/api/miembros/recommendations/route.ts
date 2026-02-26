import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'

/** Obtiene la ciudad del miembro. Si no tiene, intenta inferirla desde asistentes+eventos (mismo teléfono). */
async function getMemberCiudad(
  supabase: ReturnType<typeof import('@/utils/supabase/admin').createAdminClient>,
  member: { id: string; phone?: string | null; ciudad?: string | null }
): Promise<string | null> {
  if (!supabase) return null
  const db = supabase
  if (member.ciudad?.trim()) return member.ciudad.trim()

  if (!member.phone?.trim()) return null

  const phoneNorm = member.phone.replace(/\D/g, '').replace(/^52/, '')
  const phoneVariants = [member.phone, `+52${phoneNorm}`, phoneNorm, `+${phoneNorm}`].filter(
    (p) => p && p.length >= 10
  )
  const uniquePhones = [...new Set(phoneVariants)]
  if (uniquePhones.length === 0) return null

  const { data: asistentes } = await db
    .from('asistentes')
    .select('evento_id')
    .in('telefono', uniquePhones)
    .not('evento_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)

  const asistente = asistentes?.[0]
  if (!asistente?.evento_id) return null

  const { data: evento } = await db
    .from('eventos')
    .select('ciudad')
    .eq('id', asistente.evento_id)
    .single()

  const ciudad = evento?.ciudad?.trim() || null
  if (ciudad) {
    await db.from('members').update({ ciudad, updated_at: new Date().toISOString() }).eq('id', member.id)
  }
  return ciudad
}

export async function GET(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const { data: memberRow } = await supabase
      .from('members')
      .select('id, phone, ciudad')
      .eq('id', member.id)
      .single()

    const memberForCiudad = {
      id: member.id,
      phone: memberRow?.phone ?? member.phone,
      ciudad: memberRow?.ciudad ?? (member as { ciudad?: string | null }).ciudad ?? null,
    }
    const ciudad = await getMemberCiudad(supabase, memberForCiudad)

    const { data: connections } = await supabase
      .from('connections')
      .select('connected_member_id')
      .eq('member_id', member.id)

    const alreadyConnected = new Set((connections || []).map((c) => c.connected_member_id))
    alreadyConnected.add(member.id)

    let query = supabase
      .from('members')
      .select('id, nombre, empresa, email, phone, ciudad')
      .neq('id', member.id)
      .limit(50)

    if (ciudad) {
      query = query.eq('ciudad', ciudad)
    }

    const { data: allMembers } = await query

    const recommendations = (allMembers || [])
      .filter((m) => !alreadyConnected.has(m.id))
      .slice(0, 20)
      .map((m) => ({
        id: m.id,
        nombre: m.nombre || 'Sin nombre',
        empresa: m.empresa || '',
        email: m.email || '',
        phone: m.phone || '',
      }))

    return Response.json({ recommendations })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
