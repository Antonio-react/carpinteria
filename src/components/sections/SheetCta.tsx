import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SpecSheet, type SpecRow } from '@/components/ui/SpecSheet'
import { QUOTE_PATH } from '@/data/navigation'

interface SheetCtaProps {
  title: string
  rows: readonly SpecRow[]
}

/**
 * Cierre de página como la última lámina de un plano: marco doble de dibujo técnico, el título y,
 * al lado, el cajetín con los datos del encargo. Para páginas con estética de plano (Cómo trabajamos);
 * cada página termina distinto (ver CtaBand y NoteCta).
 */
export function SheetCta({ title, rows }: SheetCtaProps) {
  return (
    <section
      aria-labelledby="cta-titulo"
      className="bg-paper bg-[linear-gradient(to_right,rgb(28_25_22/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(28_25_22/0.05)_1px,transparent_1px)] bg-size-[24px_24px] py-20 lg:py-28 lg:compact:py-20"
    >
      <Container>
        {/* Marco doble de lámina */}
        <div className="border-2 border-ink/70 p-1.5">
          <div className="grid gap-10 border border-ink/40 p-6 sm:p-10 lg:grid-cols-12 lg:items-end lg:p-14">
            <div className="lg:col-span-7">
              <h2 id="cta-titulo" className="text-4xl leading-[1.04] font-medium tracking-[-0.025em] text-balance [font-stretch:105%] sm:text-5xl">
                {title}
              </h2>
              <Button to={QUOTE_PATH} withArrow className="mt-8">
                Pedir presupuesto
              </Button>
            </div>
            <SpecSheet title="Encargo" rows={rows} className="bg-paper lg:col-span-5" />
          </div>
        </div>
      </Container>
    </section>
  )
}
