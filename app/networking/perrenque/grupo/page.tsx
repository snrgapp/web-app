'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { getPerrenqueGrupoScreenData } from '@/app/actions/perrenque-networking'
import { PerrenquePersonCard } from '@/components/networking/PerrenquePersonCard'
import type { PerrenqueConectaSubmission } from '@/types/database.types'

function GrupoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ronda = (searchParams.get('ronda') === '2' ? 2 : 1) as 1 | 2
  const [grupoNumero, setGrupoNumero] = useState<number | null>(null)
  const [companeros, setCompaneros] = useState<PerrenqueConectaSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const submissionId =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('perrenque_submission_id') ??
          localStorage.getItem('perrenque_submission_id')
        : null
    if (!submissionId) {
      router.replace('/networking/perrenque/verify')
      return
    }

    const id = submissionId

    async function load() {
      const data = await getPerrenqueGrupoScreenData(id, ronda)
      setGrupoNumero(data.grupoNumero)
      setCompaneros(data.companeros)
      setLoading(false)
    }

    void load()
  }, [router, ronda])

  function handleComenzar() {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('perrenque_ronda_actual', String(ronda))
      localStorage.setItem('perrenque_ronda_actual', String(ronda))
    }
    router.push(`/networking/perrenque/questions?ronda=${ronda}`)
  }

  async function handleRefresh() {
    const submissionId =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('perrenque_submission_id') ??
          localStorage.getItem('perrenque_submission_id')
        : null
    if (!submissionId) return
    setLoading(true)
    const data = await getPerrenqueGrupoScreenData(submissionId, ronda)
    setGrupoNumero(data.grupoNumero)
    setCompaneros(data.companeros)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a9fd4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  const labelGrupo = grupoNumero != null ? String(grupoNumero) : '?'

  return (
    <div className="min-h-screen bg-[#1a9fd4] flex flex-col">
      <div className="w-full p-4 sm:p-6 flex items-center justify-between border-b-2 border-[#1a1a1a] bg-[#FFD600]">
        <button
          onClick={() =>
            router.push(ronda === 1 ? '/networking/perrenque/verify' : '/networking/perrenque/grupo?ronda=1')
          }
          className="text-[#1a1a1a]"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
        {grupoNumero == null && (
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-1 text-xs font-black text-[#1a1a1a] uppercase"
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} className="rounded-full border border-[#1a1a1a]" />
            <span className="text-white text-sm font-extrabold drop-shadow">
              {ronda === 1 ? 'Primera ronda' : 'Segunda ronda'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight text-center drop-shadow-md">
            Grupo {labelGrupo}
          </h1>
          {grupoNumero == null && (
            <p className="text-center text-sm font-bold text-white/95 max-w-md leading-snug">
              Estamos preparando tus conexiones. Si ya completaste el formulario hace unos minutos,
              pulsa «Actualizar». Si sigue igual, avísanos al equipo del evento.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {companeros.length === 0 ? (
            <p className="col-span-2 md:col-span-3 text-center text-white font-bold py-8">
              {grupoNumero != null
                ? 'Todavía no hay más personas asignadas a tu grupo en la app.'
                : ''}
            </p>
          ) : (
            companeros.map((s, i) => <PerrenquePersonCard key={s.id} submission={s} index={i} />)
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <button
            type="button"
            onClick={handleComenzar}
            className="bg-[#FFD600] text-[#1a1a1a] rounded-full py-3.5 px-10 font-black text-lg border-[2.5px] border-[#1a1a1a] shadow-[4px_4px_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all active:scale-[0.98] [font-family:var(--font-perrenque-bangers),cursive] tracking-wide"
          >
            Comenzar
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default function PerrenqueGrupoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a9fd4] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      }
    >
      <GrupoContent />
    </Suspense>
  )
}
