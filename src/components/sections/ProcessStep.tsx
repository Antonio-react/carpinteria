import { ProcessDrawing, type ProcessStage } from '@/components/sections/ProcessDrawing'
import { useRevealOnce } from '@/hooks/useRevealOnce'

interface ProcessStepProps {
  number: string
  title: string
  text: string
  stage: ProcessStage
}

/**
 * Un paso de "Cómo trabajamos": lámina con su plano, número de lámina, título y explicación.
 * Cada lámina traza su plano cuando ELLA entra en pantalla (en móvil van una debajo de otra:
 * se dibujan según bajas; en escritorio están en la misma fila y se dibujan a la vez).
 * Las variables --draw / --fill las leen las líneas y rellenos de ProcessDrawing.
 */
export function ProcessStep({ number, title, text, stage }: ProcessStepProps) {
  const { ref, revealed } = useRevealOnce<HTMLLIElement>()
  return (
    <li
      ref={ref}
      data-drawn={revealed}
      className="flex flex-col [--draw:1] [--fill:0] data-[drawn=true]:[--draw:0] data-[drawn=true]:[--fill:1]"
    >
      <div className="relative border border-ink/15 bg-paper/80 p-5">
        <span className="absolute top-3 left-4 text-[11px] font-medium tracking-[0.2em] text-pencil uppercase">Lámina {number}</span>
        <div className="pt-6">
          <ProcessDrawing stage={stage} />
        </div>
      </div>
      <h3 className="mt-6 text-2xl font-medium tracking-[-0.02em] [font-stretch:110%]">{title}</h3>
      <p className="mt-3 max-w-sm leading-relaxed text-muted">{text}</p>
    </li>
  )
}
