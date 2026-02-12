import { NextRequest } from 'next/server'

/**
 * Ruta de diagnóstico: visitar https://inscripcion.snrg.lat/api/inscripcion-check
 * para verificar que el subdominio y rewrites funcionan.
 */
export async function GET(request: NextRequest) {
  const host = request.headers.get('host') ?? ''
  const url = request.url
  const isInscripcion = host === 'inscripcion.snrg.lat'

  return Response.json({
    ok: true,
    host,
    url,
    isInscripcionSubdomain: isInscripcion,
    message: isInscripcion
      ? 'El subdominio inscripcion.snrg.lat funciona correctamente.'
      : `Estás en ${host}. Para formularios usa https://inscripcion.snrg.lat/[slug]`,
  })
}
