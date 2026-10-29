import type { SupabaseClient } from '@supabase/supabase-js'
import QRCode from 'qrcode'
import { sendBirdEmail } from '@/lib/bird-email'

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.snrg.lat').replace(/\/+$/, '')
}

export function paseUrl(token: string) {
  return `${siteUrl()}/pase/${encodeURIComponent(token)}`
}

export function puertaUrl(token: string) {
  return `${siteUrl()}/stitch/checkin.html?puerta=${encodeURIComponent(token)}`
}

export function paseQrImgUrl(token: string) {
  return `${siteUrl()}/api/evento/pase/${encodeURIComponent(token)}/qr`
}

export function extraerTokenPase(texto: string) {
  const raw = String(texto || '').trim()
  if (!raw) return ''
  const url = raw.match(/\/pase\/([a-zA-Z0-9]+)/)
  if (url) return url[1]
  const tk = raw.match(/(?:#?TK-)?([a-fA-F0-9]{16,})/)
  if (tk) return tk[1]
  return raw.replace(/^#/, '').trim()
}

export async function qrPng(token: string) {
  return QRCode.toBuffer(paseUrl(token), {
    type: 'png',
    width: 480,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: '#1a1b22', light: '#ffffff' },
  })
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}

function fechaEvento(ev: Record<string, unknown>) {
  const fecha = String(ev.fecha || '')
  const hora = String(ev.hora_inicio || '')
  if (!fecha) return 'Fecha por confirmar'
  const d = new Date(`${fecha}T12:00:00-05:00`)
  const dia = d.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota',
  })
  const cap = dia.charAt(0).toUpperCase() + dia.slice(1)
  const fin = ev.hora_fin ? ` – ${ev.hora_fin}` : ''
  return hora ? `${cap} · ${hora}${fin} COT` : cap
}

