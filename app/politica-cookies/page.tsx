'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
      <Navbar />
      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <Link href="/inicio" className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-black transition-colors mb-8">
          ← Volver al inicio
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold mb-12 text-center">
          Política de cookies – Synergy
        </h1>

        {/* Capítulo I */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo I – ¿Qué son las cookies?
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del usuario (computador, tablet, smartphone u otros) cuando visita un sitio web.
              Su función principal es reconocer el dispositivo, recordar información de navegación y mejorar la experiencia del usuario.
            </p>
            <p>
              Synergy utiliza cookies y tecnologías similares (como píxeles, etiquetas y scripts) para garantizar el correcto funcionamiento de su sitio web y optimizar la interacción con los usuarios.
            </p>
          </div>
        </section>

        {/* Capítulo II */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo II – Alcance de la política
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>La presente Política de Cookies aplica a:</p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>El sitio web oficial de Synergy.</li>
              <li>Landing pages, formularios y plataformas digitales asociadas.</li>
              <li>Herramientas de registro, análisis y comunicación digital.</li>
            </ul>
            <p>
              Al navegar por nuestros sitios, el usuario acepta el uso de cookies conforme a esta política, salvo que haya configurado su navegador para rechazarlas.
            </p>
          </div>
        </section>

        {/* Capítulo III */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo III – Tipos de cookies utilizadas
          </h2>
          <div className="space-y-6 text-zinc-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">1. Cookies estrictamente necesarias</h3>
              <p className="mb-4">
                Son esenciales para el funcionamiento del sitio web y no pueden ser desactivadas desde nuestros sistemas.
              </p>
              <p className="mb-2">Permiten:</p>
              <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
                <li>Acceso seguro a secciones del sitio.</li>
                <li>Funcionamiento de formularios y procesos de registro.</li>
                <li>Gestión básica de sesiones de usuario.</li>
              </ul>
              <p>Sin estas cookies, el sitio no puede operar correctamente.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">2. Cookies de rendimiento y analítica</h3>
              <p className="mb-2">Estas cookies nos permiten:</p>
              <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
                <li>Medir tráfico y comportamiento de los usuarios.</li>
                <li>Analizar qué secciones son más visitadas.</li>
                <li>Identificar errores técnicos y oportunidades de mejora.</li>
              </ul>
              <p>
                La información recopilada es agregada y anónima, y se utiliza exclusivamente con fines estadísticos y de optimización de la experiencia.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">3. Cookies de funcionalidad</h3>
              <p className="mb-2">Permiten recordar:</p>
              <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
                <li>Preferencias del usuario.</li>
                <li>Idioma.</li>
                <li>Región o configuración básica.</li>
              </ul>
              <p>
                Gracias a estas cookies, la experiencia es más personalizada y eficiente.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#1a1a1a] mb-2">4. Cookies de publicidad y marketing</h3>
              <p className="mb-2">Estas cookies se utilizan para:</p>
              <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
                <li>Mostrar anuncios relevantes.</li>
                <li>Medir la efectividad de campañas promocionales.</li>
                <li>Limitar la frecuencia con la que se muestra un anuncio.</li>
              </ul>
              <p>
                Pueden ser propias o de terceros y se basan en patrones de navegación, no en datos sensibles.
              </p>
            </div>
          </div>
        </section>

        {/* Capítulo IV */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo IV – Cookies de terceros
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Synergy puede utilizar servicios de terceros que instalan cookies en nombre nuestro para cumplir funciones específicas, como:
            </p>
            <ul className="space-y-1 list-disc list-inside pl-2">
              <li>Analítica web.</li>
              <li>Automatización de marketing.</li>
              <li>Formularios y seguimiento de campañas.</li>
            </ul>
            <p>
              Estos terceros gestionan sus cookies conforme a sus propias políticas de privacidad y cookies. Synergy no controla directamente estas cookies, pero selecciona proveedores que cumplen estándares razonables de protección de datos.
            </p>
          </div>
        </section>

        {/* Capítulo V */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo V – Gestión y desactivación de cookies
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>El usuario puede:</p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>Aceptar o rechazar cookies.</li>
              <li>Eliminar cookies almacenadas.</li>
              <li>Configurar su navegador para bloquear cookies total o parcialmente.</li>
            </ul>
            <p>La desactivación de cookies puede afectar:</p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>El correcto funcionamiento del sitio.</li>
              <li>La disponibilidad de algunas funcionalidades.</li>
              <li>La experiencia de usuario.</li>
            </ul>
            <p>
              Cada navegador ofrece opciones específicas para la gestión de cookies, las cuales deben configurarse directamente por el usuario.
            </p>
          </div>
        </section>

        {/* Capítulo VI */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VI – Actualizaciones de la política
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Synergy se reserva el derecho de modificar esta Política de Cookies en cualquier momento, con el fin de:
            </p>
            <ul className="space-y-1 list-disc list-inside pl-2 mb-4">
              <li>Adaptarse a cambios legales o regulatorios.</li>
              <li>Incorporar nuevas tecnologías.</li>
              <li>Mejorar la transparencia con los usuarios.</li>
            </ul>
            <p>
              Cualquier actualización será publicada en nuestros canales digitales y entrará en vigor desde su publicación.
            </p>
          </div>
        </section>

        {/* Capítulo VII */}
        <section className="mb-10">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VII – Relación con otras políticas
          </h2>
          <div className="space-y-4 text-zinc-700 leading-relaxed">
            <p>
              Esta Política de Cookies debe leerse de manera conjunta con:
            </p>
            <ul className="space-y-2 list-none pl-0">
              <li>
                <Link href="/politica-privacidad" className="text-[#1a1a1a] hover:underline font-medium">
                  La Política de Privacidad y Protección de Datos Personales
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-[#1a1a1a] hover:underline font-medium">
                  Los Términos y Condiciones de Uso
                </Link>
              </li>
            </ul>
            <p>
              En caso de contradicción, prevalecerá lo dispuesto en dichas políticas conforme a su naturaleza.
            </p>
          </div>
        </section>

        {/* Capítulo VIII */}
        <section className="mb-12">
          <h2 className="text-lg font-bold uppercase tracking-wide text-[#1a1a1a] mb-4">
            Capítulo VIII – Aceptación
          </h2>
          <p className="text-zinc-700 leading-relaxed">
            Al continuar navegando en el sitio web de Synergy, el usuario declara haber leído, comprendido y aceptado el uso de cookies conforme a lo establecido en esta Política.
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
