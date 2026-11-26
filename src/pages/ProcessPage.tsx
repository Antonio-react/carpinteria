import { PageMeta } from '@/components/layout/PageMeta'
import { SheetCta } from '@/components/sections/SheetCta'
import { FaqSection } from '@/components/sections/FaqSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { PAGES } from '@/data/pages'

/** Página Cómo trabajamos: los tres pasos (planos que se dibujan) y preguntas frecuentes. */
export default function ProcessPage() {
  return (
    <>
      <PageMeta title={PAGES.process.title} description={PAGES.process.description} />
      <ProcessSection level="h1" />
      <FaqSection />
      <SheetCta
        title="Pide tu presupuesto y empezamos a medir"
        rows={[
          // Qué pasa con el encargo (no repite la ficha de Inicio: presupuesto y zona ya están allí).
          { label: 'Medición', value: 'Con metro y nivel', note: 'Nada de medidas a ojo' },
          { label: 'Plano', value: 'Antes de cortar', note: 'Lo revisas y lo cambiamos contigo' },
          { label: 'Montaje', value: 'Nosotros mismos', note: 'Sin subcontratas' },
        ]}
      />
    </>
  )
}
