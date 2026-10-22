'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { salirDirectorio } from '@/app/actions/directorio'
import { coincide } from '@/lib/directorio/presentar'
import type { TarjetaDirectorio } from '@/lib/directorio/tipos'

export function RejillaDirectorio({
  tarjetas,
  titulo,
  aviso,
  sectores,
}: {
  tarjetas: TarjetaDirectorio[]
  titulo: string
  aviso: string
  sectores: string[]
}) {
  const [consulta, setConsulta] = useState('')
  const [sector, setSector] = useState('todos')

  const visibles = useMemo(
    () => tarjetas.filter((tarjeta) => coincide(tarjeta, consulta, sector)),
    [tarjetas, consulta, sector]
  )

  const filtrando = consulta.trim().length > 0 || sector !== 'todos'

  return (
    <main className="directorio-lista">
      <header className="directorio-lista__cabecera">
        <div className="directorio-lista__marca">
          <Image
            src="/brand/logo-synergy.svg"
            alt="Synergy"
            width={48}
            height={48}
            priority
            unoptimized
          />
          <form action={salirDirectorio}>
            <button type="submit" className="directorio-lista__salir">
              Salir
            </button>
          </form>
        </div>
        <h1 className="directorio-lista__titulo">{titulo}</h1>
        <p className="directorio-lista__aviso">{aviso}</p>
      </header>

      <div className="directorio-lista__herramientas">
        <label htmlFor="buscar-directorio" className="directorio-sr">
          Buscar
        </label>
        <input
          id="buscar-directorio"
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Nombre o empresa"
          className="directorio-lista__buscar"
          autoComplete="off"
        />
        <div className="directorio-lista__sectores" role="group" aria-label="Sector">
          <button
            type="button"
            className={sector === 'todos' ? 'esta-activo' : undefined}
            aria-pressed={sector === 'todos'}
            onClick={() => setSector('todos')}
          >
            Todos
          </button>
          {sectores.map((nombre) => (
            <button
              key={nombre}
              type="button"
              className={sector === nombre ? 'esta-activo' : undefined}
              aria-pressed={sector === nombre}
              onClick={() => setSector(nombre)}
            >
              {nombre}
            </button>
          ))}
        </div>
        {filtrando && visibles.length > 0 ? (
          <p className="directorio-lista__conteo" aria-live="polite">
            {visibles.length === 1
              ? `1 de ${tarjetas.length} personas`
              : `${visibles.length} de ${tarjetas.length} personas`}
          </p>
        ) : null}
      </div>

      {visibles.length === 0 ? (
        <p className="directorio-lista__vacio" role="status">
          {tarjetas.length === 0
            ? 'En este momento no hay personas visibles en el directorio.'
            : 'Nadie coincide con esa búsqueda.'}
        </p>
      ) : (
        <ul className="directorio-rejilla">
          {visibles.map((tarjeta) => (
            <li key={tarjeta.id}>
              <article className={`tarjeta tarjeta--${tarjeta.tono} tarjeta--${tarjeta.tamano}`}>
                <div className="tarjeta__cabeza">
                  <span className="tarjeta__iniciales" aria-hidden="true">
                    {tarjeta.iniciales}
                  </span>
                  <div>
                    <h2 className="tarjeta__nombre">{`${tarjeta.nombre} ${tarjeta.apellido}`}</h2>
                    <p className="tarjeta__empresa">{tarjeta.empresa}</p>
                    {tarjeta.sector ? <p className="tarjeta__sector">{tarjeta.sector}</p> : null}
                  </div>
                </div>
                {tarjeta.soluciones ? (
                  <div className="tarjeta__bloque">
                    <h3>Qué soluciona</h3>
                    <p>{tarjeta.soluciones}</p>
                  </div>
                ) : null}
                {tarjeta.desafios ? (
                  <div className="tarjeta__bloque">
                    <h3>Desafío</h3>
                    <p>{tarjeta.desafios}</p>
                  </div>
                ) : null}
                <div className="tarjeta__datos">
                  <p>{tarjeta.telefonoVisible}</p>
                  {tarjeta.correo ? <p>{tarjeta.correo}</p> : null}
                </div>
                <div className="tarjeta__acciones">
                  {tarjeta.whatsapp ? (
                    <a href={tarjeta.whatsapp} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  ) : null}
                  {tarjeta.correoHref ? <a href={tarjeta.correoHref}>Correo</a> : null}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
