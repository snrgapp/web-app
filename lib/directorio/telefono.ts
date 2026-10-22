/** Celular de Colombia en E.164 (+57 y 10 dígitos que empiezan por 3). */
export function normalizarCelularColombia(entrada: string): string | null {
  if (!entrada || entrada.length > 40) return null
  let digitos = entrada.replace(/\D/g, '')
  if (digitos.startsWith('57') && digitos.length === 12) {
    digitos = digitos.slice(2)
  }
  if (digitos.length !== 10 || !digitos.startsWith('3')) return null
  return `+57${digitos}`
}

export function mostrarCelular(e164: string): string {
  const digitos = e164.replace(/\D/g, '')
  if (digitos.length === 12 && digitos.startsWith('57')) {
    const nacional = digitos.slice(2)
    return `+57 ${nacional.slice(0, 3)} ${nacional.slice(3, 6)} ${nacional.slice(6)}`
  }
  return e164
}

export function enlaceWhatsapp(e164: string): string | null {
  const digitos = e164.replace(/\D/g, '')
  if (!/^57\d{10}$/.test(digitos)) return null
  return `https://wa.me/${digitos}`
}

export function enlaceCorreo(correo: string | null | undefined): string | null {
  if (!correo) return null
  const limpio = correo.trim()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(limpio)) return null
  return `mailto:${limpio}`
}
