import type { ReactNode } from 'react'

interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

/** Envoltorio común de cada campo: etiqueta visible, ayuda opcional y el error justo debajo. */
export function FieldShell({ id, label, required = false, hint, error, className = '', children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-pencil">
            {' '}*
          </span>
        ) : (
          <span className="font-normal text-muted"> (opcional)</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-ayuda`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-pencil">
          {error}
        </p>
      )}
    </div>
  )
}
