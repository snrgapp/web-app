import { birdApiHost } from '@/lib/bird-email'

export const RADAR_AUDIENCE_ID =
  process.env.BIRD_RADAR_AUDIENCE_ID || 'adn_01m2xcvz2sfpn8rqhgbfjgk2ba'

function birdHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

function toE164(phone: string | null | undefined) {
  if (!phone) return null
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10) return null
  if (phone.trim().startsWith('+')) return `+${digits}`
  const cc = process.env.DEFAULT_SMS_COUNTRY_CODE || '57'
  if (digits.startsWith(cc) && digits.length > 10) return `+${digits}`
  return `+${cc}${digits}`
}

export async function addRadarAudienceContact(input: {
  email?: string | null
  phone?: string | null
  firstName?: string | null
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BIRD_API_KEY ?? null
  if (!apiKey) return { success: false, error: 'BIRD_API_KEY no configurada' }

  const email = input.email?.trim().toLowerCase() || null
  const phone_number = toE164(input.phone)
  const first_name = input.firstName?.trim() || null
  if (!email && !phone_number) {
    return { success: false, error: 'Sin email ni teléfono' }
  }

  const contact: {
    email?: string
    phone_number?: string
    first_name?: string
    data: Record<string, string>
  } = {
    data: {
      origen: 'radar',
    },
  }
  if (email) contact.email = email
  if (phone_number) contact.phone_number = phone_number
  if (first_name) contact.first_name = first_name

  try {
    const response = await fetch(`${birdApiHost(apiKey)}/v1/contacts/batch`, {
      method: 'POST',
      headers: birdHeaders(apiKey),
      body: JSON.stringify({
        contacts: [contact],
        audience_ids: [RADAR_AUDIENCE_ID],
        match_on: email ? 'email' : 'phone_number',
      }),
    })
    if (!response.ok) {
      const body = await response.text()
      return { success: false, error: body.slice(0, 280) }
    }
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al guardar contacto',
    }
  }
}

export async function removeRadarAudienceContact(email: string): Promise<void> {
  const apiKey = process.env.BIRD_API_KEY ?? null
  if (!apiKey) return
  const q = email.trim().toLowerCase()
  if (!q) return

  try {
    const listed = await fetch(
      `${birdApiHost(apiKey)}/v1/audiences/${RADAR_AUDIENCE_ID}/contacts?q=${encodeURIComponent(q)}&limit=5`,
      { headers: birdHeaders(apiKey) }
    )
    if (!listed.ok) return
    const payload = (await listed.json()) as {
      data?: { contact?: { id?: string }; id?: string }[]
    }
    const contactId =
      payload.data?.[0]?.contact?.id || payload.data?.[0]?.id || null
    if (!contactId) return

    await fetch(
      `${birdApiHost(apiKey)}/v1/audiences/${RADAR_AUDIENCE_ID}/contacts/${contactId}`,
      { method: 'DELETE', headers: birdHeaders(apiKey) }
    )
  } catch (error) {
    console.error('radar audience remove', error)
  }
}
