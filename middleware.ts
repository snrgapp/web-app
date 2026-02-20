import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@/utils/supabase/middleware'
import { getCookieName, hasValidSessionFormat } from '@/lib/members/session-edge'

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

const MIEMBROS_HOSTS = [
  'miembros.snrg.lat',
  'www.miembros.snrg.lat',
  'miembros.localhost',
]

function matchesHosts(req: NextRequest, hosts: string[]): boolean {
  // En Vercel/proxy: x-forwarded-host tiene el host original del usuario
  const forwardedHost = req.headers.get('x-forwarded-host') ?? ''
  const host = req.headers.get('host') ?? ''
  const effectiveHost = (forwardedHost || host).replace(/:.*$/, '')
  return hosts.some(
    (h) => effectiveHost === h || effectiveHost.startsWith(h + ':')
  )
}

/** Extrae slug de org desde host (para header x-org-slug) */
function getOrgSlugFromHost(req: NextRequest): string {
  const host = req.headers.get('host') ?? req.headers.get('x-forwarded-host') ?? ''
  const bare = host.replace(/:.*/, '')
  const parts = bare.split('.')
  if (parts.includes('localhost')) return 'snrg'
  if (parts[0] === 'app' && parts.length >= 2) return parts[1]
  if (parts[0] === 'inscripcion' && parts.length >= 2) return parts[1]
  return parts[0] ?? 'snrg'
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const orgSlug = getOrgSlugFromHost(request)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-org-slug', orgSlug)

  const isMiembrosHost = matchesHosts(request, MIEMBROS_HOSTS)

  // Subdominio miembros.snrg.lat: PRIMERO, aislar completamente del resto de la app
  // Todo en miembros.* solo sirve el panel de miembros, nunca el login del admin ni snrg.lat
  if (isMiembrosHost) {
    if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
      return NextResponse.next({ request: { headers: requestHeaders } })
    }
    const isLoginPath = pathname === '/login' || pathname === '/miembros/login'
    const protectedPaths = ['/', '/inicio', '/red-contactos', '/eventos', '/recursos', '/asesorias', '/beneficios', '/notificaciones', '/configuracion']
    const isProtectedPath =
      pathname === '/' ||
      protectedPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`)) ||
      (pathname.startsWith('/miembros') && !isLoginPath)
    // Bypass auth solo en desarrollo local (NODE_ENV=development + host localhost)
    const devHost =
      (request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '').replace(/:.*$/, '')
    const isLocalDev =
      process.env.NODE_ENV === 'development' && devHost.includes('localhost')

    if (isProtectedPath && !isLoginPath && !isLocalDev) {
      const cookieName = getCookieName()
      const token = request.cookies.get(cookieName)?.value
      if (!token || !hasValidSessionFormat(token)) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname === '/' ? '' : pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
    let newPath: string
    if (pathname.startsWith('/miembros')) {
      newPath = pathname
    } else {
      const rewriteMap: Record<string, string> = {
        '/': '/miembros',
        '/login': '/miembros/login',
        '/inicio': '/miembros',
        '/red-contactos': '/miembros/red-contactos',
        '/eventos': '/miembros/eventos',
        '/recursos': '/miembros/recursos',
        '/asesorias': '/miembros/asesorias',
        '/beneficios': '/miembros/beneficios',
        '/notificaciones': '/miembros/notificaciones',
        '/configuracion': '/miembros/configuracion',
      }
      newPath =
        rewriteMap[pathname] ??
        (pathname === '/' ? '/miembros' : `/miembros${pathname}`)
    }
    const url = request.nextUrl.clone()
    url.pathname = newPath
    return NextResponse.rewrite(url)
  }

  // Proteger /panel: requiere sesión Supabase Auth (solo cuando NO es subdominio miembros)
  if (
    pathname.startsWith('/panel') &&
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ) {
    try {
      const reqWithOrg = new NextRequest(request.url, { headers: requestHeaders })
      const { supabase, response } = await createMiddlewareClient(reqWithOrg)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
      }
      return response
    } catch {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Subdominio inscripcion.snrg.lat
  if (matchesHosts(request, INSCRIPCION_HOSTS)) {
    if (
      pathname.startsWith('/inscripcion') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next')
    ) {
      return NextResponse.next()
    }
    const newPath = pathname === '/' ? '/inscripcion' : `/inscripcion${pathname}`
    const url = request.nextUrl.clone()
    url.pathname = newPath
    return NextResponse.rewrite(url)
  }

  // Subdominio app.snrg.lat
  if (matchesHosts(request, APP_HOSTS)) {
    if (
      pathname.startsWith('/home') ||
      pathname.startsWith('/networking') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next')
    ) {
      return NextResponse.next()
    }
    if (pathname === '/') {
      const url = request.nextUrl.clone()
      url.pathname = '/home'
      return NextResponse.rewrite(url)
    }
    return NextResponse.next()
  }

  // Refrescar sesión Supabase Auth para el resto de rutas (importante para RLS)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const reqWithOrg = new NextRequest(request.url, { headers: requestHeaders })
      const { response } = await createMiddlewareClient(reqWithOrg)
      return response
    } catch {
      // Ignorar si falla (ej. sin Redis/cookies)
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|logo.png).*)',
  ],
}
