import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { QUOTE_PATH } from '@/data/navigation'

interface CtaBandProps {
  title: string
  text: string
}

/**
 * Franja oscura que lleva a la página de contacto (al final de inicio y de otras páginas).
 * Cada página pone su propio texto: la frase "Cuéntanos tu idea y la hacemos realidad." es la
 * cabecera del formulario y solo va en Contacto, para no repetirla en todas las páginas.
 */
export function CtaBand({ title, text }: CtaBandProps) {
  return (
    <section aria-labelledby="cta-titulo" className="bg-night py-20 text-name lg:py-28">
      <Container className="grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 id="cta-titulo" className="text-4xl leading-[1.02] font-medium tracking-[-0.025em] text-balance [font-stretch:105%] sm:text-5xl lg:text-6xl">
            {title}
          </h2>
          <p className="mt-5 max-w-xl text-left text-lg text-name/70">{text}</p>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end">
          <Button to={QUOTE_PATH} tone="light" withArrow>
            Pedir presupuesto
          </Button>
        </div>
      </Container>
    </section>
  )
}
