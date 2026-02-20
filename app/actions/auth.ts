'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { checkLoginRateLimit } from '@/lib/rate-limit'

const LOGIN_EMAIL = process.env.LOGIN_EMAIL
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD

async function getClientIp(): Promise<string> {
  const h = await headers()
  const forwarded = h.get('x-forwarded-for')
  const realIp = h.get('x-real-ip')
  return forwarded?.split(',')[0]?.trim() ?? realIp ?? 'unknown'
}

export type LoginState = { error?: string } | null

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Correo y contraseña son requeridos' }
  }

  const ip = await getClientIp()
  if (await checkLoginRateLimit(ip)) {
    return {
      error: 'Demasiados intentos fallidos. Espera 15 minutos e intenta de nuevo.',
    }
  }

  const supabase = await createServerClient()
  if (!supabase) {
    return { error: 'Error de conexión. Revisa la configuración.' }
  }

  // Intentar login con Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    if (authError.message === 'Invalid login credentials') {
      // Usuario no existe o contraseña incorrecta
      if (email === LOGIN_EMAIL && LOGIN_PASSWORD) {
        const admin = createAdminClient()
        if (admin) {
          const { data: existingUser } = await admin.auth.admin.listUsers()
          const userExists = existingUser?.users?.some((u) => u.email === email)
          if (!userExists) {
            const { data: newUser, error: createError } = await admin.auth.admin.createUser({
              email: LOGIN_EMAIL!,
              password: LOGIN_PASSWORD!,
              email_confirm: true,
            })
            if (!createError && newUser.user) {
              await bootstrapAdmin(newUser.user.id)
              const { error: signInError } = await supabase.auth.signInWithPassword({
                email: LOGIN_EMAIL!,
                password: LOGIN_PASSWORD!,
              })
              if (!signInError) {
                redirect('/panel')
              }
            }
          }
        }
      }
      return { error: 'Correo o contraseña incorrectos' }
    }
    return { error: authError.message }
  }

  if (authData?.user) {
    await bootstrapAdmin(authData.user.id, email)
  }

  redirect('/panel')
}

async function bootstrapAdmin(userId: string, email?: string): Promise<void> {
  const admin = createAdminClient()
  if (!admin) return

  const orgId = await getDefaultOrgId()
  if (!orgId) return

  const { data: existing } = await admin
    .from('organizacion_miembros')
    .select('id')
    .eq('organizacion_id', orgId)
    .eq('user_id', userId)
    .maybeSingle()

  if (!existing) {
    await admin.from('organizacion_miembros').insert({
      organizacion_id: orgId,
      user_id: userId,
      rol: 'admin',
    })
  }
}

export async function logout() {
  const supabase = await createServerClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  redirect('/login')
}

export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createServerClient()
  if (!supabase) return false
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}
