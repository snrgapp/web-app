'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { getSubmissionsByDayForMonth } from '@/lib/forms/form-repository-client'
import { useOrgId } from '@/components/panel/OrgProvider'
import { Loader2 } from 'lucide-react'

const Y_TICKS = [10, 20, 30, 40, 50, 60, 70, 80]

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const CustomTooltip = ({
  active,
  payload,
  label,
  monthName,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: number
  monthName: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-lg shadow-lg border border-zinc-200 p-3">
      <p className="text-xs text-zinc-400 mb-1">Día {label}</p>
      <p className="text-2xl font-hero text-black">{payload[0].value} registros</p>
      <p className="text-xs text-zinc-400">{monthName}</p>
    </div>
  )
}

interface TotalAsistentesChartProps {
  selectedMonth: string // "2026-01", "2026-02", ...
}

export function TotalAsistentesChart({ selectedMonth }: TotalAsistentesChartProps) {
  const orgId = useOrgId()
  const [year, month] = selectedMonth.split('-').map(Number)
  const monthName = MONTHS_ES[month - 1] ?? ''
  const [data, setData] = useState<{ day: number; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orgId) return
    setLoading(true)
    getSubmissionsByDayForMonth(year, month, orgId).then((result) => {
      setData(result.sort((a, b) => a.day - b.day))
      setLoading(false)
    })
  }, [orgId, year, month])

  const maxVal = data.length ? Math.max(...data.map((d) => d.value)) : 0
  const yDomain = Math.max(80, maxVal, 1)
  const yTicks = [...Y_TICKS]
  if (yDomain > 80 && !yTicks.includes(yDomain)) {
    yTicks.push(yDomain)
  }

  if (loading) {
    return (
      <div className="h-[280px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="h-[280px] min-h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#a1a1aa' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#a1a1aa' }}
            axisLine={false}
            tickLine={false}
            domain={[0, yDomain]}
            ticks={yTicks}
            tickFormatter={(v) => v.toString()}
          />
          <Tooltip
            content={<CustomTooltip monthName={`${monthName} ${year}`} />}
            cursor={{ fill: '#f4f4f5' }}
          />
          <Bar
            dataKey="value"
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
