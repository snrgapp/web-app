/**
 * Cliente Inalambria Express (SMS). Variables:
 * INALAMBRIA_API_KEY — Bearer token
 * INALAMBRIA_API_BASE — opcional, default https://api.inalambria.express/v1
 */

const DEFAULT_BASE = 'https://api.inalambria.express/v1'

export type InalambriaSendResponse = Record<string, unknown>

export function getInalambriaApiBase(): string {
  return (process.env.INALAMBRIA_API_BASE ?? DEFAULT_BASE).replace(/\/$/, '')
}

export function phoneDigitsCo(raw: string): string {
  return raw.replace(/\D/g, '')
}

/** Teléfonos guardados sin prefijo internacional → E.164 CO (+57). */
export function toE164Colombia(digits: string): string {
  const d = phoneDigitsCo(digits)
  if (d.startsWith('57') && d.length >= 12) return `+${d}`
  return `+57${d}`
}

async function inalambriaPost<TBody extends Record<string, unknown>>(
  endpoint: string,
  body: TBody
): Promise<{ ok: true; data: unknown } | { ok: false; error: string; status?: number }> {
  const key = process.env.INALAMBRIA_API_KEY?.trim()
  if (!key) {
    return { ok: false, error: 'INALAMBRIA_API_KEY no configurada.' }
  }
  const base = getInalambriaApiBase()
  const url = `${base}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        ok: false,
        error: typeof data === 'object' && data && 'message' in data
          ? String((data as { message?: unknown }).message)
          : res.statusText,
        status: res.status,
      }
    }
    return { ok: true, data }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'fetch falló' }
  }
}

export async function sendInalambriaSmsBroadcast(content: string, phonesDigits: string[]) {
  const recipients = phonesDigits.map((p) => toE164Colombia(p))
  return inalambriaPost('/messages/send', {
    content,
    recipients,
    async: true,
  })
}

export type TemplateRecipient = { phone: string; vars: Record<string, string> }

export async function sendInalambriaSmsTemplate(pattern: string, recipients: TemplateRecipient[]) {
  return inalambriaPost('/messages/send/template', {
    pattern,
    recipients: recipients.map((r) => ({
      phone: toE164Colombia(r.phone),
      variables: r.vars,
    })),
    async: true,
  })
}

/** Consulta balance/créditos antes de envíos masivos. Ruta configurable por proveedor. */
export async function getInalambriaBalance(): Promise<{
  ok: boolean
  data?: unknown
  error?: string
}> {
  const key = process.env.INALAMBRIA_API_KEY?.trim()
  if (!key) return { ok: false, error: 'INALAMBRIA_API_KEY no configurada.' }
  const base = getInalambriaApiBase()
  const path = process.env.INALAMBRIA_BALANCE_PATH ?? '/account/balance'
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${key}` },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return {
        ok: false,
        error: typeof data === 'object' && data && 'message' in data
          ? String((data as { message?: unknown }).message)
          : `${res.status} ${res.statusText}`,
      }
    }
    return { ok: true, data }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'fetch falló' }
  }
}
