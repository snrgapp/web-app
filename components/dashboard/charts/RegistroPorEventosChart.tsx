'use client'

import { useState, useEffect } from 'react'
import { getFormsWithSubmissionCount } from '@/lib/forms/form-repository-client'
import { Loader2 } from 'lucide-react'

export function RegistroPorEventosChart() {
  const [data, setData] = useState<{ titulo: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getFormsWithSubmissionCount().then((forms) => {
      setData(forms.map((f) => ({ titulo: f.titulo, count: f.count })))
      setLoading(false)
    })
  }, [])

  const maxCount = data.length ? Math.max(...data.map((d) => d.count), 1) : 1

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-sm text-zinc-500 text-center">
          No hay formularios con inscripciones.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-[200px] space-y-4">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-zinc-900 truncate pr-2" title={item.titulo}>
              {item.titulo}
            </span>
            <span className="text-zinc-500 flex-shrink-0">{item.count} registros</span>
          </div>
          <div className="h-3 rounded-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full bg-[#8b5cf6] rounded-full transition-all duration-500"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
