import { ProcessStep } from '@/components/sections/ProcessStep'
import type { ProcessStage } from '@/components/sections/ProcessDrawing'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

const STEPS: readonly { number: string; title: string; text: string; stage: ProcessStage }[] = [
  {
    number: '01',
    title: 'Medimos',
    text: 'Vamos a tu casa y tomamos las medidas reales del espacio: paredes que no están a escuadra, rodapiés, enchufes. Así la pieza encaja a la primera.',
    stage: 'measure',
  },
  {
    number: '02',
    title: 'Diseñamos',
    text: 'Te proponemos el diseño, los materiales y los acabados, y lo ajustamos contigo hasta que sea lo que imaginabas.',
    stage: 'design',
  },
  {
    number: '03',
    title: 'Montamos',
    text: 'Lo fabricamos en nuestro taller, lo llevamos y lo montamos nosotros mismos, en cualquier punto de España.',
    stage: 'build',
  },
]

/**
 * "Cómo trabajamos", con estética de plano de taller (papel milimetrado, cotas en lápiz rojo).
 * Momento animado de la página: cada lámina traza su plano al aparecer en pantalla (ver ProcessStep).
 * Con prefers-reduced-motion aparecen ya dibujados.
 */
interface ProcessSectionProps {
  /** h1 cuando es la cabecera de la página Cómo trabajamos. */
  level?: 'h1' | 'h2'
}

export function ProcessSection({ level = 'h2' }: ProcessSectionProps) {
  return (
    <section
      aria-labelledby="como-trabajamos-titulo"
      className={`border-y border-ink/10 bg-paper bg-[linear-gradient(to_right,rgb(28_25_22/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(28_25_22/0.05)_1px,transparent_1px)] bg-size-[24px_24px] ${level === 'h1' ? 'pt-32 pb-24 lg:pt-40 lg:compact:pt-32' : 'py-24 lg:pt-36 lg:compact:pt-24'} lg:pb-36 lg:compact:pb-24`}
    >
      <Container>
        <SectionHeading
          id="como-trabajamos-titulo"
          level={level}
          title="Medimos, diseñamos y montamos nosotros."
          intro="Nadie intermedia entre tu idea y el mueble terminado: las personas que miden tu casa son las que lo diseñan, lo fabrican y lo montan."
        />
        <ol className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8 lg:mt-20 lg:compact:mt-14">
          {STEPS.map((step) => (
            <ProcessStep key={step.number} {...step} />
          ))}
        </ol>
      </Container>
    </section>
  )
}
