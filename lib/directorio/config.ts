/** Encuentro que abre /directorio. Otro evento: DIRECTORY_EVENT_SLUG en el servidor. */
export const EVENTO_DIRECTORIO =
  process.env.DIRECTORY_EVENT_SLUG?.trim() || 'networking-2026-10-20'

export const MENSAJE_FORMATO =
  'Escribe los 10 dígitos de tu celular, empezando por 3.'
export const MENSAJE_NO_ESTA =
  'Ese número no aparece en la lista de este encuentro.'
export const MENSAJE_CERRADO = 'El acceso a este directorio ya cerró.'
export const MENSAJE_SIN_CONEXION =
  'Todavía no podemos confirmar tu número. La conexión con los datos no está lista.'
export const MENSAJE_SIN_TABLA =
  'Todavía no podemos confirmar tu número. La lista de asistentes aún no está cargada.'
export const MENSAJE_CARGA =
  'No pudimos cargar el directorio. Inténtalo de nuevo en un momento.'
export const MENSAJE_SESION =
  'No pudimos abrir tu sesión. Inténtalo de nuevo más tarde.'
