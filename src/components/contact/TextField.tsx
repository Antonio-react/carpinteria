import { FieldShell } from '@/components/contact/FieldShell'
import { CONTROL_CLASSES, describedBy } from '@/components/contact/fieldA11y'

interface TextFieldProps {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel'
  autoComplete?: string
  placeholder?: string
  required?: boolean
  hint?: string
  error?: string
  /** Área de texto de varias líneas en vez de una línea. */
  multiline?: boolean
  className?: string
}

/** Campo de texto (una línea o varias) con su etiqueta y su error. */
export function TextField({ name, label, type = 'text', autoComplete, placeholder, required = false, hint, error, multiline = false, className }: TextFieldProps) {
  const id = `campo-${name}`
  const shared = { id, name, placeholder, required, className: CONTROL_CLASSES, ...describedBy(id, hint, error) }
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      {multiline ? <textarea rows={6} {...shared} /> : <input type={type} autoComplete={autoComplete} {...shared} />}
    </FieldShell>
  )
}
