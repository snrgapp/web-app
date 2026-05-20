'use client'

/**
 * Client Component que renderiza un formulario dinámico y maneja el envío.
 * Usa Server Action para submit.
 */

import { useMemo, useRef, useState } from 'react'
import { Loader2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormField } from './FormField'
import { submitFormAction } from '@/app/actions/forms'
import type { SubmitFormResult } from '@/app/actions/forms'
import type { FormFieldConfig } from '@/types/form.types'
import { cn } from '@/lib/utils'
import { mergePaasFormFields } from '@/lib/experience-forms/paas-default-fields'

interface FormRendererProps {
  formSlug: string
  titulo: string
  descripcion?: string | null
  iconUrl?: string | null
  coverUrl?: string | null
  campos: FormFieldConfig[]
  /** Tras éxito: CTA secundaria (ej. ir al networking PaaS) */
  afterSuccess?: { href: string; label: string }
  /** Sustituye submitFormAction (formularios experience_forms) */
  submitForm?: (slug: string, formData: FormData) => Promise<SubmitFormResult>
  /**
   * `paas`: pasos con burbuja de progreso, fondo oscuro con puntos, Inter (aplicar clase en el padre).
   * `default`: un solo paso, estilo claro actual.
   */
  variant?: 'default' | 'paas'
}

