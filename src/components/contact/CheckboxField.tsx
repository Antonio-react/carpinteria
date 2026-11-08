import type { ReactNode } from 'react'
import { describedBy } from '@/components/contact/fieldA11y'

interface CheckboxFieldProps {
  name: string
  required?: boolean
  error?: string
  children: ReactNode
}

/** Casilla de aceptación (privacidad) con su texto y su error. */
export function CheckboxField({ name, required = false, error, children }: CheckboxFieldProps) {
  const id = `campo-${name}`
  return (
    <div>
      <div className="flex gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          required={required}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ink"
          {...describedBy(id, undefined, error)}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-muted">
          {children}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-pencil">
          {error}
        </p>
      )}
    </div>
  )
}
