import Link from 'next/link'

export default function InscripcionNotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Formulario no encontrado
      </h1>
      <p className="mt-2 text-zinc-600">
        El enlace puede estar mal o el formulario ya no está disponible.
      </p>
      <Link
        href="https://snrg.lat"
        className="mt-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
      >
        Volver a Synergy
      </Link>
    </main>
  )
}
