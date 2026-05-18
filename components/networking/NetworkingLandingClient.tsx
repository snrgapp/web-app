'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Rocket, Zap, ArrowRight, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export type NetworkingLandingClientProps = {
  logoUrl: string | null
  /** Ruta interna de verificación (ej. /networking/verify o /exp/slug/verify) */
  verifyHref?: string
  /** Destino del botón atrás (por defecto /) */
  backHref?: string
}

export function NetworkingLandingClient({
  logoUrl,
  verifyHref = '/networking/verify',
  backHref = '/',
}: NetworkingLandingClientProps) {
  const router = useRouter()
  const mark = logoUrl?.trim() || '/logo.png'
  const useUnoptimized = mark.startsWith('http')

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 relative overflow-hidden">
      <div className="w-full flex items-center justify-start z-30 absolute top-0 left-0 p-4 sm:p-6">
        <button
          onClick={() => router.push(backHref)}
          className="text-[var(--net-fg)]"
          aria-label="Volver al inicio"
        >
          <ArrowLeft size={24} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="relative w-full max-w-sm mt-8 sm:mt-12 h-[300px] flex justify-center z-10">
        <motion.div
          initial={{ y: 20, rotate: -5, opacity: 0 }}
          animate={{ y: 20, rotate: -5, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute w-[280px] h-[160px] p-6 shadow-lg border border-black/5"
          style={{
            zIndex: 1,
            backgroundColor: 'var(--net-primary)',
            color: 'var(--net-primary-fg)',
            borderRadius: 'var(--net-radius)',
          }}
        >
          <div className="flex flex-col gap-4">
            <Lightbulb className="w-6 h-6" style={{ color: 'var(--net-primary-fg)' }} />
            <div
              className="w-24 h-6 rounded-full"
              style={{ backgroundColor: 'var(--net-accent)' }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 60, rotate: -2, opacity: 0 }}
          animate={{ y: 60, rotate: -2, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute w-[300px] h-[170px] p-6 shadow-xl"
          style={{
            zIndex: 2,
            backgroundColor: 'var(--net-accent)',
            color: 'var(--net-accent-fg)',
            borderRadius: 'var(--net-radius)',
          }}
        >
          <div className="flex flex-col gap-4">
            <Rocket className="w-6 h-6" style={{ color: 'var(--net-accent-fg)' }} />
            <div
              className="w-32 h-6 rounded-full"
              style={{ backgroundColor: 'var(--net-primary)' }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 110, rotate: 0, opacity: 0 }}
          animate={{ y: 110, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute w-[320px] h-[180px] p-8 shadow-2xl border border-white/20"
          style={{
            zIndex: 3,
            background: `linear-gradient(180deg, var(--net-primary), color-mix(in srgb, var(--net-primary) 82%, var(--net-accent)))`,
            color: 'var(--net-primary-fg)',
            borderRadius: 'var(--net-radius)',
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-5">
              <Zap className="w-7 h-7 fill-current" style={{ color: 'var(--net-primary-fg)' }} />
              <div
                className="w-36 h-8 rounded-full"
                style={{ backgroundColor: 'var(--net-accent)' }}
              />
            </div>
            <div className="bg-black/10 p-2 rounded-full flex items-center justify-center">
              <Image src={mark} alt="" width={24} height={24} className="object-contain" unoptimized={useUnoptimized} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col items-start w-full max-w-sm -mt-6 sm:-mt-8 px-4 z-20">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none mb-0 text-[var(--net-fg)]"
        >
          networking,
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight leading-tight -mt-3 text-[var(--net-fg)]"
        >
          pero fácil.
        </motion.p>
      </div>

      <div className="w-full max-w-sm px-4 mb-12 z-30">
        <motion.button
          onClick={() => router.push(verifyHref)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full rounded-full py-3.5 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 hover:opacity-90 transition-all active:scale-95 shadow-xl"
          style={{
            backgroundColor: 'var(--net-accent)',
            color: 'var(--net-accent-fg)',
          }}
        >
          <span className="text-xl sm:text-2xl font-light">ingresar</span>
          <div className="bg-white/20 p-1 rounded-full">
            <ArrowRight className="w-5 h-5 sm:w-5 sm:h-5" />
          </div>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center gap-2 mb-4 z-30"
      >
        <span className="text-sm" style={{ color: 'var(--net-muted)' }}>
          Diseñado por
        </span>
        <div className="relative inline-block" style={{ width: 'auto', height: '1em', lineHeight: 1 }}>
          <Image
            src={mark}
            alt="Logo"
            width={16}
            height={16}
            className="object-contain h-full w-auto inline-block align-middle"
            unoptimized={useUnoptimized}
          />
        </div>
      </motion.div>

      <div
        className="absolute bottom-0 left-0 w-full h-64 z-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, var(--net-bg) 0%, color-mix(in srgb, var(--net-bg) 65%, transparent) 55%, transparent 100%)',
        }}
      />
    </div>
  )
}
