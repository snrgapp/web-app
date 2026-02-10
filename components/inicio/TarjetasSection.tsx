'use client'

import Image from 'next/image'

const FORMATOS = [
  {
    src: '/images/formatos/founderhouse-barranquilla.png',
    alt: 'FounderHouse Barranquilla',
    href: 'https://www.linkedin.com/company/founder-house-in-barranquilla',
  },
  {
    src: '/images/formatos/synergy.png',
    alt: 'Synergy',
    href: 'https://www.linkedin.com/company/synergy-founders-makers',
  },
  {
    src: '/images/formatos/spotlight.png',
    alt: 'Spotlight',
    href: 'https://www.linkedin.com/company/spotlight-latam',
  },
]

export default function TarjetasSection() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-[#f2f2f2]">
      <div className="max-w-6xl mx-auto mb-6 text-center">
        <h2 className="text-xl font-light text-[#1a1a1a] lowercase">
          nuestros formatos.
        </h2>
      </div>
      <div className="max-w-6xl mx-auto flex flex-row justify-center items-center gap-4 sm:gap-6">
        {FORMATOS.map((formato) => (
          <a
            key={formato.alt}
            href={formato.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-[100px] h-[100px] sm:w-[250px] sm:h-[250px] rounded-[1.5rem] overflow-hidden border border-black/5 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2"
            aria-label={`${formato.alt} en LinkedIn`}
          >
            <Image
              src={formato.src}
              alt={formato.alt}
              width={250}
              height={250}
              className="w-full h-full object-cover"
              sizes="(max-width: 640px) 100px, 250px"
            />
          </a>
        ))}
      </div>
    </section>
  )
}
