'use client'

import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function MembersTopBar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6 gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-9 bg-zinc-50 border-zinc-200"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="relative p-2 rounded-lg text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
          </button>
        </div>
      </div>
    </header>
  )
}
