import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para subdominios:
 * - inscripcion.snrg.lat → /inscripcion/:path
 * - app.snrg.lat → /home/:path (networking, etc.)
 */
const INSCRIPCION_HOSTS = [
  'inscripcion.snrg.lat',
  'www.inscripcion.snrg.lat',
  'inscripcion.localhost',
]

const APP_HOSTS = [
  'app.snrg.lat',
  'www.app.snrg.lat',
  'app.localhost',
]

function matchesHosts(req: NextRequest, hosts: string[]): boolean {
  const host = req.headers.get('host') ?? ''
  const forwardedHost = req.headers.get('x-forwarded-host') ?? ''
  const check = (h: string) =>
    hosts.some((ih) => h === ih || h.startsWith(`${ih}:`))
  return check(host) || check(forwardedHost)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Subdominio inscripcion.snrg.lat
  if (matchesHosts(request, INSCRIPCION_HOSTS)) {
    if (pathname.startsWith('/inscripcion') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
      return NextResponse.next()
    }
    const newPath = pathname === '/' ? '/inscripcion' : `/inscripcion${pathname}`
    const url = request.nextUrl.clone()
    url.pathname = newPath
    return NextResponse.rewrite(url)
  }

  // Subdominio app.snrg.lat
  if (matchesHosts(request, APP_HOSTS)) {
    if (pathname.startsWith('/home') || pathname.startsWith('/networking') || pathname.startsWith('/api') || pathname.startsWith('/_next')) {
      return NextResponse.next()
    }
    // Raíz del subdominio app → /home
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/home'
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
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
