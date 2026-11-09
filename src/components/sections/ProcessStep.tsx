import { ProcessDrawing, type ProcessStage } from '@/components/sections/ProcessDrawing'
import { useRevealOnce } from '@/hooks/useRevealOnce'

interface ProcessStepProps {
  number: string
  title: string
  text: string
  stage: ProcessStage
  /** Colocación del paso en la fila (tamaño, solape) y giro de su hoja: hojas sueltas sobre la mesa. */
  className?: string
  sheetClassName?: string
  /** Márgenes del texto para que no se monte con el del paso de al lado (las hojas se solapan). */
  textClassName?: string
}

/**
 * Un paso de "Cómo trabajamos": lámina con su plano, número de lámina, título y explicación.
 * Cada lámina traza su plano cuando ELLA entra en pantalla (en móvil van una debajo de otra:
 * se dibujan según bajas; en escritorio están en la misma fila y se dibujan a la vez).
 * Las variables --draw / --fill las leen las líneas y rellenos de ProcessDrawing.
 */
export function ProcessStep({ number, title, text, stage, className = '', sheetClassName = '', textClassName = '' }: ProcessStepProps) {
  const { ref, revealed } = useRevealOnce<HTMLLIElement>()
  return (
    <li
      ref={ref}
      data-drawn={revealed}
      className={`relative flex flex-col [--draw:1] [--fill:0] data-[drawn=true]:[--draw:0] data-[drawn=true]:[--fill:1] ${className}`}
    >
      {/* La hoja (solo ella va girada: el texto de debajo queda recto y se lee bien) */}
      <div className={`relative border border-ink/15 bg-paper p-5 shadow-[0_18px_36px_-20px_rgb(28_25_22/0.45)] ${sheetClassName}`}>
        <span className="absolute top-3 left-4 text-[11px] font-medium tracking-[0.2em] text-pencil uppercase">Lámina {number}</span>
        <div className="pt-6">
          <ProcessDrawing stage={stage} />
        </div>
      </div>
      <div className={textClassName}>
        <h3 className="mt-6 text-2xl font-medium tracking-[-0.02em] [font-stretch:110%]">{title}</h3>
        <p className="mt-3 max-w-sm leading-relaxed text-muted">{text}</p>
      </div>
    </li>
  )
}
