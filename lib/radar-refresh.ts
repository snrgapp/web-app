import { createAdminClient } from '@/utils/supabase/admin'
import type { Convocatoria, Urgency } from '@/lib/radar-convocatorias-data'
import { RADAR_SOURCES, looksLikeConvocatoria, seedBySlug } from '@/lib/radar-sources'

const UA =
  'SynergyRadar/1.0 (+https://snrg.lat/radar-convocatorias; uso informativo de listados públicos)'

const MONTHS: Record<string, number> = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  setiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
}

export type RadarRefreshResult = {
  ok: boolean
  scrapedAt: string
  sources: {
    slug: string
    portal: string
    status: number | 'error'
    updated: boolean
    note: string
    sourceUrl: string
  }[]
}

function decode(html: string) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
}

function stripTags(html: string) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' '),
  ).trim()
}

function resolveUrl(href: string, base: string) {
  try {
    return new URL(href, base).toString()
  } catch {
    return base
  }
}

function scoreConvocatoriaLink(href: string, text: string) {
  const blob = `${href} ${text}`.toLowerCase()
  if (/mailto:|javascript:|facebook|twitter|instagram|linkedin|youtube/.test(blob)) return -1
  if (!looksLikeConvocatoria(blob)) return -1
  let score = 1
  if (/convocatoria|conv-|fondo-?emprender|terminos|t[eé]rminos|llamado/.test(blob)) score += 3
  if (/pdf|\.pdf(\?|$)/.test(blob)) score += 2
  if (href.split('/').length > 4) score += 1
  if (text.length > 24) score += 1
  return score
}

function extractLinks(html: string, base: string) {
  const links: { href: string; text: string; score: number }[] = []
  const re = /<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let match: RegExpExecArray | null
  while ((match = re.exec(html))) {
    const text = stripTags(match[2]).slice(0, 180)
    const href = resolveUrl(match[1], base)
    const score = scoreConvocatoriaLink(href, text)
    if (text.length < 8 || score < 0) continue
    links.push({ href, text, score })
  }
  return links.sort((a, b) => b.score - a.score)
}

function parseSpanishDate(text: string): Date | null {
  const m = text.match(
    /(\d{1,2})\s+de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s+de\s+(\d{4})/i,
  )
  if (!m) return null
  const month = MONTHS[m[2].toLowerCase()]
  if (month == null) return null
  return new Date(Date.UTC(Number(m[3]), month, Number(m[1])))
}

function parseCloseDate(text: string): Date | null {
  const labeled = text.match(/cierre[:\s]+([^.]{8,60})/i)
  return parseSpanishDate(labeled?.[1] ?? text)
}

function parseAmount(text: string): string | null {
  const m = text.match(/\$[\s]?[\d.]{3,18}(?:\s*(?:millones|COP|USD))?/i)
  return m ? m[0].replace(/\s+/g, ' ').trim() : null
}

function urgencyFromClose(close: Date | null): { urgency: Urgency; label: string; isOpen: boolean } {
  if (!close) {
    return { urgency: 'open', label: 'Consultar cierre en el portal', isOpen: true }
  }
  const today = new Date()
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  const end = Date.UTC(close.getUTCFullYear(), close.getUTCMonth(), close.getUTCDate())
  const days = Math.round((end - start) / 86400000)
  const labelDate = close.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  })
  if (days < 0) {
    return { urgency: 'upcoming', label: `Cerró el ${labelDate}`, isOpen: false }
  }
  if (days <= 5) return { urgency: 'urgent', label: `Quedan ${days} días`, isOpen: true }
  if (days <= 21) return { urgency: 'soon', label: `Cierra en ${days} días`, isOpen: true }
  return { urgency: 'open', label: `Cierre: ${labelDate}`, isOpen: true }
}

async function fetchPublic(url: string): Promise<{ status: number; html: string } | { status: 'error'; html: string }> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 15000)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
      cache: 'no-store',
    })
    const html = await res.text()
    return { status: res.status, html: html.slice(0, 800_000) }
  } catch (err) {
    return { status: 'error', html: err instanceof Error ? err.message : 'fetch failed' }
  } finally {
    clearTimeout(t)
  }
}

