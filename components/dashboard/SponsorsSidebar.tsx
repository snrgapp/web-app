'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { patrocinadoresData } from '@/lib/dashboard-mock-data'
import { Card } from '@/components/ui/card'

export function SponsorsSidebar() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTouch, setIsTouch] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    const x = ((clientX / innerWidth) - 0.5) * 20
    const y = ((clientY / innerHeight) - 0.5) * 20
    setMousePosition({ x, y })
  }, [])

  useEffect(() => {
    setIsTouch('ontouchstart' in window)
    if (!('ontouchstart' in window)) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  const parallaxOffset = isTouch ? { x: 0, y: 0 } : mousePosition

  return (
    <aside className="w-full xl:w-64 xl:min-w-[256px] bg-white border-t xl:border-t-0 xl:border-l border-zinc-200 p-6 overflow-hidden">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-4">
        Patrocinadores
      </p>
      <div className="flex flex-col sm:flex-row xl:flex-col gap-3">
        {patrocinadoresData.map((sponsor, i) => (
          <motion.div
            key={sponsor.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              opacity: { duration: 0.3, delay: 0.2 + i * 0.1 },
              x: { type: 'spring', stiffness: 150, damping: 20 },
              y: { type: 'spring', stiffness: 150, damping: 20 },
            }}
            style={{
              x: parallaxOffset.x * (i + 1) * 0.5,
              y: parallaxOffset.y * (i + 1) * 0.5,
            }}
          >
            <Card className="p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: sponsor.iconColor }}
              >
                {sponsor.name.charAt(0)}
              </div>
              <span className="font-medium text-zinc-900">{sponsor.name}</span>
            </Card>
          </motion.div>
        ))}
      </div>
    </aside>
  )
}
