import { PageMeta } from '@/components/layout/PageMeta'
import { SheetCta } from '@/components/sections/SheetCta'
import { FaqSection } from '@/components/sections/FaqSection'
import { ProcessSection } from '@/components/sections/ProcessSection'

/** Página Cómo trabajamos: los tres pasos (planos que se dibujan) y preguntas frecuentes. */
export default function ProcessPage() {
  return (
    <>
      <PageMeta
        title="Cómo trabajamos · Carpintería y Decoración"
        description="Medimos, diseñamos y montamos nosotros mismos, sin intermediarios y en toda España. Presupuesto gratis."
      />
      <ProcessSection level="h1" />
      <FaqSection />
      <SheetCta
        title="Pide tu presupuesto y empezamos a medir."
        rows={[
          { label: 'Presupuesto', value: 'Gratis' },
          { label: 'Medición', value: 'En tu casa o negocio', note: 'La hacemos nosotros.' },
          { label: 'Zona', value: 'Toda España', note: 'Lo llevamos y lo montamos.' },
        ]}
      />
    </>
  )
}
