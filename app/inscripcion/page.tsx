/**
 * Página índice de inscripciones (sin slug).
 * Se muestra cuando se accede a /inscripcion o inscripcion.snrg.lat sin path.
 */

import Link from 'next/link'

export default function InscripcionIndexPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Inscripción a eventos
      </h1>
      <p className="mt-4 text-zinc-600">
        Accede a un formulario de inscripción mediante el enlace que te hayan
        facilitado.
      </p>
      <Link
        href="https://snrg.lat"
        className="mt-8 inline-block text-sm text-zinc-600 hover:text-zinc-900"
      >
        Volver a Synergy
      </Link>
    </main>
  )
}
