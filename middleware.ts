import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para el subdominio inscripcion.snrg.lat.
 * Fallback: si next.config rewrites no aplican, reescribe /:path → /inscripcion/:path.
 * Soporta host, x-forwarded-host y variantes (www.).
 */
const INSCRIPCION_HOSTS = [
  'inscripcion.snrg.lat',
  'www.inscripcion.snrg.lat',
  'inscripcion.localhost',
]

function isInscripcionSubdomain(req: NextRequest): boolean {
  const host = req.headers.get('host') ?? ''
  const forwardedHost = req.headers.get('x-forwarded-host') ?? ''
  const check = (h: string) =>
    INSCRIPCION_HOSTS.some((ih) => h === ih || h.startsWith(`${ih}:`))
  return check(host) || check(forwardedHost)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (!isInscripcionSubdomain(request)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/inscripcion') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const newPath = pathname === '/' ? '/inscripcion' : `/inscripcion${pathname}`
  const url = request.nextUrl.clone()
  url.pathname = newPath
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images|logo.png).*)',
  ],
}
