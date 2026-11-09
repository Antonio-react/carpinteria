import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PinnedNote } from '@/components/ui/PinnedNote'
import { siteConfig } from '@/config/site'
import { QUOTE_PATH } from '@/data/navigation'

interface NoteCtaProps {
  title: string
  text: string
}

/**
 * Cierre de página con una nota del taller pegada en la pared (en vez de la franja oscura de
 * siempre): cada página termina distinto. Va sobre claro, a continuación de la lámina de la página.
 */
export function NoteCta({ title, text }: NoteCtaProps) {
  return (
    <section aria-labelledby="cta-titulo" className="bg-bone pb-28 lg:pb-36 lg:compact:pb-28">
      <Container className="grid items-center gap-10 border-t border-ink/10 pt-20 lg:grid-cols-12">
        <PinnedNote tilt={-2.5} signature={`Taller de ${siteConfig.direccion.localidad}`} className="max-w-lg lg:col-span-7">
          <h2 id="cta-titulo" className="text-3xl leading-tight text-ink sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 font-sans text-base text-muted not-italic">{text}</p>
        </PinnedNote>
        <div className="lg:col-span-5 lg:justify-self-end">
          <Button to={QUOTE_PATH} withArrow>
            Pedir presupuesto
          </Button>
        </div>
      </Container>
    </section>
  )
}
