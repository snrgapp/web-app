import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces-genius',
  weight: ['700', '900'],
})

export const metadata: Metadata = {
  title: 'Genius FEST · Networking',
  robots: { index: false, follow: false },
}

export default function GeniusNetworkingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`genius-app-root ${GeistSans.className} ${fraunces.variable} ${GeistMono.variable} relative min-h-dvh bg-[#161616] text-white antialiased`}
    >
      {children}
    </div>
  )
}
