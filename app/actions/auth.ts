'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const LOGIN_EMAIL = process.env.LOGIN_EMAIL ?? 'jesusdavidprieto@gmail.com'
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD ?? 'J35u5.0703**'

export type LoginState = { error?: string } | null

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Correo y contraseña son requeridos' }
  }

  if (email !== LOGIN_EMAIL || password !== LOGIN_PASSWORD) {
    return { error: 'Correo o contraseña incorrectos' }
  }

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
