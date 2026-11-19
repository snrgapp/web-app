import type { NextFetchEvent, NextRequest } from 'next/server'

function clasificar(ua: string): 'visita' | 'preview' | 'bot' {
  const u = ua.toLowerCase()
  if (
    /whatsapp|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|iframely|embedly|skypeuripreview|pinterest|vkshare/.test(
      u
    )
  ) {
    return 'preview'
  }
  if (/bot|crawler|spider|crawling|preview|lighthouse|pagespeed|headless|prerender/.test(u)) {
    return 'bot'
  }
  return 'visita'
}

/** Anota el clic sin retrasar el 307. En local no se guarda. */
export function registrarClickEnlace(
  request: NextRequest,
  event: NextFetchEvent,
  slug: string,
  destino: string
) {
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '')
    .replace(/:.*$/, '')
    .toLowerCase()
  if (!host || host.includes('localhost')) return

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return

  const ua = request.headers.get('user-agent') || ''
  const fila = {
    slug: slug.replace(/^\//, ''),
    host,
    destino,
    referrer: request.headers.get('referer') || null,
    user_agent: ua.slice(0, 500) || null,
    pais: request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || null,
    tipo: clasificar(ua),
  }

  event.waitUntil(
    fetch(`${url}/rest/v1/enlace_clicks`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(fila),
    })
      .then(async (r) => {
        if (!r.ok) await r.text().catch(() => '')
      })
      .catch(() => {})
  )
}
