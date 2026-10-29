import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/utils/supabase/admin'
import { paseQrImgUrl } from '@/lib/pase'

export const dynamic = 'force-dynamic'

function fechaLarga(fecha?: string | null, hora?: string | null) {
  if (!fecha) return 'Fecha por confirmar'
  const d = new Date(`${fecha}T12:00:00-05:00`)
  const dia = d.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota',
  })
  const cap = dia.charAt(0).toUpperCase() + dia.slice(1)
  return hora ? `${cap} · ${hora} COT` : cap
}

export default async function PasePage({ params }: { params: { token: string } }) {
  const db = createAdminClient()
  if (!db) notFound()
  const token = String(params.token || '').replace(/[^a-zA-Z0-9]/g, '')
  const { data: a } = await db
    .from('asistentes')
    .select('nombre, apellido, tipo_ticket, evento_id, ticket_token')
    .eq('ticket_token', token)
    .maybeSingle()
  if (!a) notFound()
  const { data: e } = await db
    .from('eventos')
    .select('titulo, fecha, hora_inicio, lugar, ciudad, incluye')
    .eq('id', a.evento_id)
    .maybeSingle()
  const nombre = [a.nombre, a.apellido].filter(Boolean).join(' ') || 'Asistente'
  const lugar = [e?.lugar, e?.ciudad].filter(Boolean).join(', ') || 'Lugar por confirmar'

  return (
    <main className="min-h-screen bg-[#f4f2fd] flex items-center justify-center p-6">
      <article className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center gap-4 text-center">
        <Image src="/logo.png" alt="Synergy" width={120} height={28} className="h-7 w-auto" />
        <p className="text-[11px] uppercase tracking-widest text-[#4648d4] font-semibold">Pase de ingreso</p>
        <h1 className="text-xl font-semibold text-[#1a1b22]">{e?.titulo || 'Evento'}</h1>
        <p className="text-sm text-[#46464b]">{nombre}</p>
        <p className="text-sm text-[#46464b]">{fechaLarga(e?.fecha, e?.hora_inicio)}</p>
        <p className="text-sm text-[#46464b]">{lugar}</p>
        {a.tipo_ticket ? (
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#eeedf7] text-[#1a1b22]">{a.tipo_ticket}</span>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={paseQrImgUrl(token)} alt="QR de ingreso" width={220} height={220} className="rounded-xl border border-[#eeedf7]" />
        {e?.incluye ? <p className="text-xs text-[#77767b]">{e.incluye}</p> : null}
        <p className="text-xs text-[#77767b]">Muéstralo en la puerta para confirmar tu ingreso.</p>
      </article>
    </main>
  )
}
