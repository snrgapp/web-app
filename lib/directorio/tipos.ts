export type TonoTarjeta = 'lima' | 'naranja' | 'azul' | 'rosa'
export type TamanoTarjeta = 'amplia' | 'media' | 'compacta'

export type TarjetaDirectorio = {
  id: string
  nombre: string
  apellido: string
  iniciales: string
  empresa: string
  sector: string
  soluciones: string
  desafios: string
  telefonoVisible: string
  whatsapp: string | null
  correo: string | null
  correoHref: string | null
  tono: TonoTarjeta
  tamano: TamanoTarjeta
}