function applyScrape(seed: Convocatoria, pageText: string, bestLink?: { href: string; text: string }): Convocatoria {
  const close = parseCloseDate(pageText)
  const amount = parseAmount(pageText)
  const status = urgencyFromClose(close)
  const titleFromLink = bestLink?.text && bestLink.text.length > 18 ? bestLink.text : seed.title
  return {
    ...seed,
    title: titleFromLink.slice(0, 140),
    amountValue: amount ?? seed.amountValue,
    urgency: status.urgency,
    urgencyLabel: status.label,
    sourceUrl: bestLink?.href ?? seed.basesUrl ?? seed.sourceUrl ?? '',
    basesUrl: bestLink?.href ?? seed.basesUrl ?? seed.sourceUrl ?? '',
    closesAt: close ? close.toISOString().slice(0, 10) : seed.closesAt,
    isOpen: status.isOpen,
    scrapedAt: new Date().toISOString(),
    keywords: `${seed.keywords} ${titleFromLink}`.toLowerCase(),
  }
}

export async function refreshRadarConvocatorias(): Promise<RadarRefreshResult> {
  const seeds = seedBySlug()
  const scrapedAt = new Date().toISOString()
  const sources: RadarRefreshResult['sources'] = []
  const rows: {
    slug: string
    card: Convocatoria
    source_portal: string
    source_url: string
    closes_at: string | null
    is_open: boolean
    scrape_ok: boolean
    scrape_note: string
    scraped_at: string
    updated_at: string
  }[] = []

  for (const source of RADAR_SOURCES) {
    const seed = seeds[source.slug]
    if (!seed) continue
    const urls = [source.url, ...(source.extraUrls ?? [])]
    let html = ''
    let status: number | 'error' = 'error'
    let used = source.url

    for (const url of urls) {
      const page = await fetchPublic(url)
      status = page.status
      if (page.status !== 'error' && page.status < 400 && page.html.length > 400) {
        html = page.html
        used = url
        break
      }
      if (page.status === 'error') html = page.html
    }

    if (!html || status === 'error' || (typeof status === 'number' && status >= 400)) {
      const fallback: Convocatoria = {
        ...seed,
        sourceUrl: seed.basesUrl || seed.sourceUrl || source.url,
        basesUrl: seed.basesUrl || seed.sourceUrl || source.url,
        scrapedAt,
        isOpen: seed.isOpen ?? true,
      }
      rows.push({
        slug: source.slug,
        card: fallback,
        source_portal: source.portal,
        source_url: source.url,
        closes_at: fallback.closesAt ?? null,
        is_open: fallback.isOpen ?? true,
        scrape_ok: false,
        scrape_note: `No se pudo leer el portal (${String(status)})`,
        scraped_at: scrapedAt,
        updated_at: scrapedAt,
      })
      sources.push({
        slug: source.slug,
        portal: source.portal,
        status,
        updated: false,
        note: 'Se mantiene la ficha anterior. El portal no respondió.',
        sourceUrl: source.url,
      })
      continue
    }

    const text = stripTags(html)
    const links = extractLinks(html, used)
    const best = links[0]
    const card = applyScrape(
      { ...seed, sourceUrl: seed.basesUrl || seed.sourceUrl || source.url, basesUrl: seed.basesUrl || seed.sourceUrl || source.url },
      `${best?.text ?? ''} ${text.slice(0, 8000)}`,
      best ?? { href: used, text: seed.title },
    )

    rows.push({
      slug: source.slug,
      card,
      source_portal: source.portal,
      source_url: card.basesUrl || card.sourceUrl || used,
      closes_at: card.closesAt ?? null,
      is_open: card.isOpen ?? true,
      scrape_ok: true,
      scrape_note: best ? `Actualizado desde listado público: ${best.text}` : 'Portal leído; sin enlace nuevo',
      scraped_at: scrapedAt,
      updated_at: scrapedAt,
    })
    sources.push({
      slug: source.slug,
      portal: source.portal,
      status,
      updated: true,
      note: best?.text ?? 'Portal leído',
      sourceUrl: card.sourceUrl || used,
    })
  }

  const supabase = createAdminClient()
  if (supabase && rows.length) {
    const { error } = await supabase.from('radar_convocatorias').upsert(rows, { onConflict: 'slug' })
    if (error) {
      return { ok: false, scrapedAt, sources: sources.map((s) => ({ ...s, note: error.message })) }
    }
  }

  return { ok: true, scrapedAt, sources }
}
