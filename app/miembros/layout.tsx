import { Inter } from 'next/font/google'
import './members-theme.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-members',
  display: 'swap',
})

export default function MiembrosRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`members-app ${inter.variable} ${inter.className}`}>
      {children}
    </div>
  )
}
