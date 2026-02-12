/**
 * Cliente ligero para la API REST v3 de Brevo.
 * Crea/actualiza contactos y los añade a listas.
 *
 * Requiere env var: BREVO_API_KEY (clave xkeysib-...)
 */

const BREVO_API_URL = 'https://api.brevo.com/v3'

function getApiKey(): string | null {
  return process.env.BREVO_API_KEY ?? null
}

function headers(apiKey: string): HeadersInit {
  return {
    'api-key': apiKey,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

export interface BrevoContactData {
  email: string
  nombre?: string | null
  telefono?: string | null
}

/**
 * Crea o actualiza un contacto en Brevo y lo añade a una lista.
 * Si el contacto ya existe, se actualiza y se añade a la lista.
 *
 * @returns { success, error? }
 */
export async function addContactToBrevoList(
  contact: BrevoContactData,
  listId: number
): Promise<{ success: boolean; error?: string }> {
  const apiKey = getApiKey()
  if (!apiKey) {
    console.warn('[Brevo] BREVO_API_KEY no configurada, omitiendo envío.')
    return { success: false, error: 'BREVO_API_KEY no configurada' }
  }

  try {
    // Crear o actualizar contacto
    const createRes = await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({
        email: contact.email,
        attributes: {
          NOMBRE: contact.nombre ?? '',
          SMS: contact.telefono ?? '',
        },
        listIds: [listId],
        updateEnabled: true,
      }),
    })

    if (createRes.ok || createRes.status === 204) {
      return { success: true }
    }

    // Si el contacto ya existe (409), añadirlo a la lista manualmente
    if (createRes.status === 409) {
      const addToListRes = await fetch(
        `${BREVO_API_URL}/contacts/lists/${listId}/contacts/add`,
        {
          method: 'POST',
          headers: headers(apiKey),
          body: JSON.stringify({ emails: [contact.email] }),
        }
      )

      if (addToListRes.ok || addToListRes.status === 204) {
        // También actualizar atributos
        await fetch(`${BREVO_API_URL}/contacts/${encodeURIComponent(contact.email)}`, {
          method: 'PUT',
          headers: headers(apiKey),
          body: JSON.stringify({
            attributes: {
              NOMBRE: contact.nombre ?? '',
              SMS: contact.telefono ?? '',
            },
          }),
        })
        return { success: true }
      }

      const listErr = await addToListRes.text()
      console.error('[Brevo] Error al añadir a lista:', listErr)
      return { success: false, error: `Error al añadir a lista: ${addToListRes.status}` }
    }

    const errBody = await createRes.text()
    console.error('[Brevo] Error al crear contacto:', errBody)
    return { success: false, error: `Brevo API error: ${createRes.status}` }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[Brevo] Excepción:', message)
    return { success: false, error: message }
  }
}
