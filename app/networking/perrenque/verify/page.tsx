'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2, ArrowLeft } from 'lucide-react'

function VerifyContent() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#1a9fd4] flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm absolute top-0 left-0 p-4">
        <button
          type="button"
          onClick={() => router.push('/networking/perrenque')}
          className="text-white drop-shadow-sm"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="mx-auto w-[min(88vw,200px)] aspect-square rounded-full border-[2.5px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] overflow-hidden bg-black">
          <Image
            src="/images/perrenque-creativo-logo.png"
            alt="Perrenque Creativo"
            width={200}
            height={200}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-sm rounded-2xl border-[2.5px] border-[#1a1a1a] bg-[#FFD600] p-6 shadow-[5px_5px_0_#1a1a1a]"
      >
        <p className="text-center text-base sm:text-lg font-black text-[#1a1a1a] leading-snug tracking-wide">
          El perrenque nunca para, nos vemos el próximo año.
        </p>
      </motion.div>
    </div>
  )
}

export default function PerrenqueVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a9fd4] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
