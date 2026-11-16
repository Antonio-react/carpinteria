import { ProcessDrawing, type ProcessStage } from '@/components/sections/ProcessDrawing'
import { useRevealOnce } from '@/hooks/useRevealOnce'

interface ProcessStepProps {
  title: string
  text: string
  stage: ProcessStage
  /** Colocación del paso en la fila (tamaño, solape) y giro de su hoja: hojas sueltas sobre la mesa. */
  className?: string
  sheetClassName?: string
  /** Márgenes del texto para que no se monte con el del paso de al lado (las hojas se solapan). */
  textClassName?: string
  /** Nivel del título: h3 bajo un h2 (Inicio); h2 cuando la sección es la cabecera (h1) de su página. */
  headingLevel?: 'h2' | 'h3'
}

/**
 * Un paso de "Cómo trabajamos": lámina con su plano, título y explicación (sin rótulo de número:
 * el título del paso ya dice qué es).
 * Cada lámina traza su plano cuando ELLA entra en pantalla (en móvil van una debajo de otra:
 * se dibujan según bajas; en escritorio están en la misma fila y se dibujan a la vez).
 * Las variables --draw / --fill las leen las líneas y rellenos de ProcessDrawing.
 */
export function ProcessStep({ title, text, stage, className = '', sheetClassName = '', textClassName = '', headingLevel = 'h3' }: ProcessStepProps) {
  const Heading = headingLevel
  const { ref, revealed } = useRevealOnce<HTMLLIElement>()
  return (
    <li
      ref={ref}
      data-drawn={revealed}
      className={`relative flex flex-col [--draw:1] [--fill:0] data-[drawn=true]:[--draw:0] data-[drawn=true]:[--fill:1] ${className}`}
    >
      {/* La hoja (solo ella va girada: el texto de debajo queda recto y se lee bien) */}
      <div className={`relative border border-ink/15 bg-paper p-5 shadow-[0_18px_36px_-20px_rgb(28_25_22/0.45)] ${sheetClassName}`}>
        <ProcessDrawing stage={stage} />
      </div>
      <div className={textClassName}>
        <Heading className="mt-6 text-2xl font-medium tracking-[-0.02em] font-stretch-110%">{title}</Heading>
        {/* Columna estrecha: a la izquierda (justificado abría huecos grandes entre palabras). */}
        <p className="mt-3 max-w-sm text-left leading-relaxed text-muted">{text}</p>
      </div>
    </li>
  )
}
