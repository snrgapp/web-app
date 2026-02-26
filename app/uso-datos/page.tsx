'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function UsoDatosPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Link href="/inicio" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-black transition-colors mb-8">
          ← Volver al inicio
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
          Política de uso de datos y gestión de comunidades – Synergy
        </h1>

        {/* Capítulo I */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo I – Objetivo de la política
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              La presente Política de Uso de Datos y Gestión de Comunidades establece los criterios bajo los cuales Synergy recopila, analiza y utiliza la información generada por la interacción de los miembros dentro de su ecosistema comunitario.
            </p>
            <p>
              El objetivo principal es optimizar la experiencia de los emprendedores, fortalecer la calidad de las reuniones y eventos, y desarrollar inteligencia colectiva que permita la evolución estratégica de la comunidad.
            </p>
            <p>
              Esta política no reemplaza la{' '}
              <Link href="/politica-privacidad" className="text-[#1a1a1a] hover:underline font-medium">
                Política de Privacidad
              </Link>
              , sino que la complementa desde una perspectiva analítica y operativa.
            </p>
          </div>
        </section>

        {/* Capítulo II */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo II – Naturaleza de los datos utilizados
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Synergy utiliza datos provenientes de la actividad comunitaria, los cuales pueden incluir, sin limitarse a:
            </p>
            <div className="space-y-6 pl-0">
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">1. Datos de participación</h3>
                <ul className="space-y-1 list-disc list-inside pl-2">
                  <li>Asistencia a reuniones y eventos.</li>
                  <li>Frecuencia de interacción.</li>
                  <li>Participación en dinámicas comunitarias.</li>
                  <li>Intereses temáticos y áreas de negocio.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">2. Datos de comportamiento</h3>
                <ul className="space-y-1 list-disc list-inside pl-2">
                  <li>Patrones de navegación en plataformas digitales.</li>
                  <li>Interacción con contenidos, comunicaciones y registros.</li>
                  <li>Preferencias generales (no sensibles).</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a1a] mb-2">3. Datos agregados de comunidad</h3>
                <ul className="space-y-1 list-disc list-inside pl-2">
                  <li>Métricas de crecimiento.</li>
                  <li>Niveles de engagement.</li>
                  <li>Tendencias sectoriales y perfiles profesionales.</li>
                </ul>
              </div>
            </div>
            <p>
              Estos datos no se utilizan para vigilancia individual, sino para análisis estratégico y toma de decisiones comunitarias.
            </p>
          </div>
        </section>

        {/* Capítulo III */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo III – Finalidad del uso de datos
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Los datos recolectados y analizados por Synergy se utilizan con las siguientes finalidades estratégicas:
            </p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>Diseñar mejores experiencias de networking.</li>
              <li>Optimizar formatos, horarios y contenidos de reuniones.</li>
              <li>Identificar oportunidades de conexión entre miembros.</li>
              <li>Medir el impacto real de los eventos.</li>
              <li>Detectar patrones de valor dentro de la comunidad.</li>
              <li>Mejorar procesos internos y toma de decisiones.</li>
              <li>Crear productos, servicios o programas basados en necesidades reales.</li>
            </ul>
            <p>
              No utilizamos los datos para fines especulativos, invasivos ni contrarios a los intereses de la comunidad.
            </p>
          </div>
        </section>

        {/* Capítulo IV */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo IV – Inteligencia colectiva y anonimización
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>Synergy prioriza el uso de:</p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>Datos agregados.</li>
              <li>Información anonimizada.</li>
              <li>Métricas estadísticas.</li>
            </ul>
            <p>Esto permite:</p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>Extraer aprendizajes colectivos.</li>
              <li>Generar reportes estratégicos.</li>
              <li>Tomar decisiones basadas en evidencia.</li>
            </ul>
            <p>
              La identidad individual de los miembros no es revelada en análisis públicos ni informes externos, salvo autorización expresa o requerimiento legal.
            </p>
          </div>
        </section>

        {/* Capítulo V */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo V – Comunidad, contenido y aprendizaje compartido
          </h2>
          <div className="space-y-6 text-zinc-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">1. Información compartida en comunidad</h3>
              <p className="mb-2">Los miembros reconocen que:</p>
              <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
                <li>La información compartida durante reuniones, eventos o espacios comunitarios puede generar aprendizajes colectivos.</li>
                <li>Synergy puede utilizar dichos aprendizajes de forma estructurada para mejorar la comunidad.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">2. Responsabilidad individual</h3>
              <p>
                Cada miembro es responsable del tipo de información que decide compartir.
                Synergy no se responsabiliza por acuerdos, promesas o negociaciones privadas entre miembros.
              </p>
            </div>
          </div>
        </section>

        {/* Capítulo VI */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VI – Uso de datos para crecimiento y escalabilidad
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>Synergy podrá utilizar los datos generados para:</p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>Escalar la comunidad a nuevas ciudades o países.</li>
              <li>Diseñar nuevos formatos de eventos.</li>
              <li>Crear programas avanzados, mentorías o productos digitales.</li>
              <li>Desarrollar alianzas estratégicas basadas en métricas reales.</li>
            </ul>
            <p>
              Este uso se realizará siempre respetando la privacidad y los principios de transparencia.
            </p>
          </div>
        </section>

        {/* Capítulo VII */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VII – Límites y ética en el uso de datos
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>Synergy establece límites claros:</p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>No vende datos personales identificables.</li>
              <li>No comercializa bases de datos individuales.</li>
              <li>No utiliza información para manipulación, presión comercial o prácticas engañosas.</li>
              <li>No permite el uso de datos comunitarios para fines ajenos al propósito del ecosistema.</li>
            </ul>
            <p>
              El uso de datos se rige por principios de ética, utilidad y beneficio mutuo.
            </p>
          </div>
        </section>

        {/* Capítulo VIII */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VIII – Acceso interno y seguridad
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>El acceso a datos comunitarios está restringido a:</p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>Personal autorizado.</li>
              <li>Herramientas tecnológicas seguras.</li>
              <li>Proveedores bajo acuerdos de confidencialidad.</li>
            </ul>
            <p>
              Se implementan medidas técnicas y organizativas para prevenir accesos no autorizados, filtraciones o usos indebidos.
            </p>
          </div>
        </section>

        {/* Capítulo IX */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo IX – Evolución de la comunidad
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              La comunidad Synergy es un ecosistema vivo.
              El uso de datos permite:
            </p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>Evolucionar sin perder el foco.</li>
              <li>Tomar decisiones basadas en evidencia.</li>
              <li>Priorizar valor real sobre volumen.</li>
            </ul>
            <p>
              Los miembros aceptan que la comunidad puede cambiar, adaptarse y mejorar en función del análisis continuo de datos.
            </p>
          </div>
        </section>

        {/* Capítulo X */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo X – Modificaciones a la política
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Synergy se reserva el derecho de modificar esta política para adaptarla a:
            </p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>Cambios regulatorios.</li>
              <li>Nuevas tecnologías.</li>
              <li>Nuevas dinámicas comunitarias.</li>
            </ul>
            <p>
              Las modificaciones serán publicadas en los canales oficiales y se entenderán aceptadas al continuar participando en la comunidad.
            </p>
          </div>
        </section>

        {/* Capítulo XI */}
        <section className="mb-12">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo XI – Aceptación
          </h2>
          <p className="text-zinc-700 leading-relaxed">
            Al registrarse, participar en eventos o interactuar con la comunidad Synergy, el miembro declara haber leído, entendido y aceptado esta Política de Uso de Datos y Gestión de Comunidades.
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
