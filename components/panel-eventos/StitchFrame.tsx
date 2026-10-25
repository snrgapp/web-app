'use client'

import { useEffect } from 'react'

export function StitchFrame({ src, title }: { src: string; title: string }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  return (
    <iframe
      src={src}
      title={title}
      className="fixed inset-0 z-[100] h-[100dvh] w-screen border-0 bg-[#fbf8ff]"
    />
  )
}
