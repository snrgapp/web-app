'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Rocket, Zap, ArrowRight, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NetworkingLandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-8 font-sans relative overflow-hidden">
      
      {/* Flecha atrás al Home */}
      <div className="w-full flex items-center justify-start z-30 absolute top-0 left-0 p-4 sm:p-6">
        <button
          onClick={() => router.push('/')}
          className="text-black"
          aria-label="Volver al inicio"
        >
          <ArrowLeft size={24} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Contenedor de Tarjetas Apiladas */}
      <div className="relative w-full max-w-sm mt-8 sm:mt-12 h-[300px] flex justify-center z-10">
        
        {/* Tarjeta Superior (Amarilla) */}
        <motion.div 
          initial={{ y: 20, rotate: -5, opacity: 0 }}
          animate={{ y: 20, rotate: -5, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute w-[280px] h-[160px] bg-[#FFE100] rounded-[30px] p-6 shadow-lg border border-black/5"
          style={{ zIndex: 1 }}
        >
          <div className="flex flex-col gap-4">
            <Lightbulb className="w-6 h-6 text-black" />
            <div className="w-24 h-6 bg-black rounded-full" />
          </div>
        </motion.div>

        {/* Tarjeta Media (Negra) */}
        <motion.div 
          initial={{ y: 60, rotate: -2, opacity: 0 }}
          animate={{ y: 60, rotate: -2, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="absolute w-[300px] h-[170px] bg-black rounded-[30px] p-6 shadow-xl"
          style={{ zIndex: 2 }}
        >
          <div className="flex flex-col gap-4">
            <Rocket className="w-6 h-6 text-[#FFE100]" />
            <div className="w-32 h-6 bg-[#FFE100] rounded-full" />
          </div>
        </motion.div>

        {/* Tarjeta Frontal (Amarilla con Gradiente/Efecto) */}
        <motion.div 
          initial={{ y: 110, rotate: 0, opacity: 0 }}
          animate={{ y: 110, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute w-[320px] h-[180px] bg-gradient-to-b from-[#FFE100] to-[#FFD600] rounded-[35px] p-8 shadow-2xl border border-white/20"
          style={{ zIndex: 3 }}
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-5">
              <Zap className="w-7 h-7 text-black fill-black" />
              <div className="w-36 h-8 bg-black rounded-full" />
            </div>
            <div className="bg-black/10 p-2 rounded-full flex items-center justify-center">
              <Image src="/logo.png" alt="" width={24} height={24} className="object-contain" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sección de Texto */}
      <div className="flex flex-col items-start w-full max-w-sm -mt-6 sm:-mt-8 px-4 z-20">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black leading-none mb-0"
        >
          networking,
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-black leading-tight -mt-3"
        >
          pero fácil.
        </motion.p>
      </div>

      {/* Botón Ingresar */}
      <div className="w-full max-w-sm px-4 mb-12 z-30">
        <motion.button
          onClick={() => router.push('/networking/verify')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full bg-black text-white rounded-full py-3.5 sm:py-4 flex items-center justify-center gap-2 sm:gap-3 hover:opacity-90 transition-all active:scale-95 shadow-xl"
        >
          <span className="text-xl sm:text-2xl font-light">ingresar</span>
          <div className="bg-white/20 p-1 rounded-full">
            <ArrowRight className="w-5 h-5 sm:w-5 sm:h-5" />
          </div>
        </motion.button>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex items-center gap-2 mb-4 z-30"
      >
        <span className="text-gray-500 text-sm">Diseñado por</span>
        <div className="relative inline-block" style={{ width: 'auto', height: '1em', lineHeight: 1 }}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={16}
            height={16}
            className="object-contain h-full w-auto"
            style={{ 
              display: 'inline-block',
              verticalAlign: 'middle'
            }}
          />
        </div>
      </motion.div>

      {/* Degradado blanco inferior */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-white via-white/70 to-transparent z-20 pointer-events-none" />

    </div>
  )
}
