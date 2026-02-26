'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Link href="/inicio" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-black transition-colors mb-8">
          ← Volver al inicio
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
          Términos y condiciones de uso – Synergy
        </h1>

        {/* Capítulo I */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo I – Identificación y aceptación
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Los presentes Términos y Condiciones regulan el acceso, uso, participación y vinculación a la comunidad, reuniones, eventos, plataformas digitales y actividades organizadas por Synergy (en adelante, &quot;la Organización&quot;).
            </p>
            <p>
              Al registrarse, realizar un pago, asistir a un evento, interactuar con nuestros canales digitales o participar en cualquier actividad de Synergy, el usuario declara que:
            </p>
            <ul className="space-y-2 list-disc list-inside pl-2">
              <li>Ha leído y comprendido estos Términos y Condiciones.</li>
              <li>Acepta expresamente su cumplimiento en su totalidad.</li>
              <li>Cuenta con capacidad legal para obligarse.</li>
            </ul>
            <p>
              Si el usuario no está de acuerdo con estos términos, debe abstenerse de utilizar los servicios y participar en los eventos.
            </p>
          </div>
        </section>

        {/* Capítulo II */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo II – Naturaleza del servicio
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Synergy es una comunidad privada de emprendedores, profesionales y empresarios, cuyo objetivo es facilitar espacios de networking, aprendizaje, conexión y crecimiento a través de:
            </p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>Reuniones presenciales y/o virtuales.</li>
              <li>Eventos, encuentros y actividades comunitarias.</li>
              <li>Contenido educativo y colaborativo.</li>
              <li>Espacios de interacción entre miembros.</li>
            </ul>
            <p>
              Synergy no garantiza resultados comerciales, financieros, contractuales ni de negocio derivados de la participación en la comunidad. Las oportunidades que puedan surgir dependen exclusivamente de la gestión individual de cada participante.
            </p>
          </div>
        </section>

        {/* Capítulo III */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo III – Registro y membresía
          </h2>
          <div className="space-y-6 text-zinc-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">1. Registro</h3>
              <p className="mb-4">
                Para acceder a las actividades de Synergy, el usuario deberá completar el proceso de registro proporcionando información veraz, actualizada y completa.
              </p>
              <p>Synergy se reserva el derecho de:</p>
              <ul className="space-y-1 list-disc list-inside pl-2 mt-2">
                <li>Verificar la información suministrada.</li>
                <li>Rechazar o cancelar registros que incumplan estos términos.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">2. Membresía y acceso</h3>
              <p className="mb-2">La membresía otorga al usuario el derecho a:</p>
              <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
                <li>Asistir a las reuniones y eventos organizados durante el período anual vigente.</li>
                <li>Acceder a los beneficios definidos para su tipo de membresía.</li>
              </ul>
              <p>
                Las reuniones no son acumulables.
                La no asistencia a una reunión o evento implica la pérdida automática de dicho espacio, sin derecho a compensación, reposición ni traslado.
              </p>
            </div>
          </div>
        </section>

        {/* Capítulo IV */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo IV – Pagos, facturación y no reembolsos
          </h2>
          <div className="space-y-6 text-zinc-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">1. Condiciones de pago</h3>
              <p className="mb-2">Todos los pagos deben realizarse por los medios habilitados por Synergy.</p>
              <p>El acceso a la comunidad y a los eventos está sujeto a la confirmación del pago.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">2. Política de no reembolsos</h3>
              <p className="mb-2">
                Synergy no realiza devoluciones, reembolsos ni retornos de pagos, bajo ninguna circunstancia.
              </p>
              <p className="mb-2">Esto aplica incluso en casos de:</p>
              <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
                <li>Inasistencia del usuario.</li>
                <li>Cambios de agenda personales.</li>
                <li>Fuerza mayor del usuario.</li>
                <li>Cancelación voluntaria de la membresía.</li>
              </ul>
              <p>
                El pago se entiende como una reserva de cupo y acceso a la comunidad, no como un consumo unitario por evento.
              </p>
            </div>
          </div>
        </section>

        {/* Capítulo V */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo V – Uso de imagen y material audiovisual
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Durante los eventos y reuniones organizados por Synergy, se podrán capturar:
            </p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>Fotografías</li>
              <li>Videos</li>
              <li>Grabaciones de audio</li>
              <li>Material audiovisual en general</li>
            </ul>
            <p>
              Al asistir, el usuario autoriza de manera expresa, gratuita e indefinida a Synergy para:
            </p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>Usar su imagen, voz y/o apariencia.</li>
              <li>Publicar dicho material en redes sociales, sitio web, anuncios, campañas promocionales y material institucional.</li>
              <li>Editar, reproducir y distribuir dicho contenido sin limitación territorial.</li>
            </ul>
            <p>
              Esta autorización no genera compensación económica y se entiende otorgada por el solo hecho de asistir a los eventos.
            </p>
          </div>
        </section>

        {/* Capítulo VI */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VI – Conducta del usuario
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>El usuario se compromete a:</p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>Mantener una conducta respetuosa, ética y profesional.</li>
              <li>No realizar actos que afecten la reputación, seguridad o integridad de la comunidad.</li>
              <li>No utilizar los espacios para prácticas engañosas, spam, captación abusiva o actividades ilícitas.</li>
            </ul>
            <p>Synergy se reserva el derecho de:</p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>Advertir, suspender o expulsar a cualquier miembro que incumpla estas normas.</li>
              <li>Retirar el acceso sin reembolso cuando el comportamiento del usuario afecte negativamente a la comunidad.</li>
            </ul>
          </div>
        </section>

        {/* Capítulo VII */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VII – Responsabilidad y limitación
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>Synergy:</p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>No es responsable por acuerdos, negociaciones o relaciones comerciales realizadas entre miembros.</li>
              <li>No actúa como intermediario, garante ni asesor legal, financiero o comercial.</li>
              <li>No responde por pérdidas, daños o perjuicios derivados de decisiones tomadas por los usuarios a partir de interacciones en la comunidad.</li>
            </ul>
            <p>
              Cada miembro es único responsable de evaluar oportunidades, propuestas y relaciones surgidas en los espacios de Synergy.
            </p>
          </div>
        </section>

        {/* Capítulo VIII */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VIII – Propiedad intelectual
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Todo el contenido generado por Synergy, incluyendo:
          </p>
          <ul className="space-y-1 text-zinc-700 leading-relaxed list-disc list-inside pl-2 mb-4">
            <li>Marca</li>
            <li>Logotipos</li>
            <li>Material gráfico</li>
            <li>Textos</li>
            <li>Metodologías</li>
            <li>Contenido audiovisual</li>
          </ul>
          <p className="text-zinc-700 leading-relaxed">
            Es propiedad exclusiva de Synergy o de sus respectivos titulares y no puede ser reproducido, distribuido o explotado sin autorización previa y expresa.
          </p>
        </section>

        {/* Capítulo IX */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo IX – Uso de datos
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Los datos personales suministrados serán tratados conforme a la Política de Privacidad y Uso de Datos de Synergy, la cual forma parte integral de estos Términos y Condiciones.
            </p>
            <p>Synergy utiliza la información para:</p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>Mejorar la experiencia de los emprendedores.</li>
              <li>Optimizar eventos y dinámicas comunitarias.</li>
              <li>Analizar métricas de participación y crecimiento.</li>
            </ul>
          </div>
        </section>

        {/* Capítulo X */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo X – Modificaciones
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Synergy se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento.
            </p>
            <p>Las modificaciones:</p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>Serán publicadas en los canales oficiales.</li>
              <li>Entrarán en vigencia desde su publicación.</li>
              <li>Se entenderán aceptadas por el usuario al continuar participando en la comunidad.</li>
            </ul>
          </div>
        </section>

        {/* Capítulo XI */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo XI – Legislación aplicable
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Estos Términos y Condiciones se rigen por la legislación vigente aplicable en el territorio donde Synergy desarrolla sus operaciones.
            </p>
            <p>
              Cualquier controversia será resuelta conforme a los mecanismos legales correspondientes.
            </p>
          </div>
        </section>

        {/* Capítulo XII */}
        <section className="mb-12">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo XII – Aceptación final
          </h2>
          <p className="text-zinc-700 leading-relaxed">
            Al registrarse, realizar un pago o asistir a cualquier actividad de Synergy, el usuario declara haber leído, entendido y aceptado plenamente estos Términos y Condiciones.
          </p>
        </section>

        <Link href="/inicio" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-black transition-colors">
          ← Volver al inicio
        </Link>
      </article>
      <Footer />
    </main>
  )
}
