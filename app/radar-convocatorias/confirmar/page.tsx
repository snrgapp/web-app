import Link from 'next/link'
import { confirmRadarAlerta } from '@/lib/radar-confirm'

export const dynamic = 'force-dynamic'

export default async function RadarConfirmarPage({
  searchParams,
}: {
  searchParams: { token?: string }
}) {
  const token = searchParams.token?.trim()
  const status = token ? await confirmRadarAlerta(token) : 'missing'
  const confirmed = status === 'ok' || status === 'already'

  const title = confirmed
    ? 'Tu correo ha quedado confirmado'
    : 'Este enlace no es válido'
  const body = status === 'ok'
    ? 'Desde el próximo lunes te enviaremos tres convocatorias de financiación y aceleración en Colombia, con enlace a las bases oficiales.'
    : status === 'already'
      ? 'Esta suscripción ya estaba activa. Seguirás recibiendo el resumen semanal del Radar.'
      : 'El enlace puede haber caducado o estar incompleto. Vuelve al Radar e inscríbete de nuevo si lo necesitas.'

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] px-8 py-10 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFD60A]">
          Radar de convocatorias
        </p>
        <p
          className={`mx-auto mt-6 flex h-12 w-12 items-center justify-center rounded-full text-lg ${
            confirmed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-white/50'
          }`}
          aria-hidden
        >
          {confirmed ? '✓' : '!'}
        </p>
        <h1 className="mt-5 text-2xl font-bold leading-snug">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-white/55">{body}</p>
        <Link
          href="/radar-convocatorias"
          className="mt-8 inline-flex rounded-xl bg-[#FFD60A] px-5 py-2.5 text-sm font-bold text-[#111]"
        >
          Ir al Radar
        </Link>
      </div>
    </main>
  )
}
