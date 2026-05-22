/** Mensaje al abrir WhatsApp desde conexiones sugeridas (meet & greet). */
export const HACKATHON_MEETGREET_WHATSAPP_TEXT =
  'Hola estoy en el meet & greet. ¿Como te encuentro?'

/** Dígitos para parámetro `phone` de api.whatsapp.com (Colombia +57 por defecto). */
export function hackathonWhatsappPhoneParam(raw: string | null | undefined): string | null {
  if (!raw) return null
  const d = raw.replace(/\D/g, '')
  if (d.length < 7) return null
  return d.startsWith('57') ? d : `57${d}`
}

export function hackathonWhatsappMeetGreetHref(telefono: string | null | undefined): string | null {
  const p = hackathonWhatsappPhoneParam(telefono)
  if (!p) return null
  const text = encodeURIComponent(HACKATHON_MEETGREET_WHATSAPP_TEXT)
  return `https://api.whatsapp.com/send?phone=${p}&text=${text}`
}
