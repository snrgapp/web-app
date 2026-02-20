'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { NotificationsBubble } from './NotificationsBubble'

export function MembersTopBar() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200">
      <div className="h-14 px-4 lg:px-6 max-w-7xl mx-auto flex items-center gap-6">
        {/* Misma estructura que fila superior: flex-1 (área del card) + lg:w-80 (área del calendario) */}
        <div className="flex-1 flex justify-end">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="pl-9 bg-zinc-50 border-zinc-200 w-full"
            />
          </div>
        </div>
        <div className="lg:w-80 flex items-center justify-end gap-2 flex-shrink-0">
          <NotificationsBubble />
        </div>
      </div>
    </header>
  )
}
