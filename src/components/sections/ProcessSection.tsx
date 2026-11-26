import { ProcessStep } from '@/components/sections/ProcessStep'
import type { ProcessStage } from '@/components/sections/ProcessDrawing'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { BLUEPRINT_BG } from '@/styles/backgrounds'

/**
 * Cada lámina con su tamaño, solape y giro: hojas sueltas sobre la mesa del taller, no tres tarjetas
 * iguales en fila. En móvil van una debajo de otra, con un giro leve alterno.
 */
const STEPS: readonly { title: string; text: string; stage: ProcessStage; className: string; sheetClassName: string; textClassName: string }[] = [
  {
    title: 'Medimos',
    text: 'Vamos a tu casa o a tu negocio y tomamos las medidas reales del espacio: paredes que no están a escuadra, rodapiés, enchufes. Así la pieza encaja a la primera.',
    stage: 'measure',
    className: 'md:col-span-5',
    sheetClassName: '-rotate-1 md:-rotate-2',
    textClassName: 'md:pr-16',
  },
  {
    title: 'Diseñamos',
    text: 'Te dibujamos el mueble con sus medidas, te enseñamos maderas y acabados, y lo cambiamos contigo hasta que sea justo lo que tenías en la cabeza.',
    stage: 'design',
    className: 'z-10 md:col-span-4 md:-ml-12 md:mt-20',
    sheetClassName: 'rotate-1 md:rotate-[1.5deg]',
    textClassName: 'md:pr-14 md:pl-14',
  },
  {
    title: 'Montamos',
    text: 'Lo fabricamos en nuestro taller, lo llevamos y lo montamos nosotros mismos, en cualquier punto de España.',
    stage: 'build',
    className: 'md:col-span-5 md:-ml-10 md:mt-8',
    sheetClassName: 'rotate-[-0.6deg]',
    textClassName: 'md:pl-12',
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
      className={`border-y border-ink/10 ${BLUEPRINT_BG} ${level === 'h1' ? 'pt-sheet pb-24' : 'py-24 lg:pt-36 lg:compact:pt-24'} lg:pb-36 lg:compact:pb-24`}
    >
      <Container>
        <SectionHeading
          id="como-trabajamos-titulo"
          level={level}
          title="Medimos, diseñamos y montamos nosotros"
          intro="Entre tu idea y el mueble terminado no hay nadie más: quien te toma las medidas es quien lo dibuja, lo fabrica y te lo monta, estés donde estés."
        />
        <ol className="mt-16 grid gap-14 md:grid-cols-14 md:gap-x-0 md:gap-y-8 lg:mt-20 lg:compact:mt-14">
          {STEPS.map((step) => (
            <ProcessStep key={step.title} {...step} headingLevel={level === 'h1' ? 'h2' : 'h3'} />
          ))}
        </ol>
      </Container>
    </section>
  )
}
