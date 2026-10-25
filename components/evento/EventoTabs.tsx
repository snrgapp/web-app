'use client'

import { useState, type ReactNode } from 'react'

export default function EventoTabs({ tabs }: { tabs: { id: string; label: string; contenido: ReactNode }[] }) {
  const [activa, setActiva] = useState(tabs[0]?.id)
  if (!tabs.length) return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 pb-1" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === activa}
            onClick={() => setActiva(t.id)}
            className={`px-4 py-2 rounded-lg text-[13px] leading-4 tracking-[0.01em] font-semibold transition-all ${
              t.id === activa ? 'bg-black text-white' : 'bg-[#f4f2fd] text-[#46464b] hover:text-[#1a1b22]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" className={t.id === activa ? 'flex flex-col gap-3' : 'hidden'}>
          {t.contenido}
        </div>
      ))}
    </div>
  )
}
