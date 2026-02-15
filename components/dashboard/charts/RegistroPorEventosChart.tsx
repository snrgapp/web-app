'use client'

import { useState, useEffect } from 'react'
import { getEventosConCountAsistentes } from '@/app/actions/networking'
import { Loader2, Calendar } from 'lucide-react'
import Image from 'next/image'

export function RegistroPorEventosChart() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getEventosConCountAsistentes>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getEventosConCountAsistentes()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const maxCount = data.length ? Math.max(...data.map((d) => d.count), 1) : 1

  if (loading) {
    return (
      <div className="min-h-[160px] flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="min-h-[160px] flex items-center justify-center py-8">
        <p className="text-sm text-zinc-500 text-center px-4">
          No hay eventos con registros.
        </p>
      </div>
    )
  }

  const ROW_HEIGHT = 36
  const GAP = 12
  const VISIBLE_ROWS = 6
  const maxHeight = VISIBLE_ROWS * ROW_HEIGHT + (VISIBLE_ROWS - 1) * GAP + 8

  return (
    <div>
      <div
        className="overflow-y-auto overflow-x-hidden pr-3 space-y-3 py-1"
        style={{ maxHeight }}
      >
        {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3 min-w-0"
        >
          {/* Icono miniatura del evento */}
          <div className="h-8 w-8 shrink-0 rounded-full overflow-hidden bg-zinc-100 flex items-center justify-center ring-2 ring-white">
            {item.image_url ? (
              item.image_url.startsWith('/') ? (
                <Image
                  src={item.image_url}
                  alt=""
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <Calendar className="h-4 w-4 text-zinc-400" />
            )}
          </div>

          {/* Barra con label a la izquierda */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span
              className="text-sm font-medium text-zinc-800 truncate shrink-0 max-w-[120px] sm:max-w-[180px]"
              title={item.titulo ?? item.checkin_slug ?? 'Evento'}
            >
              {item.titulo ?? item.checkin_slug ?? 'Sin título'}
            </span>
            <div className="flex-1 min-w-0 h-6 rounded-md bg-zinc-100 overflow-hidden">
              <div
                className="h-full bg-yellow rounded-r-md transition-all duration-500"
                style={{
                  width: `${Math.max((item.count / maxCount) * 100, item.count > 0 ? 6 : 0)}%`,
                }}
              />
            </div>
          </div>

          {/* Total al final */}
          <span className="text-sm font-semibold text-zinc-900 shrink-0 w-10 text-right tabular-nums">
            {item.count}
          </span>
        </div>
      ))}
      </div>
    </div>
  )
}
