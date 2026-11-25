'use client'

import { type ReactNode } from 'react'
import { LanguageProvider } from '@/components/i18n/LanguageProvider'

export default function Providers({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>
}
