import { absoluteUrl } from '@/lib/site'
import type { Convocatoria } from '@/lib/radar-convocatorias-data'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function shell(inner: string) {
  return `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding-bottom:20px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#FFD60A;font-weight:700;">
              Radar de convocatorias · Synergy
            </td>
          </tr>
          ${inner}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function confirmationEmailHtml(unsubToken: string) {
  const radar = absoluteUrl('/radar-convocatorias')
  const baja = absoluteUrl(`/radar-convocatorias/baja?token=${unsubToken}`)
  return shell(`
    <tr>
      <td style="padding:28px;background:#141414;border-radius:16px;">
        <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#ffffff;">Tu alerta quedó activa</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#cfcfcf;">
          Cada lunes te enviaremos tres convocatorias de financiación y aceleración en Colombia, con enlace a las bases oficiales.
        </p>
        <a href="${radar}" style="display:inline-block;background:#FFD60A;color:#111;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:10px;">
          Ir al Radar
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding-top:20px;font-size:11px;color:#777;">
        Puedes cancelar cuando quieras: <a href="${baja}" style="color:#FFD60A;">darme de baja</a>
      </td>
    </tr>
  `)
}

export function digestEmailHtml(items: Convocatoria[], unsubToken: string) {
  const radar = absoluteUrl('/radar-convocatorias')
  const baja = absoluteUrl(`/radar-convocatorias/baja?token=${unsubToken}`)
  const cards = items
    .map((item) => {
      const href = item.basesUrl || item.sourceUrl || radar
      return `
        <tr>
          <td style="padding:18px 0;border-bottom:1px solid #2a2a2a;">
            <p style="margin:0 0 4px;font-size:11px;color:#FFD60A;text-transform:uppercase;letter-spacing:0.06em;">
              ${escapeHtml(item.entity)}
            </p>
            <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:#ffffff;">
              ${escapeHtml(item.title)}
            </p>
            <p style="margin:0 0 8px;font-size:13px;color:#bdbdbd;">
              ${escapeHtml(item.amountValue)} · ${escapeHtml(item.urgencyLabel)}
            </p>
            <a href="${href}" style="font-size:13px;color:#FFD60A;text-decoration:none;font-weight:700;">
              Ver bases y requisitos →
            </a>
          </td>
        </tr>`
    })
    .join('')

  return shell(`
    <tr>
      <td style="padding-bottom:16px;">
        <h1 style="margin:0;font-size:24px;line-height:1.3;color:#ffffff;">Tres convocatorias para esta semana</h1>
        <p style="margin:8px 0 0;font-size:14px;color:#cfcfcf;">
          Selección del Radar Synergy. Entra a la página para filtrar por etapa, sector y región.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 24px 8px;background:#141414;border-radius:16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cards}</table>
      </td>
    </tr>
    <tr>
      <td style="padding-top:24px;">
        <a href="${radar}" style="display:inline-block;background:#FFD60A;color:#111;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:10px;">
          Ver todas las convocatorias
        </a>
      </td>
    </tr>
    <tr>
      <td style="padding-top:20px;font-size:11px;color:#777;">
        <a href="${baja}" style="color:#FFD60A;">Cancelar suscripción</a>
      </td>
    </tr>
  `)
}
