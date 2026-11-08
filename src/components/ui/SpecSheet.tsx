export interface SpecRow {
  label: string
  value: string
  /** Aclaración corta bajo el valor (opcional). */
  note?: string
}

interface SpecSheetProps {
  title: string
  rows: readonly SpecRow[]
  className?: string
}

/**
 * Ficha técnica con filas rayadas, en el mismo lenguaje que el cajetín de los planos (TitleBlock):
 * etiqueta pequeña a la izquierda y dato a la derecha. Es una lista de definiciones (<dl>).
 */
export function SpecSheet({ title, rows, className = '' }: SpecSheetProps) {
  return (
    <div className={`border border-ink/25 ${className}`}>
      <p className="border-b border-ink/25 px-4 py-2.5 text-[11px] leading-none font-medium tracking-[0.14em] text-ink/60 uppercase">{title}</p>
      <dl>
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[7.75rem_1fr] border-b border-ink/15 last:border-b-0 sm:grid-cols-[8rem_1fr]">
            <dt className="border-r border-ink/15 px-3 py-4 text-[11px] leading-5 font-medium tracking-[0.1em] sm:px-4 sm:tracking-[0.14em] text-ink/60 uppercase">{row.label}</dt>
            <dd className="px-4 py-3.5">
              <span className="block text-xl leading-snug font-medium tracking-[-0.01em] [font-stretch:105%]">{row.value}</span>
              {row.note && <span className="mt-1 block text-[15px] leading-snug text-muted">{row.note}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
