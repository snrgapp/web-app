'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { checkLoginRateLimit } from '@/lib/rate-limit'

const LOGIN_EMAIL = process.env.LOGIN_EMAIL
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD
const COHOST_DEMO_EMAIL = 'cohost.demo@snrg.lat'
const COHOST_DEMO_PASSWORD = 'CohostDemo26!'

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
      if (email.toLowerCase() === COHOST_DEMO_EMAIL && password === COHOST_DEMO_PASSWORD) {
        const listo = await asegurarCohostDemo()
        if (listo) {
          const { error: retry } = await supabase.auth.signInWithPassword({
            email: COHOST_DEMO_EMAIL,
            password: COHOST_DEMO_PASSWORD,
          })
          if (!retry) redirect('/stitch/checkin.html')
        }
      }
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

  const destino = await destinoTrasLogin(email, String(formData.get('from') || ''))
  redirect(destino)
}

async function asegurarCohostDemo(): Promise<boolean> {
  const admin = createAdminClient()
  if (!admin) return false
  const { data: ev } = await admin
    .from('eventos')
    .select('id, organizacion_id')
    .eq('id', '06b7cc52-703b-4b66-be64-9d7f2a4c801d')
    .maybeSingle()
  if (!ev) return false

  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 200 })
  let user = (listed.data?.users || []).find((u) => (u.email || '').toLowerCase() === COHOST_DEMO_EMAIL)
  if (!user) {
    const created = await admin.auth.admin.createUser({
      email: COHOST_DEMO_EMAIL,
      password: COHOST_DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { nombre: 'Carlos Demo', rol: 'cohost' },
    })
    if (created.error || !created.data.user) return false
    user = created.data.user
  } else {
    await admin.auth.admin.updateUserById(user.id, {
      password: COHOST_DEMO_PASSWORD,
      email_confirm: true,
    })
  }

  await admin
    .from('evento_staff')
    .update({ user_id: user.id, rol: 'cohost', nombre: 'Carlos Demo' })
    .eq('email', COHOST_DEMO_EMAIL)
  return true
}

async function destinoTrasLogin(email: string, from: string): Promise<string> {
  const admin = createAdminClient()
  if (admin) {
    const { data: staff } = await admin
      .from('evento_staff')
      .select('rol')
      .eq('email', email.toLowerCase())
      .in('rol', ['cohost', 'puerta'])
      .limit(1)
      .maybeSingle()
    if (staff) return '/stitch/checkin.html'
  }
  if (from.startsWith('/admin-miembros') || from.startsWith('/panel') || from.startsWith('/stitch/')) {
    return from
  }
  return '/panel'
}

async function bootstrapAdmin(userId: string, email?: string): Promise<void> {
  const admin = createAdminClient()
  if (!admin) return

  const correo = String(email || '').trim().toLowerCase()
  if (LOGIN_EMAIL && correo && correo !== LOGIN_EMAIL.toLowerCase()) return

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
