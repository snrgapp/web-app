import { Bangers, Nunito } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-perrenque-nunito',
})

const bangers = Bangers({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-perrenque-bangers',
})

export default function PerrenqueNetworkingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${nunito.variable} ${bangers.variable} ${nunito.className}`}>
      {children}
    </div>
  )
}