export function FormRenderer({
  formSlug,
  titulo,
  descripcion,
  iconUrl,
  coverUrl,
  campos,
  afterSuccess,
  submitForm,
  variant = 'default',
}: FormRendererProps) {
  const [status, setStatus] = useState<{
    type: 'idle' | 'loading' | 'success' | 'error'
    message?: string
    errors?: Record<string, string>
  }>({ type: 'idle' })

  const [paasStep, setPaasStep] = useState(0)
  const formRef = useRef<HTMLFormElement>(null)

  const isPaas = variant === 'paas'
  const customFields = campos
  const allFields = useMemo(
    () => (isPaas ? mergePaasFormFields(customFields) : customFields),
    [isPaas, customFields]
  )

  const paasStepFieldGroups: FormFieldConfig[][] = useMemo(() => {
    if (!isPaas) return [allFields]
    const contact = mergePaasFormFields([]) // solo contacto
    return [contact, ...customFields.map((f) => [f])]
  }, [isPaas, allFields, customFields])

  const paasTotalSteps = paasStepFieldGroups.length

  function validatePaasStep(stepIndex: number): boolean {
    const form = formRef.current
    if (!form) return false
    const group = paasStepFieldGroups[stepIndex] ?? []
    for (const f of group) {
      const nodes = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `[name="${CSS.escape(f.key)}"]`
      )
      if (nodes.length === 0) continue

      const first = nodes[0]
      if (first.type === 'radio' || first.type === 'checkbox') {
        const required = f.required ?? false
        if (required && first.type === 'radio') {
          const any = Array.from(nodes as unknown as HTMLInputElement[]).some((n) => n.checked)
          if (!any) {
            ;(nodes[0] as HTMLInputElement).setCustomValidity('Selecciona una opción')
            ;(nodes[0] as HTMLInputElement).reportValidity()
            ;(nodes[0] as HTMLInputElement).setCustomValidity('')
            return false
          }
        }
        if (required && first.type === 'checkbox' && f.options?.length) {
          const any = Array.from(nodes as unknown as HTMLInputElement[]).some((n) => n.checked)
          if (!any) {
            ;(nodes[0] as HTMLInputElement).setCustomValidity('Marca al menos una opción')
            ;(nodes[0] as HTMLInputElement).reportValidity()
            ;(nodes[0] as HTMLInputElement).setCustomValidity('')
            return false
          }
        }
        continue
      }

      const input = first
      if ('checkValidity' in input && !input.checkValidity()) {
        input.reportValidity()
        return false
      }
    }
    return true
  }

  function onFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!isPaas || paasStep >= paasTotalSteps - 1) return
    e.preventDefault()
    if (validatePaasStep(paasStep)) {
      setPaasStep((s) => Math.min(s + 1, paasTotalSteps - 1))
    }
  }

  async function handleSubmit(formData: FormData) {
    setStatus({ type: 'loading' })
    const submit = submitForm ?? submitFormAction
    const result = await submit(formSlug, formData)

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

  function goPaasPrev() {
    setPaasStep((s) => Math.max(s - 1, 0))
  }

  if (status.type === 'success') {
    if (isPaas) {
      return (
        <div className="rounded-2xl border border-zinc-600/80 bg-zinc-800/95 p-8 text-center shadow-xl backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">¡Inscripción registrada!</h2>
          <p className="mt-2 text-zinc-300">{status.message}</p>
          <p className="mt-6 text-sm leading-relaxed text-zinc-400">
            Gracias por tomarte el tiempo de completar el formulario. Tu información ya quedó
            registrada.
          </p>
          {afterSuccess && (
            <div className="mt-6">
              <Button
                asChild
                className="w-full rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 sm:w-auto"
              >
                <a href={afterSuccess.href}>{afterSuccess.label}</a>
              </Button>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900">¡Inscripción registrada!</h2>
        <p className="mt-2 text-zinc-600">{status.message}</p>
        <p className="mt-6 text-sm leading-relaxed text-zinc-500">
          Gracias por tomarte el tiempo de completar el formulario. Tu información ya quedó
          registrada.
        </p>
        {afterSuccess && (
          <div className="mt-6">
            <Button asChild className="w-full rounded-xl sm:w-auto">
              <a href={afterSuccess.href}>{afterSuccess.label}</a>
            </Button>
          </div>
        )}
      </div>
    )
  }

  const progressRow = isPaas ? (
    <div className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {paasStepFieldGroups.map((_, i) => (
        <div key={i} className="flex items-center gap-2 sm:gap-3">
          <div
            className={cn(
              'flex h-9 min-w-9 items-center justify-center rounded-full px-2.5 text-sm font-semibold transition-colors',
              i === paasStep && 'bg-white text-zinc-900 shadow-md',
              i < paasStep && 'bg-zinc-500 text-white',
              i > paasStep && 'border border-zinc-600 bg-zinc-900/50 text-zinc-500'
            )}
          >
            {i + 1}
          </div>
          {i < paasStepFieldGroups.length - 1 && (
            <div
              className={cn(
                'hidden h-0.5 w-4 sm:block sm:w-8',
                i < paasStep ? 'bg-zinc-400' : 'bg-zinc-700'
              )}
              aria-hidden
            />
          )}
        </div>
      ))}
    </div>
  ) : null

  const fieldVariant = isPaas ? 'dark' : 'light'

  return (
    <form
      ref={formRef}
      action={(fd) => void handleSubmit(fd)}
      onSubmit={onFormSubmit}
      className={cn(
        'overflow-hidden rounded-2xl shadow-sm',
        isPaas
          ? 'border border-zinc-600/80 bg-zinc-800/95 text-white backdrop-blur-sm shadow-black/40'
          : 'border border-zinc-200 bg-white'
      )}
    >
      <div className="relative">
        {coverUrl && !isPaas && (
          <div className="aspect-[3/1] max-h-48 w-full bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={coverUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        {iconUrl && !isPaas && (
          <div
            className={
              coverUrl
                ? 'absolute bottom-0 left-6 z-10 h-16 w-16 translate-y-1/2 overflow-hidden rounded-full bg-white shadow-lg ring-2 ring-white'
                : 'flex justify-start px-6 pt-4'
            }
          >
            {coverUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={iconUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-zinc-100 ring-2 ring-zinc-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className={cn(
          'px-6 pb-6 sm:px-8 sm:pb-8',
          isPaas ? 'pt-8 sm:pt-10' : iconUrl && coverUrl ? 'pt-14' : 'pt-6 sm:pt-8'
        )}
      >
        {progressRow}

        <h1 className={cn('text-2xl font-semibold', isPaas ? 'text-white' : 'text-zinc-900')}>
          {titulo}
        </h1>
        {descripcion && (
          <p
            className={cn(
              'mt-4 max-w-full text-left text-justify text-xs leading-relaxed -ml-2 pr-2',
              isPaas ? 'text-zinc-300' : 'text-zinc-600'
            )}
            style={{ whiteSpace: 'pre-line' }}
          >
            {descripcion}
          </p>
        )}

        <div className="mt-8 space-y-6">
          {isPaas
            ? paasStepFieldGroups.map((group, stepIndex) => (
                <div key={stepIndex} className={cn('space-y-6', stepIndex !== paasStep && 'hidden')} aria-hidden={stepIndex !== paasStep}>
                  {group.map((field) => (
                    <FormField
                      key={field.key}
                      field={field}
                      error={status.errors?.[field.key]}
                      variant={fieldVariant}
                    />
                  ))}
                </div>
              ))
            : allFields.map((field) => (
                <FormField key={field.key} field={field} error={status.errors?.[field.key]} variant={fieldVariant} />
              ))}
        </div>

        {status.type === 'error' && status.message && !Object.keys(status.errors ?? {}).length && (
          <p className={cn('mt-4 text-sm', isPaas ? 'text-red-400' : 'text-red-600')}>
            {status.message}
          </p>
        )}

        <div className={cn('mt-8 flex flex-col gap-3 sm:flex-row sm:items-center', isPaas && paasStep > 0 && 'sm:justify-between')}>
          {isPaas && paasStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={goPaasPrev}
              className="order-2 w-full rounded-xl border-zinc-500 bg-transparent text-zinc-100 hover:bg-zinc-700 hover:text-white sm:order-1 sm:w-auto"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Atrás
            </Button>
          )}
          <Button
            type="submit"
            disabled={status.type === 'loading'}
            className={cn(
              'order-1 w-full rounded-xl px-6 py-3 font-medium disabled:opacity-70 sm:w-auto',
              isPaas
                ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            )}
          >
            {status.type === 'loading' ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Enviando...
              </>
            ) : isPaas && paasStep < paasTotalSteps - 1 ? (
              <>
                Siguiente
                <ChevronRight className="ml-1 h-4 w-4" />
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
