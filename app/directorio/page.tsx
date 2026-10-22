import Image from 'next/image'
import { PuertaTelefono } from '@/components/directorio/PuertaTelefono'
import { RejillaDirectorio } from '@/components/directorio/RejillaDirectorio'
import { cargarDirectorio } from '@/lib/directorio/consultas'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function PaginaDirectorio() {
  const estado = await cargarDirectorio()

  if (estado.tipo === 'lista') {
    return (
      <RejillaDirectorio
        tarjetas={estado.tarjetas}
        titulo={estado.titulo}
        aviso={estado.aviso}
        sectores={estado.sectores}
      />
    )
  }

  if (estado.tipo === 'aviso') {
    return (
      <main className="directorio-puerta">
        <Image
          src="/brand/logo-synergy.svg"
          alt="Synergy"
          width={56}
          height={56}
          priority
          unoptimized
          className="directorio-puerta__logo"
        />
        <h1 className="directorio-puerta__titulo">Quiénes estuvieron</h1>
        <p className="directorio-puerta__error" role="alert">
          {estado.mensaje}
        </p>
      </main>
    )
  }

  return <PuertaTelefono mensaje={estado.mensaje} />
}
