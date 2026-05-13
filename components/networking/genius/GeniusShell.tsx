'use client'

import { useEffect, useState } from 'react'
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
        <Loader2 className="h-8 w-8 animate-spin text-white/65" />
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
        <img
          src="/images/genius-fest-logo.png"
          alt="Genius FEST"
          width={1080}
          height={1080}
          decoding="async"
          className="h-16 w-auto shrink-0 bg-transparent object-contain object-left sm:h-14"
        />
        <span
          className="text-[0.68rem] font-medium uppercase tracking-[0.15em] text-white/55"
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          Conexiones
        </span>
      </header>

      <div className="relative z-10 px-4">
        <h1
          className="text-2xl font-black leading-tight text-white"
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
                  ? 'border border-white/25 bg-[#1c1c1c] text-white shadow-[4px_4px_0_#694aff]'
                  : 'border border-white/12 bg-[#141414] text-white/45 hover:border-white/22 hover:text-white/75'
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
              <Loader2 className="h-8 w-8 animate-spin text-white/65" />
            </div>
          ) : conexiones.length === 0 ? (
            <div className="rounded-[22px] border border-white/10 bg-[#1c1c1c] px-5 py-10 text-center shadow-[6px_6px_0_#694aff]">
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
