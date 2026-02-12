/**
 * Layout mínimo para la sección de inscripciones.
 * No incluye navbar ni elementos de la landing.
 */

export default function InscripcionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      {children}
    </div>
  )
}
