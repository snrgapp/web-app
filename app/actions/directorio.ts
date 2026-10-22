'use server'

import { redirect } from 'next/navigation'
import { MENSAJE_FORMATO, MENSAJE_SESION } from '@/lib/directorio/config'
import { buscarAsistente } from '@/lib/directorio/consultas'
import { cerrarSesionDirectorio, establecerSesionDirectorio } from '@/lib/directorio/sesion'
import { normalizarCelularColombia } from '@/lib/directorio/telefono'

export async function ingresarDirectorio(
  _previo: { error: string } | null,
  datos: FormData
): Promise<{ error: string }> {
  const entrada = String(datos.get('celular') ?? '')
  const telefono = normalizarCelularColombia(entrada)
  if (!telefono) return { error: MENSAJE_FORMATO }

  const acceso = await buscarAsistente(telefono)
  if (!acceso.ok) return { error: acceso.mensaje }

  const expira = new Date(acceso.fila.access_expires_at)
  const creada = await establecerSesionDirectorio(telefono, expira)
  if (!creada) return { error: MENSAJE_SESION }

  redirect('/directorio')
}

export async function salirDirectorio(): Promise<void> {
  await cerrarSesionDirectorio()
  redirect('/directorio')
}
