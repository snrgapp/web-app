import { Inter } from 'next/font/google'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DashboardTopNav } from '@/components/dashboard/DashboardTopNav'
import { DashboardContentWrapper } from '@/components/dashboard/DashboardContentWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-dashboard' })

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`min-h-screen bg-pure-dark ${inter.variable} font-sans`}
      style={{ fontFamily: 'var(--font-dashboard), Inter, system-ui, sans-serif' }}
    >
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopNav />
          <DashboardContentWrapper>{children}</DashboardContentWrapper>
        </div>
      </div>
    </div>
  )
}
