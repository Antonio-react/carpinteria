interface TitleBlockProps {
  number: string
  title: string
  /** Línea de abajo: quién y dónde (taller y localidad). */
  signature: string
  tone?: 'light' | 'dark'
  className?: string
}

const TONES = {
  light: { box: 'border-ink/25 text-ink', line: 'border-ink/25', muted: 'text-ink/50' },
  dark: { box: 'border-name/25 text-name', line: 'border-name/25', muted: 'text-name/50' },
} as const

/**
 * Cajetín de plano: el recuadro que llevan los planos técnicos con hoja, título, escala y firma.
 * Cada página es una "hoja" del cuaderno de planos del taller. Decorativo (aria-hidden).
 * En móvil, solo la fila de arriba (compacta).
 */
export function TitleBlock({ number, title, signature, tone = 'light', className = '' }: TitleBlockProps) {
  const styles = TONES[tone]
  return (
    <div aria-hidden="true" className={`border text-[10px] leading-none font-medium tracking-[0.14em] uppercase select-none ${styles.box} ${className}`}>
      <div className="flex">
        <span className="flex items-center gap-1.5 px-2.5 py-2">
          <span className={styles.muted}>Hoja</span> {number}
        </span>
        <span className={`flex min-w-0 flex-1 items-center border-l px-2.5 py-2 tracking-[0.08em] normal-case ${styles.line}`}>
          <span className="truncate text-[11px]">{title}</span>
        </span>
        <span className={`flex items-center gap-1.5 border-l px-2.5 py-2 ${styles.line}`}>
          <span className={styles.muted}>Esc.</span> 1:1
        </span>
      </div>
      <div className={`hidden border-t px-2.5 py-2 tracking-[0.08em] normal-case sm:block ${styles.line} ${styles.muted}`}>{signature}</div>
    </div>
  )
}
