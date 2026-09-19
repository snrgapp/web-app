import { createAdminClient } from '@/utils/supabase/admin'
import { sendBirdEmail } from '@/lib/bird-email'
import { digestEmailHtml } from '@/lib/radar-emails'
import { loadRadarConvocatorias } from '@/lib/radar-load'
import { isOpenToday, type Convocatoria } from '@/lib/radar-convocatorias-data'

const RANK: Record<string, number> = {
  urgent: 0,
  soon: 1,
  open: 2,
  continuous: 3,
  upcoming: 4,
}

export function pickWeeklyConvocatorias(items: Convocatoria[]) {
  const open = items.filter(isOpenToday)
  const pool = open.length ? open : items
  return [...pool]
    .sort((a, b) => (RANK[a.urgency] ?? 9) - (RANK[b.urgency] ?? 9))
    .slice(0, 3)
}

export async function sendRadarWeeklyDigest() {
  const admin = createAdminClient()
  if (!admin) return { ok: false, sent: 0, error: 'Sin cliente admin' }

  const { items } = await loadRadarConvocatorias()
  const picks = pickWeeklyConvocatorias(items)
  if (picks.length === 0) return { ok: false, sent: 0, error: 'Sin convocatorias' }

  const cutoff = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  const { data: subs, error } = await admin
    .from('radar_alertas')
    .select('id, email, unsubscribe_token, last_digest_at, canal, confirmed_at')
    .eq('active', true)
    .not('email', 'is', null)
    .not('confirmed_at', 'is', null)

  if (error) return { ok: false, sent: 0, error: error.message }

  const due = (subs ?? []).filter((row) => {
    if (row.canal === 'whatsapp') return false
    if (!row.email) return false
    if (!row.last_digest_at) return true
    return row.last_digest_at < cutoff
  })

  let sent = 0
  for (const row of due) {
    const mail = await sendBirdEmail({
      to: [{ email: row.email as string }],
      subject: 'Tres convocatorias para esta semana · Radar Synergy',
      html: digestEmailHtml(picks, row.unsubscribe_token),
      text: picks.map((p) => `${p.entity}: ${p.title}`).join('\n'),
      category: 'marketing',
      tags: { product: 'radar', type: 'weekly' },
    })
    if (mail.success) {
      sent += 1
      await admin
        .from('radar_alertas')
        .update({ last_digest_at: new Date().toISOString() })
        .eq('id', row.id)
    }
  }

  return { ok: true, sent, total: due.length }
}
