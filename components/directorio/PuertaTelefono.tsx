'use client'

import Image from 'next/image'
import { useFormState, useFormStatus } from 'react-dom'
import { useState } from 'react'
import { ingresarDirectorio } from '@/app/actions/directorio'
import { normalizarCelularColombia } from '@/lib/directorio/telefono'

function BotonEntrar({ listo }: { listo: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="directorio-puerta__enviar" disabled={!listo || pending}>
      {pending ? 'Revisando…' : 'Entrar'}
    </button>
  )
}

export function PuertaTelefono({ mensaje }: { mensaje?: string }) {
  const [estado, accion] = useFormState(ingresarDirectorio, null)
  const [digitos, setDigitos] = useState('')
  const listo = normalizarCelularColombia(digitos) !== null
  const error = estado?.error || mensaje

  function alEscribir(valor: string) {
    let solo = valor.replace(/\D/g, '')
    if (solo.startsWith('57') && solo.length > 10) solo = solo.slice(2)
    setDigitos(solo.slice(0, 10))
  }

  const visible = [digitos.slice(0, 3), digitos.slice(3, 6), digitos.slice(6, 10)]
    .filter(Boolean)
    .join(' ')

  return (
    <main className="directorio-puerta">
      <Image
        src="/brand/logo-synergy.svg"
        alt="Synergy"
        width={56}
        height={56}
        priority
        unoptimized
        className="directorio-puerta__logo"
      />
      <div className="directorio-puerta__copia">
        <h1 className="directorio-puerta__titulo">Quiénes estuvieron</h1>
        <p className="directorio-puerta__texto">
          Entra con tu celular para ver a las personas del encuentro del 20 de octubre.
        </p>
      </div>
      <form action={accion} className="directorio-puerta__form" noValidate>
        <label htmlFor="celular" className="directorio-puerta__etiqueta">
          Celular
        </label>
        <div className="directorio-puerta__campo">
          <span className="directorio-puerta__prefijo" aria-hidden="true">
            +57
          </span>
          <input
            id="celular"
            name="celular"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            autoFocus
            spellCheck={false}
            placeholder="300 123 4567"
            value={visible}
            onChange={(e) => alEscribir(e.target.value)}
            aria-describedby="celular-ayuda"
            className="directorio-puerta__input"
          />
        </div>
        <p id="celular-ayuda" className="directorio-puerta__ayuda">
          El +57 ya está puesto. Escribe los 10 dígitos, empezando por 3.
        </p>
        {error ? (
          <p className="directorio-puerta__error" role="alert">
            {error}
          </p>
        ) : null}
        <BotonEntrar listo={listo} />
      </form>
    </main>
  )
}
