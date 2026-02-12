import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware para el subdominio inscripcion.snrg.lat.
 * Reescribe requests de inscripcion.snrg.lat/:path* a /inscripcion/:path*
 * para servir formularios dinámicos sin cambiar la URL visible.
 */
const INSCRIPCION_HOST = 'inscripcion.snrg.lat'
const INSCRIPCION_HOST_LOCAL = 'inscripcion.localhost'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const pathname = request.nextUrl.pathname

  const isInscripcionSubdomain =
    host === INSCRIPCION_HOST || host.startsWith(`${INSCRIPCION_HOST_LOCAL}:`)

  if (isInscripcionSubdomain && !pathname.startsWith('/inscripcion')) {
    const newPath = pathname === '/' ? '/inscripcion' : `/inscripcion${pathname}`
    const url = request.nextUrl.clone()
    url.pathname = newPath
    return NextResponse.rewrite(url)
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
