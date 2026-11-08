import type { ReactNode } from 'react'

interface SectionHeadingProps {
  /** Línea pequeña sobre el título (opcional: la mayoría de secciones ya no la llevan). */
  eyebrow?: string
  title: ReactNode
  intro?: ReactNode
  /** Para enlazar el título con aria-labelledby de la sección. */
  id?: string
  /** h1 cuando la sección es la cabecera de su página; h2 dentro de una página. */
  level?: 'h1' | 'h2'
  tone?: 'light' | 'dark'
  className?: string
}

/** Cabecera de sección: título grande, con antetítulo y entradilla opcionales. */
export function SectionHeading({ eyebrow, title, intro, id, level = 'h2', tone = 'light', className = '' }: SectionHeadingProps) {
  const muted = tone === 'light' ? 'text-muted' : 'text-name/70'
  const Heading = level
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <p className={`mb-4 text-xs font-medium tracking-[0.2em] uppercase ${muted}`}>{eyebrow}</p>}
      <Heading id={id} className="text-4xl leading-[1.02] font-medium tracking-[-0.025em] text-balance [font-stretch:105%] sm:text-5xl lg:text-6xl lg:compact:text-5xl">
        {title}
      </Heading>
      {/* Entradilla corta y grande: a la izquierda (justificada abriría huecos grandes entre palabras). */}
      {intro && <p className={`mt-6 max-w-xl text-left text-lg leading-relaxed text-pretty ${muted}`}>{intro}</p>}
    </div>
  )
}
