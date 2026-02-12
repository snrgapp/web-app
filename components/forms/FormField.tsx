'use client'

/**
 * Componente reutilizable para renderizar un campo de formulario según su tipo.
 * Usado por FormRenderer para formularios dinámicos.
 */

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { FormFieldConfig } from '@/types/form.types'

interface FormFieldProps {
  field: FormFieldConfig
  error?: string
  defaultValue?: string | number | boolean | string[]
}

export function FormField({ field, error, defaultValue }: FormFieldProps) {
  const id = `field-${field.key}`
  const isRequired = field.required ?? false

  const label = (
    <label
      htmlFor={id}
      className="block text-sm font-medium text-zinc-700 mb-1.5"
    >
      {field.label}
      {isRequired && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )

  switch (field.type) {
    case 'textarea':
      return (
        <div className="space-y-1.5">
          {label}
          <textarea
            id={id}
            name={field.key}
            required={isRequired}
            placeholder={field.placeholder}
            defaultValue={Array.isArray(defaultValue) ? undefined : String(defaultValue ?? '')}
            maxLength={field.max}
            className={cn(
              'flex min-h-[100px] w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm transition-colors',
              'placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1',
              error && 'border-red-400 focus:ring-red-400'
            )}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )

    case 'select':
      return (
        <div className="space-y-1.5">
          {label}
          <select
            id={id}
            name={field.key}
            required={isRequired}
            className={cn(
              'flex h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1',
              error && 'border-red-400 focus:ring-red-400'
            )}
            defaultValue={String(defaultValue ?? '')}
          >
            <option value="">{field.placeholder ?? 'Selecciona...'}</option>
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )

    case 'radio':
      return (
        <div className="space-y-2">
          {label}
          <div className="flex flex-wrap gap-4">
            {(field.options ?? []).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name={field.key}
                  value={opt.value}
                  required={isRequired}
                  defaultChecked={String(defaultValue) === opt.value}
                  className="h-4 w-4 rounded-full border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <span className="text-sm text-zinc-700">{opt.label}</span>
              </label>
            ))}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )

    case 'checkbox':
      return (
        <div className="space-y-2">
          {label}
          <div className="flex flex-wrap gap-4">
            {(field.options ?? []).map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={field.key}
                  value={opt.value}
                  defaultChecked={
                    Array.isArray(defaultValue) && defaultValue.includes(opt.value)
                  }
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                />
                <span className="text-sm text-zinc-700">{opt.label}</span>
              </label>
            ))}
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )

    default: {
      const inputType = field.type === 'url' ? 'url' : field.type
      return (
        <div className="space-y-1.5">
          {label}
          <Input
            id={id}
            name={field.key}
            type={inputType}
            required={isRequired}
            placeholder={field.placeholder}
            defaultValue={
              Array.isArray(defaultValue) ? undefined : String(defaultValue ?? '')
            }
            min={field.min}
            max={field.max}
            className={cn(
              'rounded-xl border-zinc-200 bg-white h-11',
              error && 'border-red-400 focus-visible:ring-red-400'
            )}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )
    }
  }
}
