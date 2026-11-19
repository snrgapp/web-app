import type { NextRequest } from 'next/server'

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

function hostDe(request: NextRequest) {
  return (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '')
    .replace(/:.*$/, '')
    .toLowerCase()
}

/** Guarda el clic y espera un momento para no perderlo en el 307. En local no se anota. */
export async function registrarClickEnlace(request: NextRequest, slug: string, destino: string) {
  const host = hostDe(request)
  if (!host || host.includes('localhost')) return

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

  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 800)
  try {
    await fetch(new URL('/api/enlace-clicks', request.url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fila),
      signal: ctrl.signal,
    })
  } catch {
    // El redirect sigue aunque el conteo falle.
  } finally {
    clearTimeout(t)
  }
}
