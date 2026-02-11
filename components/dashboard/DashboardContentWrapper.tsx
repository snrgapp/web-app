'use client'

export function DashboardContentWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col flex-1 bg-white">
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  )
}
