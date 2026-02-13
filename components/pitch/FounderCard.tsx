'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Founder } from '@/types/database.types'
import { CheckCircle } from 'lucide-react'

interface FounderCardProps {
  founder: Founder
  voted: boolean
  onClick: () => void
  index: number
}

export function FounderCard({ founder, voted, onClick, index }: FounderCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      onClick={onClick}
      disabled={voted}
      className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
        voted
          ? 'opacity-50 cursor-not-allowed bg-zinc-100 border-zinc-200'
          : 'bg-white border-zinc-200 hover:border-black hover:shadow-md cursor-pointer active:scale-[0.98]'
      }`}
    >
      {/* Voted overlay badge */}
      {voted && (
        <div className="absolute top-2 right-2 z-10">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
      )}

      {/* Foto */}
      <div className={`w-20 h-20 rounded-full overflow-hidden bg-zinc-200 flex-shrink-0 ${voted ? 'grayscale' : ''}`}>
        {founder.image_url ? (
          <Image
            src={founder.image_url}
            alt={founder.nombre}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-zinc-400">
            {founder.nombre.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-center">
        <p className="font-semibold text-sm text-black leading-tight">{founder.nombre}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{founder.startup_nombre}</p>
      </div>
    </motion.button>
  )
}
