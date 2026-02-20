import { Inter } from 'next/font/google'
import { MembersSidebar } from '@/components/miembros/MembersSidebar'
import { MembersTopBar } from '@/components/miembros/MembersTopBar'

const inter = Inter({ subsets: ['latin'], variable: '--font-members' })

export default function MiembrosAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`min-h-screen bg-zinc-50 ${inter.variable}`}
      style={{ fontFamily: 'var(--font-members), Inter, system-ui, sans-serif' }}
    >
      <div className="flex flex-col lg:flex-row min-h-screen">
        <MembersSidebar />
        <div className="flex-1 min-w-0 flex flex-col">
          <MembersTopBar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
