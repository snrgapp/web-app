function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function firstName(nombre: string) {
  return nombre.trim().split(/\s+/)[0] || 'founder'
}

export function waitlistConfirmationEmail(input: { nombre: string; ciudad: string }) {
  const name = escapeHtml(firstName(input.nombre))
  const city = escapeHtml(input.ciudad.trim() || 'tu ciudad')

  return `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#f5f5f5;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <tr>
            <td style="padding-bottom:20px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#FFE100;font-weight:700;">
              Lista de espera · Synergy
            </td>
          </tr>
          <tr>
            <td style="padding:28px;background:#141414;border-radius:16px;">
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:#ffffff;">
                ${name}, ya tienes tu lugar en ${city}
              </h1>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#cfcfcf;">
                Recibimos tu inscripción. Quedaste en la lista de espera de Synergy para cuando
                abramos comunidad y encuentros en ${city}.
              </p>
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#cfcfcf;">
                Aún no hay fecha pública. En cuanto definamos el primer espacio, te escribimos
                con el detalle: ciudad, cupos y cómo reservar tu puesto.
              </p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#cfcfcf;">
                Mientras tanto, sigue construyendo. Nosotros te avisamos.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding-top:20px;font-size:11px;color:#777;">
              Synergy · Founders &amp; Makers
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function waitlistConfirmationText(input: { nombre: string; ciudad: string }) {
  const name = firstName(input.nombre)
  const city = input.ciudad.trim() || 'tu ciudad'
  return `${name}, ya tienes tu lugar en ${city}.

Recibimos tu inscripción a la lista de espera de Synergy. Cuando definamos el primer espacio en ${city}, te escribiremos con fechas, cupos y cómo reservar.

Synergy · Founders & Makers`
}
