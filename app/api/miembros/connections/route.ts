import { NextRequest } from 'next/server'
import { requireMember } from '@/lib/members/auth'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const member = await requireMember(request)
    const supabase = createAdminClient()
    if (!supabase) {
      return Response.json({ error: 'Error de configuración' }, { status: 500 })
    }

    const { data: connections } = await supabase
      .from('connections')
      .select('id, tipo, created_at, connected_member_id')
      .eq('member_id', member.id)
      .order('created_at', { ascending: false })
      .limit(20)

    const connectedIds = [...new Set((connections || []).map((c) => c.connected_member_id))]
    const { data: connectedMembers } = await supabase
      .from('members')
      .select('id, nombre, empresa, email, phone')
      .in('id', connectedIds)

    const memberMap = new Map((connectedMembers || []).map((m) => [m.id, m]))

    const connectionCounts: Record<string, number> = {}
    for (const c of connections || []) {
      const id = c.connected_member_id
      if (id) {
        connectionCounts[id] = (connectionCounts[id] || 0) + 1
      }
    }

    const connectionRanking = Object.entries(connectionCounts)
      .map(([id, count]) => ({
        id,
        count,
        nombre: memberMap.get(id)?.nombre || 'Sin nombre',
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const { data: referralRanking } = await supabase
      .from('members')
      .select('id, nombre, referido_por_id')
      .not('referido_por_id', 'is', null)

    const referralCounts: Record<string, number> = {}
    for (const m of referralRanking || []) {
      if (m.referido_por_id) {
        referralCounts[m.referido_por_id] = (referralCounts[m.referido_por_id] || 0) + 1
      }
    }

    const referralRankingList = Object.entries(referralCounts)
      .map(([id, count]) => {
        const m = (referralRanking || []).find((r) => r.id === id)
        return { id, count, nombre: m?.nombre || 'Sin nombre' }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    const latestConnections = (connections || []).map((c) => {
      const cm = memberMap.get(c.connected_member_id)
      return {
        id: c.id,
        created_at: c.created_at,
        nombre: cm?.nombre || 'Sin nombre',
        empresa: cm?.empresa || '',
        email: cm?.email || '',
        phone: cm?.phone || '',
      }
    })

    return Response.json({
      latestConnections,
      connectionRanking,
      referralRanking: referralRankingList,
    })
  } catch (e) {
    if (e instanceof Response) return e
    return Response.json({ error: 'Error interno' }, { status: 500 })
  }
}
