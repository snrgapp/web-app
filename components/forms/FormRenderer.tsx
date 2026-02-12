'use client'

/**
 * Client Component que renderiza un formulario dinámico y maneja el envío.
 * Usa Server Action para submit.
 */

import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from './FormField'
import { submitFormAction } from '@/app/actions/forms'
import type { FormFieldConfig } from '@/types/form.types'

interface FormRendererProps {
  formSlug: string
  titulo: string
  descripcion?: string | null
  iconUrl?: string | null
  coverUrl?: string | null
  campos: FormFieldConfig[]
}

export function FormRenderer({
  formSlug,
  titulo,
  descripcion,
  iconUrl,
  coverUrl,
  campos,
}: FormRendererProps) {
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error'
    message?: string
    errors?: Record<string, string>
  }>({ type: 'idle' })

  async function handleSubmit(formData: FormData) {
    setStatus({ type: 'loading' })
    const result = await submitFormAction(formSlug, formData)

    if (result.success) {
      setStatus({ type: 'success', message: result.message })
    } else {
      setStatus({
        type: 'error',
        message: result.message,
        errors: result.errors,
      })
    }
  }

  if (status.type === 'success') {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900">
          ¡Inscripción registrada!
        </h2>
        <p className="mt-2 text-zinc-600">{status.message}</p>
      </div>
    )
  }

  return (
    <form
      action={handleSubmit}
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm"
    >
      <div className="relative">
        {coverUrl && (
          <div className="w-full aspect-[3/1] max-h-48 bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={coverUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {iconUrl && (
          <div
            className={
              coverUrl
                ? 'absolute left-6 bottom-0 w-16 h-16 rounded-full overflow-hidden bg-white shadow-lg ring-2 ring-white translate-y-1/2 z-10'
                : 'flex justify-start px-6 pt-4'
            }
          >
            {coverUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={iconUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100 ring-2 ring-zinc-200 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconUrl} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={`px-6 pb-6 sm:px-8 sm:pb-8 ${iconUrl && coverUrl ? 'pt-14' : 'pt-6 sm:pt-8'}`}
      >
        <h1 className="text-2xl font-semibold text-zinc-900">{titulo}</h1>
        {descripcion && (
          <p
            className="mt-4 text-xs text-zinc-600 text-left text-justify -ml-2 pr-2 max-w-full leading-relaxed"
            style={{ whiteSpace: 'pre-line' }}
          >
            {descripcion}
          </p>
        )}

        <div className="mt-8 space-y-6">
          {campos.map((field) => (
            <FormField
              key={field.key}
              field={field}
              error={status.errors?.[field.key]}
            />
          ))}
        </div>

        {status.type === 'error' && status.message && !Object.keys(status.errors ?? {}).length && (
          <p className="mt-4 text-sm text-red-600">{status.message}</p>
        )}

        <div className="mt-8">
          <Button
            type="submit"
            disabled={status.type === 'loading'}
            className="w-full rounded-xl bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-70 sm:w-auto"
          >
          {status.type === 'loading' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Enviando...
            </>
            ) : (
              'Enviar inscripción'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
