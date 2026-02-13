'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NetworkingFeedbackPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="w-full p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft size={24} className="text-black" />
          </button>
          <button className="text-black text-sm bg-white px-4 py-2 rounded-full border border-gray-200">
            finalizar
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
        {/* Prompt */}
        <div className="flex items-center gap-2 mb-12">
          <Image src="/logo.png" alt="" width={24} height={24} className="object-contain shrink-0" />
          <p className="text-black text-xl font-medium">
            Que te pareció la dinámica
          </p>
        </div>

        {/* Botones de feedback */}
        <div className="flex gap-6 mb-12">
          {/* Botón feliz */}
          <motion.button
            onClick={() => router.push('/networking')}
            className="w-32 h-32 rounded-3xl shadow-lg flex items-center justify-center"
            style={{ backgroundColor: '#FFD700' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-6xl">
              <span className="text-black">😊</span>
            </div>
          </motion.button>

          {/* Botón triste */}
          <motion.button
            onClick={() => router.push('/networking')}
            className="w-32 h-32 rounded-3xl shadow-lg flex items-center justify-center"
            style={{ backgroundColor: '#FF0000' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-6xl">
              <span className="text-black">😞</span>
            </div>
          </motion.button>
        </div>

        {/* Footer text */}
        <p className="text-gray-500 text-xs text-center max-w-xs">
          nos alegra haber ayudado en tu experiencia de conexión
        </p>
      </div>
    </div>
  )
}
