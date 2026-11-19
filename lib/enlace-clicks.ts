import type { NextRequest } from 'next/server'

export const ENLACE_DESTINOS: Record<string, string> = {
  reunion: 'https://www.eventos.snrg.lat/proxima_reunion',
}

export function clasificarClick(ua: string): 'visita' | 'preview' | 'bot' {
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

export function filaClick(request: NextRequest, slug: string, destino: string) {
  const host = (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '')
    .replace(/:.*$/, '')
    .toLowerCase()
  const ua = request.headers.get('user-agent') || ''
  return {
    slug: slug.replace(/^\//, ''),
    host: host || null,
    destino,
    referrer: request.headers.get('referer') || null,
    user_agent: ua.slice(0, 500) || null,
    pais: request.headers.get('x-vercel-ip-country') || request.headers.get('cf-ipcountry') || null,
    tipo: clasificarClick(ua),
  }
}
