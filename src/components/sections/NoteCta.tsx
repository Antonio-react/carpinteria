import { Container } from '@/components/ui/Container'
import { PinnedNote } from '@/components/ui/PinnedNote'
import { siteConfig } from '@/config/site'

interface NoteCtaProps {
  title: string
  text: string
}

/**
 * Cierre de página con una nota del taller pegada en la pared (en vez de la franja oscura de
 * siempre): cada página termina distinto. Va sobre claro, a continuación de la lámina de la página.
 * Centrada y SIN botón: en pantallas grandes la barra de navegación (fija) ya lleva "Pedir
 * presupuesto" y salían dos botones iguales uno encima del otro.
 */
export function NoteCta({ title, text }: NoteCtaProps) {
  return (
    <section aria-labelledby="cta-titulo" className="bg-bone pb-28 lg:pb-36 lg:compact:pb-28">
      <Container className="flex justify-center border-t border-ink/10 pt-20">
        <PinnedNote tilt={-2.5} signature={`Taller de ${siteConfig.direccion.localidad}`} className="max-w-lg">
          <h2 id="cta-titulo" className="text-3xl leading-tight text-ink sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 font-sans text-base text-muted not-italic">{text}</p>
        </PinnedNote>
      </Container>
    </section>
  )
}
