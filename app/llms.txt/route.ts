import { NextResponse } from 'next/server'
import { absoluteUrl, getSiteBaseUrl } from '@/lib/site'

/**
 * Convención llms.txt: resumen legible para modelos y crawlers de IA.
 * @see https://llmstxt.org/
 */
export function GET() {
  const base = getSiteBaseUrl()
  const lines = [
    `# Synergy (SNRG)`,
    ``,
    `> Plataforma de networking para founders y makers: eventos, inscripción, networking en vivo, comunidad de miembros e IA para conectar perfiles.`,
    ``,
    `## Sitio principal`,
    `- [Inicio](${absoluteUrl('/inicio')})`,
    `- [Eventos](${absoluteUrl('/eventos')})`,
    `- [Contacto](${absoluteUrl('/contacto')})`,
    `- [Postula tu ciudad](${absoluteUrl('/postula-tu-ciudad')})`,
    ``,
    `## Producto y experiencias`,
    `- [Pitch / votación](${absoluteUrl('/pitch')})`,
    `- [Onboarding con IA](${absoluteUrl('/ia')})`,
    ``,
    `## Documentación y políticas`,
    `- [Términos](${absoluteUrl('/terminos')})`,
    `- [Privacidad](${absoluteUrl('/politica-privacidad')})`,
    `- [Cookies](${absoluteUrl('/politica-cookies')})`,
    `- [Uso de datos](${absoluteUrl('/uso-datos')})`,
    ``,
    `## Otros dominios del ecosistema`,
    `- Formularios de inscripción: ${process.env.NEXT_PUBLIC_INSCRIPCION_BASE_URL ?? 'https://inscripcion.snrg.lat'}`,
    `- App de networking en evento: https://app.snrg.lat`,
    `- Área de miembros: https://miembros.snrg.lat`,
    ``,
    `## Para crawlers`,
    `- Sitemap XML: ${base}/sitemap.xml`,
    `- Este archivo: ${base}/llms.txt`,
  ]

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