export function htmlPaseEmail(input: {
  nombre: string
  evento: Record<string, unknown>
  token: string
}) {
  const e = input.evento
  const titulo = String(e.titulo || 'Evento Synergy')
  const lugar = [e.lugar, e.ciudad].filter(Boolean).join(', ') || 'Lugar por confirmar'
  const incluye = String(e.incluye || '').trim()
  const acerca = String(e.acerca_del_evento || '').trim()
  const logo = `${siteUrl()}/logo.png`
  const qr = paseQrImgUrl(input.token)
  const link = paseUrl(input.token)
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f4f2fd;font-family:Arial,sans-serif;color:#1a1b22;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2fd;padding:24px 12px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 32px 8px;text-align:center;">
          <img src="${esc(logo)}" alt="Synergy" height="28" style="height:28px;width:auto;">
        </td></tr>
        <tr><td style="padding:8px 32px 0;text-align:center;">
          <p style="margin:0;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#4648d4;">Pase de ingreso</p>
          <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;">${esc(titulo)}</h1>
        </td></tr>
        <tr><td style="padding:16px 32px 0;font-size:15px;line-height:1.5;color:#46464b;">
          <p>Hola ${esc(input.nombre.split(' ')[0] || 'asistente')}, mañana es el encuentro. Lleva este correo (o la captura del QR) para confirmar tu ingreso en puerta.</p>
          <p style="margin:16px 0 8px;"><strong style="color:#1a1b22;">Cuándo:</strong> ${esc(fechaEvento(e))}<br>
          <strong style="color:#1a1b22;">Dónde:</strong> ${esc(lugar)}</p>
          ${acerca ? `<p>${esc(acerca)}</p>` : ''}
          ${incluye ? `<p><strong style="color:#1a1b22;">Incluye:</strong> ${esc(incluye)}</p>` : ''}
        </td></tr>
        <tr><td align="center" style="padding:12px 32px 8px;">
          <img src="${esc(qr)}" alt="QR de ingreso" width="220" height="220" style="width:220px;height:220px;border-radius:12px;border:1px solid #eeedf7;">
          <p style="margin:8px 0 0;font-size:12px;color:#77767b;">Muéstralo en la puerta · <a href="${esc(link)}" style="color:#4648d4;">Abrir pase digital</a></p>
        </td></tr>
        <tr><td style="padding:8px 32px 28px;font-size:12px;color:#77767b;text-align:center;">
          Synergy · snrg.lat
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export function htmlStaffEmail(input: {
  evento: Record<string, unknown>
  rol: string
  urlPuerta: string
}) {
  const titulo = String(input.evento.titulo || 'Evento Synergy')
  const lugar = [input.evento.lugar, input.evento.ciudad].filter(Boolean).join(', ') || 'Lugar por confirmar'
  const rolTxt = { cohost: 'co-anfitrión', puerta: 'staff de puerta', viewer: 'lectura' }[input.rol] || input.rol
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#f4f2fd;font-family:Arial,sans-serif;color:#1a1b22;">
  <table width="560" cellpadding="0" cellspacing="0" style="margin:0 auto;background:#ffffff;border-radius:16px;">
    <tr><td style="padding:28px 32px;">
      <img src="${esc(siteUrl() + '/logo.png')}" alt="Synergy" height="28">
      <h1 style="font-size:22px;margin:16px 0 8px;">Te invitaron a ${esc(titulo)}</h1>
      <p style="color:#46464b;line-height:1.5;">Quedaste como <strong>${esc(rolTxt)}</strong> de este evento.</p>
      <p style="color:#46464b;line-height:1.5;"><strong>Cuándo:</strong> ${esc(fechaEvento(input.evento))}<br>
      <strong>Dónde:</strong> ${esc(lugar)}</p>
      <p style="margin:24px 0;"><a href="${esc(input.urlPuerta)}" style="background:#1a1b21;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;display:inline-block;">Abrir check-in de puerta</a></p>
      <p style="font-size:12px;color:#77767b;">Guarda este enlace. Con él puedes escanear los QR de ingreso el día del evento, sin entrar al panel completo.</p>
    </td></tr>
  </table>
</body></html>`
}

const NO_PASE = new Set(['rechazado', 'lista_espera'])

export async function enviarPasesEvento(
  db: SupabaseClient,
  eventoId: string,
  opts?: { forzar?: boolean }
) {
  const { data: evento, error: evErr } = await db.from('eventos').select('*').eq('id', eventoId).maybeSingle()
  if (evErr || !evento) return { ok: false, enviados: 0, fallidos: 0, error: evErr?.message || 'Evento no encontrado' }

  const { data: asistentes } = await db
    .from('asistentes')
    .select('id, nombre, apellido, correo, estado_pago, ticket_token, pase_enviado_at')
    .eq('evento_id', eventoId)

  let enviados = 0
  let fallidos = 0
  let error: string | undefined

  for (const a of asistentes ?? []) {
    const correo = String(a.correo || '').trim()
    if (!correo.includes('@')) continue
    if (NO_PASE.has(String(a.estado_pago || ''))) continue
    if (a.pase_enviado_at && !opts?.forzar) continue

    let token = String(a.ticket_token || '')
    if (!token) {
      token = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('')
      await db.from('asistentes').update({ ticket_token: token }).eq('id', a.id)
    }

    const nombre = [a.nombre, a.apellido].filter(Boolean).join(' ').trim() || 'asistente'
    const r = await sendBirdEmail({
      to: [{ email: correo, name: nombre }],
      subject: `Tu pase QR · ${evento.titulo}`,
      html: htmlPaseEmail({ nombre, evento, token }),
      text: `Hola ${nombre.split(' ')[0]}, mañana es ${evento.titulo}. Abre tu pase: ${paseUrl(token)}`,
      category: 'transactional',
      tags: { tipo: 'pase_qr', evento_id: eventoId },
    })
    if (r.success) {
      enviados++
      await db.from('asistentes').update({ pase_enviado_at: new Date().toISOString() }).eq('id', a.id)
    } else {
      fallidos++
      error = r.error || error
    }
  }

  return { ok: enviados > 0 || fallidos === 0, enviados, fallidos, error }
}

export function mananaBogota() {
  const hoy = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' })
  const [y, m, d] = hoy.split('-').map(Number)
  const t = new Date(Date.UTC(y, m - 1, d))
  t.setUTCDate(t.getUTCDate() + 1)
  return t.toISOString().slice(0, 10)
}
