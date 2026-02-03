'use client'

import { usePathname } from 'next/navigation'
import { SponsorsSidebar } from './SponsorsSidebar'

export function DashboardContentWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isBaseDatos = pathname === '/panel/base-datos'

  return (
    <div className="flex flex-col xl:flex-row flex-1 bg-white">
      <main className="flex-1 min-w-0">{children}</main>
      {!isBaseDatos && <SponsorsSidebar />}
    </div>
  )
}
