'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { getIeeeConexiones, type IeeeConexionUsuario } from '@/app/actions/ieee-networking'
import { IeeePersonCard } from '@/components/networking/ieee/IeeePersonCard'

const STORAGE_ID = 'ieee_submission_id'
const STORAGE_RONDA = 'ieee_ronda_actual'

const SLOTS: { value: 1 | 2; label: string }[] = [
  { value: 1, label: 'Ronda 1' },
  { value: 2, label: 'Ronda 2' },
]

function IeeeShellInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  const [ronda, setRonda] = useState<1 | 2>(1)
  const [conexiones, setConexiones] = useState<IeeeConexionUsuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sid =
      typeof window !== 'undefined'
        ? sessionStorage.getItem(STORAGE_ID) ?? localStorage.getItem(STORAGE_ID)
        : null
    if (!sid) {
      router.replace('/networking/ieee/verify')
      return
    }
    setSubmissionId(sid)
  }, [router])

  useEffect(() => {
    const momento = searchParams.get('momento')
    if (momento === 'tarde') {
      setRonda(2)
      sessionStorage.setItem(STORAGE_RONDA, '2')
      localStorage.setItem(STORAGE_RONDA, '2')
      router.replace('/networking/ieee', { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    if (!submissionId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const list = await getIeeeConexiones(submissionId, ronda)
      if (!cancelled) {
        setConexiones(list)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [submissionId, ronda])

  function handleComenzarPreguntas() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_RONDA, String(ronda))
      localStorage.setItem(STORAGE_RONDA, String(ronda))
    }
    router.push(`/networking/ieee/questions?ronda=${ronda}`)
  }

  if (!submissionId) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#161616]">
        <Loader2 className="h-8 w-8 animate-spin text-white/65" />
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col pb-8">
      <header className="relative z-10 flex items-center px-4 pt-4 pb-3 sm:gap-3 sm:px-5">
        <button
          type="button"
          className="flex h-10 w-10 shrink-0 items-center justify-start rounded-lg text-white/65 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Volver"
          onClick={() => router.push('/home')}
        >
          <ArrowLeft size={22} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1 sm:flex-row sm:items-center sm:justify-start sm:gap-3">
          <img
            src="/images/ieee.png"
            alt="IEEE"
            width={800}
            height={800}
            decoding="async"
            className="h-14 w-auto shrink-0 bg-transparent object-contain sm:h-[4.5rem]"
          />
          <span
            className="text-center text-[0.68rem] font-medium uppercase tracking-[0.15em] text-white/55 sm:text-left"
            style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
          >
            Conexiones
          </span>
        </div>
        <div className="h-10 w-10 shrink-0 sm:hidden" aria-hidden />
      </header>

      <div className="relative z-10 mx-auto w-full max-w-md flex-1 px-4 text-center sm:max-w-lg sm:text-left">
        <h1
          className="text-2xl font-black leading-tight text-white"
          style={{ fontFamily: 'var(--font-fraunces-ieee), serif' }}
        >
          Tu radar IEEE
        </h1>
        <p className="mt-2 text-sm font-light leading-relaxed text-white/65 sm:max-w-md">
          Personas sugeridas según tu perfil. Elige la ronda y escríbeles por WhatsApp.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          {SLOTS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setRonda(value)}
              className={`rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition ${
                ronda === value
                  ? 'border border-white/25 bg-[#252525] text-white shadow-[4px_4px_0_#00629B]'
                  : 'border border-white/12 bg-[#1a1a1a] text-white/45 hover:border-white/22 hover:text-white/75'
              }`}
              style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="mx-auto mt-5 max-w-sm text-center text-xs font-light leading-relaxed text-white/55 sm:mx-0 sm:max-w-md sm:text-left">
          Toca el número en cada tarjeta para abrir WhatsApp. Las conexiones mostradas corresponden solo a esta ronda.
        </p>

        <div className="mt-8 w-full space-y-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-white/65" />
            </div>
          ) : conexiones.length === 0 ? (
            <div className="rounded-[22px] border border-white/10 bg-[#252525] px-5 py-10 text-center shadow-[6px_6px_0_#00629B]">
              <p className="text-sm font-light text-white/65">
                Aún no hay sugerencias para esta ronda. Vuelve más tarde
              </p>
            </div>
          ) : (
            conexiones.map((c, i) => <IeeePersonCard key={c.id} person={c} index={i} />)
          )}
        </div>

        <div className="mt-10 pb-8">
          <button
            type="button"
            onClick={handleComenzarPreguntas}
            className="w-full rounded-full border border-white/12 bg-white py-3.5 text-center text-sm font-medium uppercase tracking-wide text-[#161616] shadow-[6px_6px_0_#00629B] transition hover:bg-white/95 active:scale-[0.99]"
            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
          >
            Comenzar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function IeeeShell() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#161616]">
          <Loader2 className="h-8 w-8 animate-spin text-white/65" />
        </div>
      }
    >
      <IeeeShellInner />
    </Suspense>
  )
}
