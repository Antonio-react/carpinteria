import { Container } from '@/components/ui/Container'
import { PencilUnderline } from '@/components/ui/PencilUnderline'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpecSheet, type SpecRow } from '@/components/ui/SpecSheet'
import { siteConfig } from '@/config/site'

const { localidad, provincia } = siteConfig.direccion

/** Los datos concretos que más pesan al elegir carpintero, en forma de ficha de taller. */
const SPECS: readonly SpecRow[] = [
  { label: 'Oficio', value: 'Ebanistería y carpintería', note: 'Padre e hijo, más de 40 años en el oficio.' },
  { label: 'Zona', value: 'Toda España', note: 'Lo llevamos y lo montamos nosotros.' },
  { label: 'Presupuesto', value: 'Gratis' },
  { label: 'Taller', value: `${localidad} (${provincia})` },
]

/**
 * Primera sección tras el hero: quiénes son y, al lado, la ficha con los datos concretos
 * (es lo primero que se ve cuando la página sube por encima del hero).
 */
export function IntroSection() {
  return (
    <section aria-labelledby="quienes-somos" className="py-24 lg:py-36 lg:compact:py-24">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <SectionHeading
            id="quienes-somos"
            title={
              <>
                Hacemos en madera lo que tienes en la <PencilUnderline>cabeza</PencilUnderline>.
              </>
            }
          />
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-pretty text-muted">
            Somos una empresa familiar de ebanistería y carpintería. No trabajamos con catálogo: escuchamos tu idea,
            medimos el espacio, la diseñamos contigo y la montamos nosotros, sin intermediarios. Trabajamos para
            particulares y para empresas.
          </p>
        </div>
        <SpecSheet title="Ficha del taller" rows={SPECS} className="lg:col-span-5 lg:self-center" />
      </Container>
    </section>
  )
}
