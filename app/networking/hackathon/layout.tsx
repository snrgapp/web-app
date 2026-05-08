import { Inter } from 'next/font/google'
import './hackathon-theme.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export default function HackathonNetworkingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className={inter.className}>{children}</div>
}
