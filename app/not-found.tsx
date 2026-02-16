import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="flex flex-col items-center justify-center text-center max-w-md">
        {/* Contenedor: imagen de fondo, texto al frente */}
        <div className="relative flex flex-col items-center">
          {/* Ilustración - tarjetas en tonos amarillo y gris */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-8 flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/404-illustration.png"
              alt=""
              className="w-full h-full object-contain"
              width={192}
              height={192}
            />
          </div>

          {/* Texto centrado al frente - misma fuente que headers (Inter) */}
          <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight leading-tight">
            parece que estás perdido.
          </h1>
          <p className="mt-2 text-base sm:text-lg font-thin text-zinc-500 tracking-tight">
            no te preocupes, vamos a llevarte a casa
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center px-8 py-3 bg-black text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
