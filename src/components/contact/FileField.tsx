import { useState, type ChangeEvent } from 'react'
import { describedBy } from '@/components/contact/fieldA11y'

interface FileFieldProps {
  name: string
  label: string
  accept: string
  error?: string
  /** Para enlazar la ayuda común de los adjuntos. */
  hintId?: string
}

/** Selector de un archivo (plano o foto) con el nombre del archivo elegido y opción de quitarlo. */
export function FileField({ name, label, accept, error, hintId }: FileFieldProps) {
  const id = `campo-${name}`
  const [fileName, setFileName] = useState('')

  const onChange = (event: ChangeEvent<HTMLInputElement>) => setFileName(event.target.files?.[0]?.name ?? '')

  const clear = () => {
    const input = document.getElementById(id)
    if (input instanceof HTMLInputElement) input.value = ''
    setFileName('')
  }

  const a11y = describedBy(id, undefined, error)
  const describedIds = [hintId, a11y['aria-describedby']].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <div className="flex min-h-12 items-center gap-3 rounded-[6px] border border-dashed border-ink/25 bg-paper px-4 py-2 transition-colors hover:border-ink/50 has-focus-visible:border-ink">
        <label htmlFor={id} className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          {label}
        </label>
        <input id={id} name={name} type="file" accept={accept} onChange={onChange} className="sr-only" aria-describedby={describedIds} aria-invalid={a11y['aria-invalid']} />
        <span className="min-w-0 flex-1 truncate text-sm text-muted">{fileName || 'Ningún archivo'}</span>
        {fileName && (
          <button type="button" onClick={clear} aria-label={`Quitar ${fileName}`} className="grid size-11 place-items-center rounded-full text-ink/60 hover:text-ink">
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-pencil">
          {error}
        </p>
      )}
    </div>
  )
}
