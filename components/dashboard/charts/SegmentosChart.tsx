'use client'

import { useState, useEffect } from 'react'
import { getSubmissionsBySegment } from '@/lib/forms/form-repository-client'
import { useOrgId } from '@/components/panel/OrgProvider'
import { Loader2 } from 'lucide-react'

const SEGMENTO_COLORS = ['#6d28d9', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

export function SegmentosChart() {
  const orgId = useOrgId()
  const [data, setData] = useState<{ segmento: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    getSubmissionsBySegment(orgId).then((items) => {
      setData(items)
      setLoading(false)
    })
  }, [orgId])

  const total = data.reduce((acc, d) => acc + d.count, 0)
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
      <div className="min-h-[200px] flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-zinc-500 text-center">
          No hay inscripciones con segmento.
        </p>
        <p className="text-xs text-zinc-400 text-center max-w-xs">
          Añade un campo &quot;segmento&quot; (tipo select u opciones) en tus formularios para ver los totales por segmento.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-[200px] space-y-4">
      <div className="flex justify-between items-baseline text-sm mb-2">
        <span className="text-zinc-500">Total inscritos</span>
        <span className="font-hero text-lg text-zinc-900">{total.toLocaleString()}</span>
      </div>
      {data.map((item, idx) => (
        <div key={item.segmento} className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span
              className="font-medium text-zinc-900 truncate pr-2"
              title={item.segmento}
            >
              {item.segmento}
            </span>
            <span className="text-zinc-500 flex-shrink-0">
              {item.count} inscritos
            </span>
          </div>
          <div className="h-3 rounded-full bg-zinc-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(item.count / maxCount) * 100}%`,
                backgroundColor: SEGMENTO_COLORS[idx % SEGMENTO_COLORS.length],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
