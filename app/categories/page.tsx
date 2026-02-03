'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Coffee, Rocket, ChevronRight, CircleDot, Zap, Lightbulb, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CategorySelection() {
  const router = useRouter()
  const [isShuffling, setIsShuffling] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'company' | 'founder' | null>(null)

  const handleCardClick = (category: 'company' | 'founder') => {
    setSelectedCategory(category)
  }

  const handleStart = () => {
    if (!selectedCategory) return
    
    setIsShuffling(true)
    // Lógica para el barajado de 3 segundos
    setTimeout(() => {
      setIsShuffling(false)
      // Después del barajado, navegar a preguntas con la categoría seleccionada
      setTimeout(() => {
        router.push(`/questions?category=${selectedCategory}`)
      }, 500)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between py-6 sm:py-10 px-4 sm:px-6 font-sans relative overflow-hidden">
      
      {/* Flecha atrás - mismo estilo que en preguntas */}
      <div className="w-full p-4 sm:p-6 flex items-center justify-start z-30 absolute top-0 left-0">
        <button
          onClick={() => router.push('/')}
          className="text-black"
          aria-label="Ir atrás"
        >
          <ArrowLeft size={24} className="sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Header: Iconos superiores y título */}
      <div className="w-full flex flex-col items-center gap-2 sm:gap-3 z-30 mb-2 sm:mb-3">
        <div className="flex justify-center gap-6 sm:gap-10 opacity-10">
          <Coffee size={28} className="sm:w-[42px] sm:h-[42px] text-black" />
          <Rocket size={28} className="sm:w-[42px] sm:h-[42px] text-black" />
          <Zap size={28} className="sm:w-[42px] sm:h-[42px] text-black" />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Lightbulb size={20} className="sm:w-6 sm:h-6 text-black" />
          <span className="text-lg sm:text-2xl font-normal tracking-tight text-gray-900">
            escoge una categoría
          </span>
        </div>
      </div>

      {/* Contenedor de Tarjetas: Mobile first responsive */}
      <div className="relative w-full max-w-3xl mx-auto flex justify-center items-center h-[280px] sm:h-[320px] md:h-[400px] z-10 px-2 sm:px-6">
        
        {/* Tarjeta Amarilla (Izquierda) */}
        <motion.div
          onClick={() => handleCardClick('company')}
          animate={isShuffling ? { 
            rotate: [ -5, 5, -5], 
            x: ['calc(-50% - 100px)', 'calc(-50% - 95px)', 'calc(-50% - 100px)'] 
          } : { 
            rotate: selectedCategory === 'company' ? 0 : -5, 
            x: 'calc(-50% - 100px)',
            scale: selectedCategory === 'company' ? 1.1 : 1,
            y: selectedCategory === 'company' ? -10 : 0
          }}
          transition={{ duration: 0.5, repeat: isShuffling ? Infinity : 0 }}
          className={`absolute w-[160px] h-[240px] sm:w-[190px] sm:h-[280px] md:w-[230px] md:h-[340px] bg-[#FFE100] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] p-4 sm:p-5 md:p-7 shadow-2xl flex flex-col justify-between border border-black/5 overflow-visible cursor-pointer transition-all ${
            selectedCategory === 'company' ? 'z-30' : 'z-20'
          }`}
          style={{ left: '50%' }}
        >
          <div className="text-black">
            <Coffee size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8 mb-4 sm:mb-6 md:mb-8" strokeWidth={2.5} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-none tracking-tighter mb-2 sm:mb-3 md:mb-4">
              {`LET'S`} <br /> CONNECT
            </h2>
            <p className="text-xs sm:text-[11px] md:text-[12px] font-medium leading-tight text-black/70">
              conozcamos tu empresa
            </p>
          </div>

          {/* Logo centrado en la parte inferior, negro sobre amarillo */}
          <div className="flex justify-center w-full shrink-0 pt-2">
            <Image src="/logo.png" alt="" width={24} height={24} className="object-contain" />
          </div>

          {/* Degradado blanco inferior de la tarjeta */}
          <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
        </motion.div>

        {/* Tarjeta Negra (Derecha) */}
        <motion.div
          onClick={() => handleCardClick('founder')}
          animate={isShuffling ? { 
            rotate: [ 5, -5, 5], 
            x: ['calc(-50% + 100px)', 'calc(-50% + 95px)', 'calc(-50% + 100px)'] 
          } : { 
            rotate: selectedCategory === 'founder' ? 0 : 5, 
            x: 'calc(-50% + 100px)',
            scale: selectedCategory === 'founder' ? 1.1 : 1,
            y: selectedCategory === 'founder' ? -10 : 0
          }}
          transition={{ duration: 0.5, repeat: isShuffling ? Infinity : 0 }}
          className={`absolute w-[160px] h-[240px] sm:w-[190px] sm:h-[280px] md:w-[230px] md:h-[340px] bg-black rounded-[20px] sm:rounded-[25px] md:rounded-[30px] p-4 sm:p-5 md:p-7 shadow-2xl flex flex-col justify-between overflow-visible cursor-pointer transition-all ${
            selectedCategory === 'founder' ? 'z-30' : 'z-10'
          }`}
          style={{ left: '50%' }}
        >
          <div className="text-[#FFE100]">
            <Rocket size={20} className="sm:w-6 sm:h-6 md:w-8 md:h-8 mb-4 sm:mb-6 md:mb-8" strokeWidth={2.5} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-none tracking-tighter mb-2 sm:mb-3 md:mb-4">
              MEET <br /> A NEW <br /> FRIEND
            </h2>
            <p className="text-xs sm:text-[11px] md:text-[12px] font-medium leading-tight text-[#FFE100]/70">
              conozcamos al founder
            </p>
          </div>

          {/* Logo centrado en la parte inferior, blanco sobre negro */}
          <div className="flex justify-center w-full shrink-0 pt-2">
            <Image src="/logo.png" alt="" width={24} height={24} className="object-contain brightness-0 invert" />
          </div>

          {/* Degradado blanco inferior de la tarjeta (más intenso en la negra) */}
          <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-white/30 via-white/10 to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Footer y Botón: más pegados a las tarjetas */}
      <div className="w-full max-w-[320px] flex flex-col items-center gap-3 sm:gap-4 -mt-8 sm:-mt-12 z-50 px-4">
        <p className="text-xl sm:text-2xl font-light text-gray-500 italic">ahora si</p>
        
        <button 
          onClick={handleStart}
          disabled={isShuffling || !selectedCategory}
          className={`w-full bg-black text-white rounded-full py-4 sm:py-5 px-6 sm:px-8 flex items-center justify-between active:scale-95 transition-transform shadow-xl ${
            !selectedCategory ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
          } disabled:opacity-80`}
        >
          <span className="text-xl sm:text-2xl font-light tracking-wide mx-auto">
            {isShuffling ? 'barajando...' : 'comencemos'}
          </span>
          <div className="flex gap-[-4px]">
            <ChevronRight size={20} className="sm:w-6 sm:h-6 text-white opacity-40" />
            <ChevronRight size={20} className="sm:w-6 sm:h-6 text-white" />
          </div>
        </button>
      </div>

      {/* El degradado blanco global que sube sutilmente desde el fondo */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-40" />
    </div>
  )
}
