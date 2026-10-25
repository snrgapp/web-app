'use client'

import { useState, type FormEvent } from 'react'
import { BookmarkCheck, CheckCircle2, Clock, Coffee, Headset, Loader2, MessageCircle } from 'lucide-react'
import { MAX_ARCHIVO_MB, opcionesCampo, type CampoEvento } from '@/lib/registro-evento'

type Resultado = { estado: 'confirmado' | 'pago_pendiente' | 'lista_espera' | 'ya_inscrito'; nombre: string; correo: string }

const INPUT =
  'w-full h-11 px-3.5 rounded-lg bg-[#f4f2fd] text-[#1a1b22] text-[15px] leading-[22px] placeholder:text-[#77767b] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#4648d4]/25 shadow-sm transition-all'
const LABEL = 'text-[11px] leading-[14px] tracking-[0.04em] font-semibold text-[#1a1b22]'
const CHIP =
  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f4f2fd] text-[#1a1b22] text-[11px] leading-[14px] tracking-[0.04em] font-semibold cursor-pointer hover:bg-[#eeedf7] has-[:checked]:bg-[#e1e0ff] transition-colors'

const cop = (n: number) => '$' + Math.round(n).toLocaleString('es-CO')

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
    control = <textarea name={nombre} required={requerido} rows={3} maxLength={2000} className={`${INPUT} h-auto py-3`} />
  } else if (campo.tipo === 'unica') {
    control = (
      <select name={nombre} required={requerido} defaultValue="" className={`${INPUT} px-3 appearance-none cursor-pointer`}>
        <option value="" disabled>
          Selecciona una opción
        </option>
        {opciones.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    )
  } else if (campo.tipo === 'multiple' || campo.tipo === 'si_no') {
    const multiple = campo.tipo === 'multiple'
    const valores = multiple ? opciones.map((o) => [o, o]) : [['si', 'Sí'], ['no', 'No']]
    control = (
      <div className="flex flex-wrap gap-2">
        {valores.map(([valor, texto]) => (
          <label key={valor} className={CHIP}>
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={nombre}
              value={valor}
              required={requerido && !multiple}
              className="accent-[#4648d4] w-3.5 h-3.5 rounded"
            />
            {texto}
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
        className="block w-full text-[13px] text-[#46464b] file:mr-3 file:h-9 file:rounded-lg file:border-0 file:bg-[#f4f2fd] file:px-3.5 file:text-[13px] file:font-semibold file:text-[#1a1b22] hover:file:bg-[#eeedf7]"
      />
    )
  } else {
    const tipo = { telefono: 'tel', url: 'url', numero: 'number', email: 'email' }[campo.tipo] ?? 'text'
    control = <input type={tipo} name={nombre} required={requerido} maxLength={500} className={INPUT} />
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className={LABEL}>
        {campo.label}
        {requerido && ' *'}
      </span>
      {control}
      {campo.tipo === 'archivo' && <p className="text-[13px] leading-[18px] text-[#46464b]">PDF o imagen, máximo {MAX_ARCHIVO_MB} MB.</p>}
      {error && <p className="text-[13px] leading-[18px] text-[#ba1a1a]">{error}</p>}
    </div>
  )
}

export default function RegistroEvento({
  slug,
  titulo,
  campos,
  whatsappPagos,
  precio,
  incluye,
}: {
  slug: string
  titulo: string
  campos: CampoEvento[]
  whatsappPagos: string | null
  precio: number
  incluye?: string | null
}) {
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState(false)
  const campoNombre = campos.find((c) => c.tipo === 'nombre')
  const preguntas = campos.filter((c) => c.tipo !== 'nombre')
  const [mensaje, setMensaje] = useState<string | null>(null)
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const pagaPorWhatsApp = precio > 0 && Boolean(whatsappPagos)
  const mensajePago = (r: Resultado) =>
    linkWhatsApp(whatsappPagos ?? '', `Hola, me inscribí a ${titulo} y quiero coordinar el pago de mi entrada. Mi correo es ${r.correo}.`)

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
      const res: Resultado = { estado: j.estado, nombre: String(datos.get('nombre')).split(' ')[0], correo: String(datos.get('correo')) }
      setResultado(res)
      setAviso(res.estado !== 'ya_inscrito')
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
      <div className="flex flex-col gap-4">
        {aviso && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setAviso(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl flex flex-col items-center gap-5 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="w-16 h-16 rounded-full bg-[#009668]/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#009668]" />
              </span>
              <p className="text-[16px] leading-[24px] text-[#1a1b22]">
                {espera
                  ? 'Hemos registrado tu información. Los cupos están llenos y quedaste en lista de espera. Te contactaremos si se libera uno. ¡Hasta pronto!'
                  : 'Hemos registrado tu información, dentro de poco un miembro del equipo te contactará para validar tu información y ayudarte con el pago. ¡Hasta pronto!'}
              </p>
              <div className="w-full flex flex-col gap-2.5">
                {pago && pagaPorWhatsApp && (
                  <a
                    href={mensajePago(resultado)}
                    className="w-full h-12 rounded-xl bg-[#25D366] hover:opacity-90 text-white text-[16px] font-semibold flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Escribir ahora por WhatsApp
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setAviso(false)}
                  className="w-full h-12 rounded-xl bg-black hover:bg-[#1a1b21] text-white text-[16px] font-semibold active:scale-[0.98] transition-all"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="p-4 rounded-xl bg-[#f4f2fd] flex items-start gap-3">
          {espera ? <Clock className="w-6 h-6 text-[#46464b] shrink-0" /> : <CheckCircle2 className="w-6 h-6 text-[#009668] shrink-0" />}
          <div className="flex flex-col gap-1">
            <p className="text-[20px] leading-[28px] tracking-[-0.01em] font-semibold text-[#1a1b22]">
              {resultado.estado === 'ya_inscrito'
                ? 'Ya estabas inscrito'
                : espera
                  ? `Quedaste en lista de espera, ${resultado.nombre}`
                  : pago
                    ? `¡Cupo reservado, ${resultado.nombre}!`
                    : `¡Listo, ${resultado.nombre}! Tu cupo está confirmado`}
            </p>
            <p className="text-[13px] leading-[18px] text-[#46464b]">
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
        {pago && pagaPorWhatsApp && (
          <a
            href={mensajePago(resultado)}
            className="w-full h-12 rounded-xl bg-[#25D366] hover:opacity-90 text-white text-[17px] font-semibold flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Coordinar pago por WhatsApp
          </a>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-6">
      <input type="text" name="sitio_web" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="flex flex-col gap-3.5">
        <span className="text-[11px] leading-[14px] tracking-[0.04em] font-semibold uppercase text-[#46464b]">1. Datos del asistente</span>
        {campoNombre ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Nombre *</span>
              <input name="nombre" required autoComplete="given-name" placeholder="Ej. Sofía" className={INPUT} />
              {errores.nombre && <span className="text-[13px] text-[#ba1a1a]">{errores.nombre}</span>}
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Apellido{campoNombre.obligatorio && ' *'}</span>
              <input
                name="apellido"
                required={Boolean(campoNombre.obligatorio)}
                autoComplete="family-name"
                placeholder="Ej. Hernández"
                className={INPUT}
              />
              {errores.apellido && <span className="text-[13px] text-[#ba1a1a]">{errores.apellido}</span>}
            </label>
          </div>
        ) : (
          <label className="flex flex-col gap-1.5">
            <span className={LABEL}>Nombre completo *</span>
            <input name="nombre" required autoComplete="name" placeholder="Ej. Sofía Hernández" className={INPUT} />
            {errores.nombre && <span className="text-[13px] text-[#ba1a1a]">{errores.nombre}</span>}
          </label>
        )}
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Correo *</span>
          <input name="correo" type="email" required autoComplete="email" placeholder="sofia@tuempresa.com" className={INPUT} />
          {errores.correo && <span className="text-[13px] text-[#ba1a1a]">{errores.correo}</span>}
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL}>Celular *</span>
          <input name="telefono" type="tel" required autoComplete="tel" placeholder="300 123 4567" className={INPUT} />
          {errores.telefono && <span className="text-[13px] text-[#ba1a1a]">{errores.telefono}</span>}
        </label>
        {preguntas.map((c) => (
          <Campo key={c.id} campo={c} error={errores[`campo_${c.id}`]} />
        ))}
      </div>

      <div className="p-4 rounded-xl bg-[#f4f2fd] flex flex-col gap-2.5">
        <div className="flex justify-between items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[20px] leading-[28px] tracking-[-0.01em] font-semibold text-[#1a1b22]">Valor:</span>
            <span className="text-[13px] leading-[18px] text-[#46464b]">Entrada general</span>
          </div>
          <span className="text-[28px] leading-tight font-bold text-[#4648d4]">{precio > 0 ? cop(precio) : 'Gratis'}</span>
        </div>
        {incluye && (
          <div className="pt-2 border-t border-[#e3e1ec]/60 flex items-center gap-2">
            <Coffee className="w-[18px] h-[18px] text-[#4648d4] shrink-0" />
            <span className="text-[11px] leading-[14px] tracking-[0.04em] font-semibold text-[#46464b]">{incluye}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-[#46464b] text-[11px] leading-[14px] tracking-[0.04em] font-semibold">
        <span className="flex items-center gap-1.5">
          <Headset className="w-4 h-4 text-[#009668]" />
          Atención directa en &lt; 5 min
        </span>
        <span className="flex items-center gap-1.5">
          <BookmarkCheck className="w-4 h-4 text-[#4648d4]" />
          Reserva de cupo garantizada
        </span>
      </div>

      <label className="flex items-start gap-2.5 px-1 cursor-pointer text-[13px] leading-tight text-[#46464b]">
        <input type="checkbox" required className="accent-[#4648d4] w-4 h-4 rounded mt-0.5 cursor-pointer shrink-0" />
        <span>
          Acepto los{' '}
          <a href="/terminos" target="_blank" className="underline text-[#1a1b22] hover:text-[#4648d4] font-medium">
            Términos y Condiciones
          </a>{' '}
          del evento y la{' '}
          <a href="/politica-privacidad" target="_blank" className="underline text-[#1a1b22] hover:text-[#4648d4] font-medium">
            Política de Privacidad
          </a>{' '}
          de datos.
        </span>
      </label>

      {pagaPorWhatsApp && (
        <div className="p-3.5 rounded-xl bg-[#f4f2fd] border border-[#e3e1ec]/50 flex items-start gap-3">
          <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
          <p className="text-[13px] leading-snug text-[#46464b]">
            Tu registro quedará completado y un miembro del equipo te atenderá por WhatsApp para coordinar tu método de pago.
          </p>
        </div>
      )}

      {mensaje && <p className="text-[13px] text-[#ba1a1a]">{mensaje}</p>}

      <button
        type="submit"
        disabled={enviando}
        className={`w-full h-12 rounded-xl text-white text-[17px] font-semibold flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.98] transition-all disabled:opacity-60 ${
          pagaPorWhatsApp ? 'bg-[#25D366] hover:opacity-90' : 'bg-black hover:bg-[#1a1b21]'
        }`}
      >
        {enviando ? <Loader2 className="w-5 h-5 animate-spin" /> : pagaPorWhatsApp ? <MessageCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
        {enviando ? 'Procesando…' : 'Confirmar registro'}
      </button>
    </form>
  )
}
