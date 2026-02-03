'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import * as LucideIcons from 'lucide-react'
import { Category } from '@/types/database.types'

interface QuestionCardProps {
  content: string
  category: Category
  variant?: 'yellow' | 'dark'
  className?: string
  variants?: any
  initial?: any
  animate?: any
  style?: React.CSSProperties
}

// Función helper para obtener el icono de Lucide por slug
const getIcon = (iconSlug: string) => {
  // Convertir slug a PascalCase (ej: "code" -> "Code")
  const iconName = iconSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  
  // Buscar el icono en el objeto de Lucide
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle
  
  return IconComponent
}

export default function QuestionCard({
  content,
  category,
  variant = 'yellow',
  className = '',
  variants,
  initial,
  animate,
  style,
}: QuestionCardProps) {
  const IconComponent = getIcon(category.icon_slug)
  const isDark = variant === 'dark'
  
  return (
    <motion.div
      className={`
        relative w-[140px] h-[240px] sm:w-[170px] sm:h-[280px] md:w-[210px] md:h-[340px] mx-auto
        rounded-[20px] sm:rounded-[25px] md:rounded-[30px] shadow-2xl overflow-hidden
        p-4 sm:p-5 md:p-7
        flex flex-col justify-between
        ${isDark ? 'bg-[#1a1a1a] border border-white/10' : 'bg-[#FFE100] border border-black/5'}
        ${className}
      `}
      style={{
        willChange: 'transform, opacity, filter',
        ...style,
      }}
      variants={variants}
      initial={initial}
      animate={animate}
    >
      {/* Icono en la esquina superior izquierda */}
      <div className={isDark ? 'text-[#FFE100]' : 'text-black'}>
        <IconComponent 
          size={20} 
          className="sm:w-6 sm:h-6 md:w-8 md:h-8 mb-4 sm:mb-6 md:mb-8" 
          strokeWidth={2.5} 
        />
      </div>

      {/* Contenido de la pregunta: wrap y scroll, fuente más pequeña para evitar palabras partidas */}
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden flex flex-col">
        <p className={`font-question text-left break-words [overflow-wrap:anywhere] ${isDark ? 'text-[#FFE100]' : 'text-black'}`}>
          {content}
        </p>
      </div>

      {/* Logo centrado en la parte inferior */}
      <div className="flex justify-center w-full shrink-0 pt-2">
        <Image src="/logo.png" alt="" width={24} height={24} className={`object-contain ${isDark ? 'brightness-0 invert' : ''}`} />
      </div>

      {/* Degradado suave inferior */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[28%] pointer-events-none rounded-b-[20px] sm:rounded-b-[25px] md:rounded-b-[30px]"
        style={{
          background: isDark
            ? 'linear-gradient(to top, rgba(255,225,0,0.15) 0%, transparent 100%)'
            : 'linear-gradient(to top, rgba(255,255,255,0.25) 0%, transparent 100%)',
        }}
      />
    </motion.div>
  )
}
