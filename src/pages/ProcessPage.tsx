import { PageMeta } from '@/components/layout/PageMeta'
import { CtaBand } from '@/components/sections/CtaBand'
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
      <CtaBand title="Pide tu presupuesto y empezamos a medir." text="El presupuesto es gratis." />
    </>
  )
}
