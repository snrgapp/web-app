import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { EVENTO_DIRECTORIO } from '@/lib/directorio/config'
import { normalizarCelularColombia } from '@/lib/directorio/telefono'

const COOKIE = 'directorio_sesion'

type CargaSesion = {
  v: 1
  phone: string
  event: string
  exp: number
}

function secreto(): string | null {
  const candidatos = [
    process.env.DIRECTORY_SESSION_SECRET,
    process.env.MEMBER_SESSION_SECRET,
    process.env.SUPABASE_SECRET_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  ]
  for (const candidato of candidatos) {
    const valor = candidato?.trim()
    if (valor && valor.length >= 32) return valor
  }
  return null
}

function firmar(contenido: string): string {
  const clave = secreto()
  if (!clave) return ''
  return createHmac('sha256', clave).update(contenido).digest('hex')
}

function firmaValida(contenido: string, firma: string): boolean {
  try {
    if (!/^[0-9a-f]{64}$/i.test(firma)) return false
    const esperada = firmar(contenido)
    if (!esperada || esperada.length !== firma.length) return false
    return timingSafeEqual(Buffer.from(firma, 'hex'), Buffer.from(esperada, 'hex'))
  } catch {
    return false
  }
}

function opciones(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/directorio',
    maxAge,
  }
}

export async function establecerSesionDirectorio(phone: string, expiraEn: Date): Promise<boolean> {
  const clave = secreto()
  const celular = normalizarCelularColombia(phone)
  if (!clave || !celular) return false
  const exp = Math.floor(expiraEn.getTime() / 1000)
  const maxAge = exp - Math.floor(Date.now() / 1000)
  if (maxAge < 1) return false

  const carga: CargaSesion = { v: 1, phone: celular, event: EVENTO_DIRECTORIO, exp }
  const encoded = Buffer.from(JSON.stringify(carga)).toString('base64url')
  const token = `${encoded}.${firmar(encoded)}`
  const jar = await cookies()
  jar.set(COOKIE, token, opciones(maxAge))
  return true
}

export async function cerrarSesionDirectorio(): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE, '', opciones(0))
}

export async function leerSesionDirectorio(): Promise<{ phone: string } | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE)?.value
  if (!token) return null
  const carga = leerToken(token)
  if (!carga) return null
  return { phone: carga.phone }
}

function leerToken(token: string): CargaSesion | null {
  try {
    const [encoded, firma] = token.split('.')
    if (!encoded || !firma || token.split('.').length !== 2) return null
    if (!firmaValida(encoded, firma)) return null
    const carga = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as CargaSesion
    if (carga.v !== 1) return null
    if (carga.event !== EVENTO_DIRECTORIO) return null
    if (!normalizarCelularColombia(carga.phone) || normalizarCelularColombia(carga.phone) !== carga.phone) {
      return null
    }
    if (typeof carga.exp !== 'number' || carga.exp < Math.floor(Date.now() / 1000)) return null
    return carga
  } catch {
    return null
  }
}
