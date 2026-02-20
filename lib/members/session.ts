import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const COOKIE_NAME = 'member_session'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 días

export interface MemberSessionPayload {
  memberId: string
  phone: string
  exp: number
}

function getSecret(): string | null {
  const secret = process.env.MEMBER_SESSION_SECRET
  if (!secret || secret.length < 32) return null
  return secret
}

function sign(payload: string): string {
  const secret = getSecret()
  if (!secret) return ''
  return createHmac('sha256', secret).update(payload).digest('hex')
}

function verify(payload: string, signature: string): boolean {
  const expected = sign(payload)
  if (!expected || expected.length !== signature.length) return false
  return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))
}

export function createSessionToken(payload: Omit<MemberSessionPayload, 'exp'>): string | null {
  const secret = getSecret()
  if (!secret) return null
  const data: MemberSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE,
  }
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64url')
  const signature = sign(encoded)
  return `${encoded}.${signature}`
}

export function parseSessionToken(token: string): MemberSessionPayload | null {
  try {
    const [encoded, signature] = token.split('.')
    if (!encoded || !signature) return null
    if (!verify(encoded, signature)) return null
    const decoded = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as MemberSessionPayload
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null
    return decoded
  } catch {
    return null
  }
}

export async function setMemberSession(memberId: string, phone: string): Promise<string | null> {
  const token = createSessionToken({ memberId, phone })
  if (!token) return null
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
  return token
}

export function getCookieName(): string {
  return COOKIE_NAME
}

export async function destroyMemberSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getMemberSession(): Promise<MemberSessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return parseSessionToken(token)
}

/** Verifica si hay sesión válida desde token (para middleware, sin DB) */
export function isValidSessionToken(token: string): boolean {
  return parseSessionToken(token) !== null
}
