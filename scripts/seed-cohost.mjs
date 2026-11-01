import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !key) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const EMAIL = 'cohost.demo@snrg.lat'
const PASSWORD = 'CohostDemo26!'
const NOMBRE = 'Carlos Demo'

const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

const { data: ev, error: evErr } = await admin
  .from('eventos')
  .select('id, organizacion_id, titulo')
  .order('created_at', { ascending: false })
  .limit(1)
  .maybeSingle()

if (evErr || !ev) {
  console.error('No hay evento para asignar el co-host', evErr)
  process.exit(1)
}

const { data: users } = await admin.auth.admin.listUsers()
let user = (users?.users || []).find((u) => (u.email || '').toLowerCase() === EMAIL)
if (!user) {
  const created = await admin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { nombre: NOMBRE, rol: 'cohost' },
  })
  if (created.error) {
    console.error(created.error)
    process.exit(1)
  }
  user = created.data.user
} else {
  await admin.auth.admin.updateUserById(user.id, { password: PASSWORD, email_confirm: true })
}

const { data: staff, error } = await admin
  .from('evento_staff')
  .upsert(
    {
      evento_id: ev.id,
      organizacion_id: ev.organizacion_id,
      email: EMAIL,
      nombre: NOMBRE,
      rol: 'cohost',
      user_id: user.id,
    },
    { onConflict: 'evento_id,email' }
  )
  .select()
  .single()

if (error) {
  const { data: previo } = await admin
    .from('evento_staff')
    .select('id')
    .eq('evento_id', ev.id)
    .eq('email', EMAIL)
    .maybeSingle()
  if (previo) {
    const { error: updErr } = await admin
      .from('evento_staff')
      .update({ nombre: NOMBRE, rol: 'cohost', user_id: user.id })
      .eq('id', previo.id)
    if (updErr) {
      console.error(updErr)
      process.exit(1)
    }
  } else {
    console.error(error)
    process.exit(1)
  }
}

console.log(JSON.stringify({ ok: true, email: EMAIL, evento: ev.titulo, evento_id: ev.id, staff_id: staff?.id || true }, null, 2))
