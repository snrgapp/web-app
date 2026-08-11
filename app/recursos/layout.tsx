import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/newsreader'
import '@fontsource-variable/inter'
import '@/components/recursos/complete-shelf/globals.css'
import { siteConfig } from '@/components/recursos/complete-shelf/site-config'

export const metadata: Metadata = {
  title: 'Recursos',
  description: siteConfig.description,
  applicationName: siteConfig.applicationName,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#eee8db',
  colorScheme: 'light',
}

export default function RecursosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
