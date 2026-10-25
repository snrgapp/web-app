'use client'

import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Clock, MessageCircle } from 'lucide-react'
import { MAX_ARCHIVO_MB, opcionesCampo, type CampoEvento } from '@/lib/registro-evento'

type Resultado = { estado: 'confirmado' | 'pago_pendiente' | 'lista_espera' | 'ya_inscrito'; nombre: string; correo: string }

const INPUT =
  'w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-[#1a1a1a] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#FFE100] focus:border-transparent'

function linkWhatsApp(numero: string, texto: string) {
  const digitos = numero.replace(/\D/g, '')
  return `https://wa.me/${digitos.length === 10 ? `57${digitos}` : digitos}?text=${encodeURIComponent(texto)}`
}

function Campo({ campo, error }: { campo: CampoEvento; error?: string }) {
  const nombre = `campo_${campo.id}`
  const requerido = Boolean(campo.obligatorio)
  const opciones = opcionesCampo(campo)
  let control: React.ReactNode

  if (campo.tipo === 'parrafo') {
    control = <textarea name={nombre} required={requerido} rows={3} maxLength={2000} className={INPUT} />
  } else if (campo.tipo === 'si_no') {
    control = (
      <div className="flex gap-3">
        {['si', 'no'].map((v) => (
          <label key={v} className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm cursor-pointer has-[:checked]:border-[#1a1a1a]">
            <input type="radio" name={nombre} value={v} required={requerido} className="accent-[#1a1a1a]" />
            {v === 'si' ? 'Sí' : 'No'}
          </label>
        ))}
      </div>
    )
  } else if (campo.tipo === 'unica' || campo.tipo === 'multiple') {
    const multiple = campo.tipo === 'multiple'
    control = (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {opciones.map((o) => (
          <label key={o} className="flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm cursor-pointer has-[:checked]:border-[#1a1a1a]">
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={nombre}
              value={o}
              required={requerido && !multiple}
              className="accent-[#1a1a1a]"
            />
            {o}
          </label>
        ))}
      </div>
    )
  } else if (campo.tipo === 'archivo') {
    control = (
      <input
        type="file"
        name={nombre}
        required={requerido}
        accept="application/pdf,image/png,image/jpeg,image/webp"
        className="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-[#1a1a1a] hover:file:bg-zinc-200"
      />
    )
  } else {
    const tipo = { telefono: 'tel', url: 'url', numero: 'number', email: 'email' }[campo.tipo] ?? 'text'
    control = <input type={tipo} name={nombre} required={requerido} maxLength={500} className={INPUT} />
  }

  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-[#1a1a1a]">
        {campo.label}
        {requerido && <span className="text-red-500"> *</span>}
      </span>
      {control}
      {campo.tipo === 'archivo' && <p className="text-xs text-zinc-500">PDF o imagen, máximo {MAX_ARCHIVO_MB} MB.</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default function RegistroEvento({
  slug,
  titulo,
  campos,
  whatsappPagos,
}: {
  slug: string
  titulo: string
  campos: CampoEvento[]
  whatsappPagos: string | null
}) {
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [resultado, setResultado] = useState<Resultado | null>(null)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    datos.set('evento', slug)
    setEnviando(true)
    setMensaje(null)
    setErrores({})
    try {
      const r = await fetch('/api/evento/registro', { method: 'POST', body: datos })
      const j = await r.json()
      if (!j.ok) {
        setMensaje(j.mensaje ?? 'No pudimos registrar tu inscripción')
        setErrores(j.errores ?? {})
        return
      }
      setResultado({ estado: j.estado, nombre: String(datos.get('nombre')).split(' ')[0], correo: String(datos.get('correo')) })
    } catch {
      setMensaje('Sin conexión. Revisa tu internet e intenta de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  if (resultado) {
    const pago = resultado.estado === 'pago_pendiente'
    const espera = resultado.estado === 'lista_espera'
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          {espera ? <Clock className="w-6 h-6 text-zinc-500 shrink-0" /> : <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />}
          <div className="space-y-1">
            <p className="font-semibold text-[#1a1a1a]">
              {resultado.estado === 'ya_inscrito'
                ? 'Ya estabas inscrito'
                : espera
                  ? `Quedaste en lista de espera, ${resultado.nombre}`
                  : pago
                    ? `¡Cupo reservado, ${resultado.nombre}!`
                    : `¡Listo, ${resultado.nombre}! Tu cupo está confirmado`}
            </p>
            <p className="text-sm text-zinc-600">
              {resultado.estado === 'ya_inscrito'
                ? 'Encontramos una inscripción con este correo o celular para este evento.'
                : espera
                  ? 'Los cupos están llenos. Te escribiremos si se libera uno.'
                  : pago
                    ? 'Tu inscripción se confirma cuando recibamos el pago. Te enviaremos la confirmación por correo.'
                    : `Te escribiremos a ${resultado.correo} con los detalles del evento.`}
            </p>
          </div>
        </div>
        {pago && whatsappPagos && (
          <a
            href={linkWhatsApp(whatsappPagos, `Hola, me inscribí a ${titulo} y quiero pagar mi entrada. Mi correo es ${resultado.correo}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-black/90 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Coordinar pago por WhatsApp
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="block space-y-1.5">
        <span className="block text-sm font-medium text-[#1a1a1a]">Nombre completo<span className="text-red-500"> *</span></span>
        <input name="nombre" required autoComplete="name" className={INPUT} />
        {errores.nombre && <p className="text-xs text-red-600">{errores.nombre}</p>}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block space-y-1.5">
          <span className="block text-sm font-medium text-[#1a1a1a]">Correo<span className="text-red-500"> *</span></span>
          <input name="correo" type="email" required autoComplete="email" className={INPUT} />
          {errores.correo && <p className="text-xs text-red-600">{errores.correo}</p>}
        </label>
        <label className="block space-y-1.5">
          <span className="block text-sm font-medium text-[#1a1a1a]">Celular<span className="text-red-500"> *</span></span>
          <input name="telefono" type="tel" required autoComplete="tel" placeholder="300 123 4567" className={INPUT} />
          {errores.telefono && <p className="text-xs text-red-600">{errores.telefono}</p>}
        </label>
      </div>
      {campos.map((c) => (
        <Campo key={c.id} campo={c} error={errores[`campo_${c.id}`]} />
      ))}
      {mensaje && <p className="text-sm text-red-600">{mensaje}</p>}
      <button
        type="submit"
        disabled={enviando}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl font-medium hover:bg-black/90 transition-colors disabled:opacity-60"
      >
        {enviando ? 'Enviando…' : 'Inscribirme'}
        {!enviando && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  )
}
