'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createServerClient } from '@/utils/supabase/server'
import { sendBirdEmail } from '@/lib/bird-email'
import { confirmationEmailHtml } from '@/lib/radar-emails'
import { absoluteUrl } from '@/lib/site'

const RADAR_CONFIRM_TEMPLATE =
  process.env.BIRD_RADAR_CONFIRM_TEMPLATE ||
  'plantilla-de-inscripci-n-convocatorias-2026-09-19-17-13-22'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function subscribeRadarAlertasAction(input: {
  contact: string
  departamento: string
  canal: string
}): Promise<{ success: boolean; error?: string }> {
  const raw = input.contact.trim()
  const departamento = input.departamento.trim() || 'bogota'
  const canal = input.canal.trim() || 'email'

  const isEmail = EMAIL_RE.test(raw)
  const phone = raw.replace(/\D/g, '')
  const email = isEmail ? raw.toLowerCase() : null
  const telefono = !isEmail && phone.length >= 10 ? raw : null

  if (canal !== 'whatsapp' && !email) {
    return { success: false, error: 'Para correo necesitamos un email válido.' }
  }
  if (canal === 'whatsapp' && !telefono && !email) {
    return { success: false, error: 'Escribe un celular o un correo.' }
  }

  const token = crypto.randomUUID()
  const supabase = createAdminClient() ?? (await createServerClient())
  if (!supabase) return { success: false, error: 'No se pudo conectar.' }

  const { error } = await supabase.from('radar_alertas').insert({
    email,
    telefono,
    departamento,
    canal,
    unsubscribe_token: token,
    confirmed_at: canal === 'whatsapp' ? new Date().toISOString() : null,
  })

  if (error) {
    if (error.code === '23505' && email) return { success: true }
    return { success: false, error: 'No se pudo guardar la alerta.' }
  }

  if (email) {
    const confirmUrl = absoluteUrl(`/radar-convocatorias/confirmar?token=${token}`)
    const unsubscribeUrl = absoluteUrl(`/radar-convocatorias/baja?token=${token}`)
    let mail = await sendBirdEmail({
      to: [{ email }],
      template: {
        slug: RADAR_CONFIRM_TEMPLATE,
        parameters: {
          confirm_url: confirmUrl,
          unsubscribe_url: unsubscribeUrl,
        },
      },
      category: 'transactional',
      tags: { product: 'radar', type: 'confirmation' },
    })
    if (!mail.success) {
      mail = await sendBirdEmail({
        to: [{ email }],
        subject: 'Tu alerta del Radar Synergy está activa',
        html: confirmationEmailHtml(token),
        text: `Confirma tu correo: ${confirmUrl}`,
        category: 'transactional',
        tags: { product: 'radar', type: 'confirmation' },
      })
    }
    if (mail.success) {
      await supabase
        .from('radar_alertas')
        .update({ confirmation_sent_at: new Date().toISOString() })
        .eq('unsubscribe_token', token)
    }
  }

  return { success: true }
}
