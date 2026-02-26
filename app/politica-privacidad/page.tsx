'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Link href="/inicio" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-black transition-colors mb-8">
          ← Volver al inicio
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
          Política de privacidad y protección de datos personales – Synergy
        </h1>

        {/* Capítulo I */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo I – Objetivo y alcance
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              La presente Política de Privacidad y Protección de Datos Personales tiene por objeto establecer los lineamientos bajo los cuales Synergy (en adelante &quot;la Organización&quot;) recopila, procesa, almacena, transfiere, actualiza, comparte, elimina y protege los datos personales de todas las personas naturales o jurídicas que se relacionan con la Organización, incluidos, entre otros: asistentes, emprendedores, participantes en reuniones y eventos, proveedores, aliados comerciales y cualquier tercero que suministre información personal o sea objeto de tratamiento de datos.
            </p>
            <p>
              Esta política es de cumplimiento obligatorio para la Organización y para todas las personas o entidades que, en virtud de una relación contractual, comercial o de cualquier índole, actúen en nombre o por cuenta de Synergy.
            </p>
            <p>
              Este documento se expide en cumplimiento de la normatividad vigente en materia de protección de datos personales, y su consulta es un requisito previo a la entrega voluntaria de cualquier información personal o sensible por parte del titular.
            </p>
          </div>
        </section>

        {/* Capítulo II */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo II – Principios que rigen el tratamiento de datos
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-6">
            El tratamiento de datos personales en Synergy se realiza con sujeción a los siguientes principios, inspirados en la regulación colombiana y las mejores prácticas internacionales:
          </p>
          <ul className="space-y-3 text-zinc-700 leading-relaxed list-none">
            <li><strong className="text-[#1a1a1a]">Principio de legalidad:</strong> El tratamiento se efectuará con base en la normatividad aplicable y en el consentimiento libre, previo, expreso e informado del titular.</li>
            <li><strong className="text-[#1a1a1a]">Principio de finalidad:</strong> El tratamiento de datos se hará con fines legítimos y específicos relacionados con la gestión, operación y mejora de la comunidad Synergy.</li>
            <li><strong className="text-[#1a1a1a]">Principio de veracidad:</strong> Los datos deben ser veraces, completos, actualizados y verificables.</li>
            <li><strong className="text-[#1a1a1a]">Principio de transparencia:</strong> El titular tiene derecho a saber qué datos se recolectan, cómo se usan y con quién se comparten.</li>
            <li><strong className="text-[#1a1a1a]">Principio de seguridad:</strong> Se adoptan medidas tecnológicas, administrativas y humanas para proteger los datos frente a accesos no autorizados, pérdida, modificación o divulgación.</li>
            <li><strong className="text-[#1a1a1a]">Principio de restricción de acceso:</strong> Solo personal debidamente autorizado podrá acceder a los datos.</li>
            <li><strong className="text-[#1a1a1a]">Principio de confidencialidad:</strong> Todas las personas que intervienen en el tratamiento de datos están obligadas a mantener la reserva y privacidad de los mismos incluso después de terminada su relación con la Organización.</li>
          </ul>
        </section>

        {/* Capítulo III */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo III – Datos personales objeto de tratamiento
          </h2>
          <div className="space-y-6 text-zinc-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">1. Datos de identificación y contacto</h3>
              <p className="mb-2">Nombre completo, documento de identidad, número telefónico, correo electrónico.</p>
              <p>Datos profesionales: cargo, empresa, sector de actividad.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">2. Datos de participación en eventos</h3>
              <p className="mb-2">Historial de asistencia, preferencias de reuniones, inscripciones.</p>
              <p>Interacciones en plataformas, redes y sistemas de registro.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">3. Imágenes y material audiovisual</h3>
              <p>
                Durante la asistencia a eventos o reuniones organizados por Synergy, se capturan fotografías y videos que pueden identificarte directa o indirectamente; estos pueden ser usados en redes, anuncios, sitio web y material promocional, sin compensación adicional.
                Este tratamiento es autorizado por asistencia voluntaria a los eventos y forma parte de la presente política.
              </p>
            </div>
          </div>
        </section>

        {/* Capítulo IV */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo IV – Finalidades del tratamiento
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Los datos personales recopilados por Synergy podrán utilizarse para:
          </p>
          <ul className="space-y-2 text-zinc-700 leading-relaxed list-disc list-inside pl-2">
            <li>Gestionar tu participación y acceso a reuniones y eventos.</li>
            <li>Administrar cuentas de usuario y sistemas internos.</li>
            <li>Enviar comunicaciones, boletines, actualizaciones y novedades.</li>
            <li>Analizar tendencias de participación y métricas de comunidad.</li>
            <li>Personalizar la experiencia de los asistentes.</li>
            <li>Diseñar y mejorar servicios, programas, actividades y dinámicas comunitarias.</li>
            <li>Uso de material audiovisual con fines promocionales en medios propios o de terceros.</li>
            <li>Cumplir obligaciones legales, contractuales o regulatorias aplicables.</li>
          </ul>
          <p className="text-zinc-700 leading-relaxed mt-4">
            Este uso es coherente con los fines legítimos de la comunidad y se encuentra descrito de forma clara al momento de recolectar los datos.
          </p>
        </section>

        {/* Capítulo V */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo V – Obligaciones y derechos del titular
          </h2>
          <div className="space-y-6 text-zinc-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-3">Derechos del titular</h3>
              <p className="mb-3">Como titular de tus datos personales, tienes derecho a:</p>
              <ul className="space-y-1 list-disc list-inside pl-2">
                <li>Conocer qué datos se han recolectado.</li>
                <li>Solicitar la actualización, corrección o eliminación de tus datos.</li>
                <li>Revocar el consentimiento cuando corresponda.</li>
                <li>Presentar quejas ante la autoridad competente por el incumplimiento de esta política.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">Obligaciones del titular</h3>
              <p>
                Los datos suministrados deben ser veraces, completos y actualizados. El titular responde por la veracidad de la información proporcionada.
              </p>
            </div>
          </div>
        </section>

        {/* Capítulo VI */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VI – Seguridad y protección de datos
          </h2>
          <p className="text-zinc-700 leading-relaxed mb-4">
            Synergy ha implementado políticas, procedimientos y medidas de seguridad técnicas, administrativas y físicas con el fin de proteger los datos personales contra:
          </p>
          <ul className="space-y-1 text-zinc-700 leading-relaxed list-disc list-inside pl-2 mb-4">
            <li>Accesos no autorizados</li>
            <li>Uso indebido o fraudulento</li>
            <li>Alteración o pérdida de información</li>
            <li>Divulgación sin consentimiento</li>
          </ul>
          <p className="text-zinc-700 leading-relaxed">
            Estas medidas se revisan y actualizan periódicamente conforme a la evolución de las amenazas tecnológicas.
          </p>
        </section>

        {/* Capítulo VII */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VII – Transferencia de datos
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Synergy no venderá tus datos personales a terceros comerciales sin tu consentimiento explícito.
            </p>
            <p>
              Sin embargo, datos pueden compartirse con proveedores y aliados estratégicos únicamente para ejecutar actividades necesarias para la operación de la comunidad o la ejecución de servicios contratados. Siempre bajo estrictos acuerdos de confidencialidad.
            </p>
          </div>
        </section>

        {/* Capítulo VIII */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VIII – Modificaciones a la política
          </h2>
          <p className="text-zinc-700 leading-relaxed">
            Esta política puede ser actualizada por Synergy para mejorar la protección y adecuarse a cambios regulatorios o de operación. Cualquier modificación será publicada en nuestros canales oficiales y se considerará aceptada por los usuarios desde la primera interacción con dichos canales tras su publicación.
          </p>
        </section>

        {/* Capítulo IX */}
        <section className="mb-12">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo IX – Aceptación
          </h2>
          <p className="text-zinc-700 leading-relaxed">
            Al proporcionar tus datos, registrarte y/o asistir a eventos de Synergy, declaras haber leído, entendido y aceptado esta Política de Privacidad y Protección de Datos Personales en su integridad.
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
