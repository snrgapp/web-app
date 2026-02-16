'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'

const LOGIN_EMAIL = process.env.LOGIN_EMAIL
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD

/** Rate limit: intentos fallidos por IP (en memoria por instancia; Vercel mitiga DDoS a nivel infra) */
const failedAttempts = new Map<string, { count: number; firstAt: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutos

async function getClientIp(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  const realIp = h.get('x-real-ip')
  return forwarded?.split(',')[0]?.trim() ?? realIp ?? 'unknown'
}

async function isRateLimited(): Promise<boolean> {
  const id = await getClientIp()
  const entry = failedAttempts.get(id)
  if (!entry) return false
  if (Date.now() - entry.firstAt > LOCKOUT_MS) {
    failedAttempts.delete(id)
    return false
  }
  return entry.count >= MAX_ATTEMPTS
}

async function recordFailedAttempt(): Promise<void> {
  const id = await getClientIp()
  const now = Date.now()
  const entry = failedAttempts.get(id)
  if (!entry) {
    failedAttempts.set(id, { count: 1, firstAt: now })
    return
  }
  if (now - entry.firstAt > LOCKOUT_MS) {
    failedAttempts.set(id, { count: 1, firstAt: now })
    return
  }
  entry.count += 1
}

async function clearFailedAttempts(): Promise<void> {
  const id = await getClientIp()
  failedAttempts.delete(id)
}

export type LoginState = { error?: string } | null

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  if (!LOGIN_EMAIL || !LOGIN_PASSWORD) {
    return {
      error:
        'Credenciales del panel no configuradas. Define LOGIN_EMAIL y LOGIN_PASSWORD en las variables de entorno.',
    }
  }

  if (await isRateLimited()) {
    return {
      error:
        'Demasiados intentos fallidos. Espera 15 minutos e intenta de nuevo.',
    }
  }

  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Correo y contraseña son requeridos' }
  }

  if (email !== LOGIN_EMAIL || password !== LOGIN_PASSWORD) {
    await recordFailedAttempt()
    return { error: 'Correo o contraseña incorrectos' }
  }

  await clearFailedAttempts()

  const cookieStore = await cookies()
  cookieStore.set('panel-auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 horas
    path: '/',
  })

  redirect('/panel')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('panel-auth')
  redirect('/login')
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const auth = cookieStore.get('panel-auth')
  return auth?.value === 'authenticated'
}
