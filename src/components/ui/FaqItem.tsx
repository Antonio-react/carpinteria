import type { ReactNode } from 'react'

interface FaqItemProps {
  question: string
  children: ReactNode
}

/** Pregunta frecuente desplegable (details/summary: accesible y sin JavaScript). */
export function FaqItem({ question, children }: FaqItemProps) {
  return (
    <details className="group border-b border-ink/15 py-2">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
        {question}
        <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 text-lg transition-transform duration-200 ease-(--ease-out-strong) group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-5 leading-relaxed text-muted">{children}</div>
    </details>
  )
}
