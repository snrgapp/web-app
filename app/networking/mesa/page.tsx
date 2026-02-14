'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { getAsistenteById, getAsistentesPorMesa } from '@/app/actions/networking'
import { MesaCard } from '@/components/networking/MesaCard'
import type { Asistente } from '@/types/database.types'

function MesaContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ronda = (searchParams.get('ronda') === '2' ? 2 : 1) as 1 | 2
  const [asistente, setAsistente] = useState<Asistente | null>(null)
  const [compañeros, setCompañeros] = useState<Asistente[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const asistenteId = typeof window !== 'undefined' ? localStorage.getItem('asistente_id') : null
    if (!asistenteId) {
      router.replace('/networking/verify')
      return
    }

    async function load() {
      const a = await getAsistenteById(asistenteId as string)
      if (!a) {
        router.replace('/networking/verify')
        return
      }
      setAsistente(a)
      const mesa = ronda === 1 ? a.mesa : a.mesa_ronda2
      if (!mesa) {
        setCompañeros([])
        setLoading(false)
        return
      }
      const list = await getAsistentesPorMesa(mesa, ronda)
      setCompañeros(list)
      setLoading(false)
    }

    load()
  }, [router, ronda])

  function handleComenzar() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('networking_ronda_actual', String(ronda))
    }
    router.push('/networking/categories')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    )
  }

  const mesa = asistente
    ? ronda === 1
      ? asistente.mesa
      : asistente.mesa_ronda2
    : null

  const mesaLabel = mesa ?? '?'

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <div className="w-full p-4 sm:p-6 flex items-center justify-between border-b border-zinc-100">
        <button
          onClick={() => router.push(ronda === 1 ? '/networking' : '/networking/mesa?ronda=1')}
          className="text-black"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center bg-[#f2f2f2] px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={24} height={24} />
            <span className="text-zinc-500 text-sm">
              {ronda === 1 ? 'Primera Ronda' : 'Segunda Ronda'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-light text-black tracking-tight">
            La mesa {mesaLabel}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md space-y-5"
        >
          {compañeros.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">
              No hay asistentes asignados a esta mesa aún.
            </p>
          ) : (
            compañeros.map((a, i) => (
              <MesaCard key={a.id} asistente={a} index={i} />
            ))
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10"
        >
          <button
            onClick={handleComenzar}
            className="bg-black text-white rounded-full py-3.5 px-10 font-medium text-lg hover:bg-zinc-800 transition-colors active:scale-[0.98]"
          >
            Comenzar
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default function NetworkingMesaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    }>
      <MesaContent />
    </Suspense>
  )
}
