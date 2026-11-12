import { FieldShell } from '@/components/contact/FieldShell'
import { CONTROL_CLASSES, describedBy, LINED_CLASSES } from '@/components/contact/fieldA11y'

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
  /** Clases extra para el propio campo (input o textarea), p. ej. su alto. */
  controlClassName?: string
}

/** Alto de un renglón del área de texto rayada (leading-8 = 2rem). */
const LINE_PX = 32

/**
 * El área se ajusta al texto renglón a renglón (múltiplo exacto del renglón, para que las rayas cuadren):
 * crece al escribir y encoge al borrar, sin bajar nunca de su tamaño inicial (rows). Hace falta en móvil:
 * allí el navegador no muestra el tirador para agrandarla a mano.
 */
function growToFit(area: HTMLTextAreaElement) {
  // Vuelve al tamaño inicial para medir lo que ocupa de verdad el texto (así también encoge al borrar).
  area.style.height = ''
  if (area.scrollHeight <= area.clientHeight) return
  const lines = Math.ceil(area.scrollHeight / LINE_PX)
  area.style.height = `${lines * LINE_PX + (area.offsetHeight - area.clientHeight)}px`
}

/** Campo de texto (una línea o varias) con su etiqueta y su error. */
export function TextField({ name, label, type = 'text', autoComplete, placeholder, required = false, hint, error, multiline = false, className, controlClassName = '' }: TextFieldProps) {
  const id = `campo-${name}`
  const shared = { id, name, placeholder, required, className: `${CONTROL_CLASSES} ${controlClassName}`, ...describedBy(id, hint, error) }
  return (
    <FieldShell id={id} label={label} required={required} hint={hint} error={error} className={className}>
      {multiline ? (
        <div className="relative">
          <textarea rows={4} {...shared} className={`${shared.className} ${LINED_CLASSES}`} onInput={(event) => growToFit(event.currentTarget)} />
          {/* Marca de la esquina (dos rayitas en diagonal), como la del navegador en escritorio. En pantallas
              táctiles el navegador no la dibuja: se pinta aquí, solo de adorno (el área crece sola al escribir). */}
          <svg aria-hidden="true" viewBox="0 0 10 10" className="pointer-events-none absolute right-0.5 bottom-1 hidden size-2.5 stroke-ink/60 pointer-coarse:block">
            <path d="M9 2 2 9M9 6 6 9" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      ) : (
        <input type={type} autoComplete={autoComplete} {...shared} />
      )}
    </FieldShell>
  )
}
