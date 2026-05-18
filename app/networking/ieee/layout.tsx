import type { Metadata } from 'next'
import { Fraunces } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces-ieee',
  weight: ['700', '900'],
})

export const metadata: Metadata = {
  title: 'IEEE · Networking',
  robots: { index: false, follow: false },
}

export default function IeeeNetworkingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`ieee-app-root ${GeistSans.className} ${fraunces.variable} ${GeistMono.variable} relative min-h-dvh bg-[#161616] text-white antialiased`}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[#161616]"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(255,255,255,.12) 1.1px, transparent 1.25px)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
