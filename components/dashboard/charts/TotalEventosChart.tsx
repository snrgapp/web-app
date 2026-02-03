'use client'

import { totalEventosData } from '@/lib/dashboard-mock-data'

const total = totalEventosData.online + totalEventosData.offline
const onlinePercent = (totalEventosData.online / total) * 100

export function TotalEventosChart() {
  return (
    <div className="space-y-4">
      <p className="text-2xl font-hero text-black">
        {total.toLocaleString()} Total
      </p>
      <div className="h-3 rounded-full bg-zinc-200 overflow-hidden flex">
        <div
          className="h-full bg-[#8b5cf6] rounded-l-full transition-all duration-500"
          style={{ width: `${onlinePercent}%` }}
        />
        <div
          className="h-full bg-zinc-300 rounded-r-full flex-1"
          style={{ width: `${100 - onlinePercent}%` }}
        />
      </div>
      <div className="flex gap-6 text-sm">
        <span className="text-zinc-600">
          Online: <span className="font-medium text-zinc-900">{totalEventosData.online} users</span>
        </span>
        <span className="text-zinc-600">
          Offline: <span className="font-medium text-zinc-900">{totalEventosData.offline} users</span>
        </span>
      </div>
    </div>
  )
}
