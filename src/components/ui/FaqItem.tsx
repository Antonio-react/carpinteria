import type { ReactNode } from 'react'

interface FaqItemProps {
  number: number
  question: string
  children: ReactNode
}

/**
 * Pregunta frecuente desplegable (details/summary: accesible y sin JavaScript), escrita como en una
 * libreta: número a lápiz rojo y respuesta a máquina de escribir. Todo cuadra con el rayado de 2.25rem:
 * la pregunta deja un renglón en blanco encima y la respuesta no lleva relleno, así que al abrir una,
 * las de debajo bajan renglones enteros y siguen apoyadas en su línea.
 */
export function FaqItem({ number, question, children }: FaqItemProps) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-end gap-4 pt-[1.875rem] pb-1.5 text-lg leading-[2.25rem] font-medium [&::-webkit-details-marker]:hidden">
        <span className="flex-1">
          <span aria-hidden="true" className="mr-3 inline-block w-5 font-serif text-pencil italic">{number}.</span>
          {question}
        </span>
        <span aria-hidden="true" className="shrink-0 font-serif text-2xl text-pencil transition-transform duration-200 ease-(--ease-out-strong) group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="relative -top-1.5 pl-10 font-type *:text-left text-[15px] leading-[2.25rem] text-ink/85">{children}</div>
    </details>
  )
}
