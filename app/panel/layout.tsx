import { Inter } from 'next/font/google'
import { redirect } from 'next/navigation'
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav'
import { DashboardContentWrapper } from '@/components/dashboard/DashboardContentWrapper'
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
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <DashboardTopNav />
          <DashboardContentWrapper>{children}</DashboardContentWrapper>
        </div>
      </div>
    </div>
  )
}
