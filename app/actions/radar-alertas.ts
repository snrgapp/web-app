'use server'

import { createClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/utils/supabase/admin'
import { sendBirdEmail } from '@/lib/bird-email'
import { confirmationEmailHtml } from '@/lib/radar-emails'
import { absoluteUrl } from '@/lib/site'

const RADAR_CONFIRM_TEMPLATE =
  process.env.BIRD_RADAR_CONFIRM_TEMPLATE ||
  'plantilla-de-inscripci-n-convocatorias-2026-09-19-17-13-22'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function radarDb() {
  const admin = createAdminClient()
  if (admin) return admin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  if (!url || !anon) return null
  return createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

async function sendRadarConfirmation(email: string, token: string) {
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
    console.error('radar confirmation template', mail.error)
    mail = await sendBirdEmail({
      to: [{ email }],
      subject: 'Confirma tu alerta del Radar Synergy',
      html: confirmationEmailHtml(token),
      text: `Confirma tu correo: ${confirmUrl}`,
      category: 'transactional',
      tags: { product: 'radar', type: 'confirmation' },
    })
  }
  if (!mail.success) {
    console.error('radar confirmation fallback', mail.error)
  }
  return mail
}

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

  const supabase = radarDb()
  if (!supabase) return { success: false, error: 'No se pudo conectar.' }

  const { data: token, error } = await supabase.rpc('upsert_radar_alerta', {
    p_email: email,
    p_telefono: telefono,
    p_departamento: departamento,
    p_canal: canal,
  })

  if (error || !token) {
    console.error('radar_alertas upsert', error)
    return { success: false, error: 'No se pudo guardar la alerta.' }
  }

  if (email) {
    const mail = await sendRadarConfirmation(email, token)
    if (!mail.success) {
      return {
        success: false,
        error:
          'Quedaste inscrito, pero el correo no salió. Falta configurar BIRD_API_KEY en Vercel.',
      }
    }
    await supabase.rpc('mark_radar_confirmation_sent', { p_token: token })
  }

  return { success: true }
}
