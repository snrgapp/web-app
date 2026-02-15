import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'
import { PanelSidebar } from '@/components/dashboard/PanelSidebar'
import { isAuthenticated } from '@/app/actions/auth'

const inter = Inter({ subsets: ['latin'], variable: '--font-dashboard' })

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/login')
  }

  return (
    <div
      className={`min-h-screen bg-white ${inter.variable} font-sans`}
      style={{ fontFamily: 'var(--font-dashboard), Inter, system-ui, sans-serif' }}
    >
      <div className="flex flex-col lg:flex-row min-h-screen">
        <PanelSidebar />
        <main className="flex-1 min-w-0 overflow-auto flex flex-col items-center w-full">
          <div className="w-full max-w-7xl mx-auto min-w-0 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
