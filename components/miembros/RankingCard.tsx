'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export interface RankingEntry {
  id: string
  nombre: string
  count?: number
}

interface RankingCardProps {
  title: string
  entries: RankingEntry[]
  emptyMessage?: string
}

export function RankingCard({ title, entries, emptyMessage = 'Aún no hay datos' }: RankingCardProps) {
  const positions = ['1°', '2°', '3°']
  const topThree = entries.slice(0, 3)

  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-zinc-700">{title}</h3>
      </CardHeader>
      <CardContent className="space-y-3">
        {topThree.length === 0 ? (
          <p className="text-sm text-zinc-400">{emptyMessage}</p>
        ) : (
          topThree.map((entry, i) => (
            <div key={entry.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-amber-600 w-6">
                {positions[i]}
              </span>
              <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium text-zinc-600 flex-shrink-0">
                {entry.nombre.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-medium text-zinc-800 truncate">{entry.nombre}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
