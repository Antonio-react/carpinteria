import type { ReactNode } from 'react'

interface FormStatusMessageProps {
  tone: 'success' | 'error'
  title: string
  children: ReactNode
}

/** Aviso de resultado del envío (confirmación o error), anunciado a lectores de pantalla. */
export function FormStatusMessage({ tone, title, children }: FormStatusMessageProps) {
  const success = tone === 'success'
  return (
    <div
      role={success ? 'status' : 'alert'}
      className={`rounded-[8px] border p-6 ${success ? 'border-oak/30 bg-paper' : 'border-pencil/40 bg-pencil/5'}`}
    >
      <p className={`flex items-center gap-3 text-lg font-medium ${success ? 'text-ink' : 'text-pencil'}`}>
        <span aria-hidden="true" className={`grid size-8 place-items-center rounded-full text-sm ${success ? 'bg-oak text-paper' : 'bg-pencil text-paper'}`}>
          {success ? '✓' : '!'}
        </span>
        {title}
      </p>
      <div className="mt-3 leading-relaxed text-muted">{children}</div>
    </div>
  )
}
