'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import {
  getGeniusConexiones,
  type GeniusConexionUsuario,
} from '@/app/actions/genius-networking'
import { GeniusPersonCard } from '@/components/networking/genius/GeniusPersonCard'

const STORAGE_ID = 'genius_submission_id'

export default function GeniusShell() {
  const router = useRouter()
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [ronda, setRonda] = useState<1 | 2>(1)
  const [conexiones, setConexiones] = useState<GeniusConexionUsuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sid =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(STORAGE_ID) ?? localStorage.getItem(STORAGE_ID)
        : null
    if (!sid) {
      router.replace('/networking/genius/verify')
      return
    }
    setSubmissionId(sid)
  }, [router])

  useEffect(() => {
    if (!submissionId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const list = await getGeniusConexiones(submissionId, ronda)
      if (!cancelled) {
        setConexiones(list)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [submissionId, ronda])

  if (!submissionId) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#161616]">
        <Loader2 className="h-8 w-8 animate-spin text-[#694aff]" />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col pb-10">
      <header className="relative z-10 flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          type="button"
          className="-ml-2 rounded-lg p-2 text-white/65 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Volver"
          onClick={() => router.push('/home')}
        >
          <ArrowLeft size={22} />
        </button>
        <div className="relative h-10 w-28 shrink-0 overflow-hidden rounded-lg shadow-[4px_4px_0_#daff00]">
          <Image
            src="/images/genius-fest-logo.png"
            alt="Genius FEST"
            fill
            className="object-cover object-center"
            sizes="112px"
            priority
          />
        </div>
        <span
          className="text-[0.68rem] font-medium uppercase tracking-[0.15em] text-[#694aff]"
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          Conexiones
        </span>
      </header>

      <div className="relative z-10 px-4">
        <h1
          className="text-2xl font-black leading-tight text-[#694aff]"
          style={{ fontFamily: 'var(--font-fraunces-genius), serif' }}
        >
          Tu radar Genius
        </h1>
        <p className="mt-2 max-w-md text-sm font-light leading-relaxed text-white/65">
          Personas sugeridas para esta ronda según tu perfil del formulario.
        </p>

        <div className="mt-6 flex gap-2">
          {([1, 2] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRonda(r)}
              className={`rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition ${
                ronda === r
                  ? 'bg-[#694aff] text-white shadow-[4px_4px_0_#daff00]'
                  : 'border border-white/15 bg-black/30 text-white/55 hover:border-[#694aff]/40 hover:text-white/85'
              }`}
              style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
            >
              Ronda {r}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#694aff]" />
            </div>
          ) : conexiones.length === 0 ? (
            <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-5 py-10 text-center shadow-[6px_6px_0_#daff00]/40">
              <p className="text-sm font-light text-white/65">
                Aún no hay sugerencias para esta ronda. Vuelve más tarde o confirma que ya enviaste el
                formulario en genius.snrg.lat.
              </p>
            </div>
          ) : (
            conexiones.map((c, i) => <GeniusPersonCard key={c.id} person={c} index={i} />)
          )}
        </div>
      </div>
    </div>
  )
}
