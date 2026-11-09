import type { ReactNode } from 'react'

interface FaqItemProps {
  number: number
  question: string
  children: ReactNode
}

/**
 * Pregunta frecuente desplegable (details/summary: accesible y sin JavaScript), escrita como en una
 * libreta: número a lápiz rojo, pregunta y respuesta en letra "de mano" (serif cursiva).
 */
export function FaqItem({ number, question, children }: FaqItemProps) {
  return (
    <details className="group">
      <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-end gap-4 pb-1.5 text-lg leading-[2.25rem] font-medium [&::-webkit-details-marker]:hidden">
        <span className="flex-1">
          <span aria-hidden="true" className="mr-3 inline-block w-5 font-serif text-pencil italic">{number}.</span>
          {question}
        </span>
        <span aria-hidden="true" className="shrink-0 font-serif text-2xl text-pencil transition-transform duration-200 ease-(--ease-out-strong) group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pb-5 pl-10 font-serif text-lg leading-[2.25rem] text-ink/80 italic">{children}</div>
    </details>
  )
}
