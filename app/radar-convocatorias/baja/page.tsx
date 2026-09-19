import { createAdminClient } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function RadarBajaPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token?.trim()
  let ok = false
  if (token) {
    const admin = createAdminClient()
    if (admin) {
      const { error } = await admin
        .from('radar_alertas')
        .update({ active: false })
        .eq('unsubscribe_token', token)
      ok = !error
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <div className="max-w-md text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#FFD60A]">
          Radar de convocatorias
        </p>
        <h1 className="text-2xl font-bold">
          {ok ? 'Ya no te enviaremos este correo' : 'No encontramos esa suscripción'}
        </h1>
        <p className="mt-3 text-sm text-white/55">
          {ok
            ? 'Quedaste fuera de las alertas semanales. Puedes volver a activarlas cuando quieras en el Radar.'
            : 'Revisa el enlace de baja o escribe a hola@snrg.lat.'}
        </p>
      </div>
    </main>
  )
}
