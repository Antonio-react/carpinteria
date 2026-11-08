import { Hero } from '@/components/hero/Hero'
import { PageMeta } from '@/components/layout/PageMeta'
import { CtaBand } from '@/components/sections/CtaBand'
import { IntroSection } from '@/components/sections/IntroSection'
import { PlanToRealSection } from '@/components/sections/PlanToRealSection'
import { WorkSection } from '@/components/sections/WorkSection'
import { ScrollMarquee } from '@/components/ui/ScrollMarquee'
import { siteConfig } from '@/config/site'

/**
 * Inicio. El hero se queda fijo (sticky) mientras se "desmonta" (espaciador de 75svh, ver
 * useHeroParallax) y después el resto de la página sube por encima como una cortina (data-curtain).
 */
export default function HomePage() {
  return (
    <>
      <PageMeta
        title="Carpintería y Decoración · Muebles a medida en toda España"
        description="Carpintería y ebanistería familiar con más de 40 años de experiencia. Medimos, diseñamos y montamos muebles a medida en toda España. Presupuesto gratis."
      />
      <Hero />
      {/* Tramo de scroll en el que el hero se desmonta antes de que suba la página. */}
      <div aria-hidden="true" className="h-[75svh] motion-reduce:hidden" />
      <div data-curtain className="relative z-10 rounded-t-[28px] bg-bone shadow-[0_-24px_60px_rgb(0_0_0/0.35)]">
        <IntroSection />
        <PlanToRealSection />
        <ScrollMarquee primary={siteConfig.lema} secondary={siteConfig.nombre} />
        <WorkSection />
        <CtaBand title="Mándanos tu idea, aunque sea un boceto." text="En el formulario puedes adjuntar planos, fotos o un dibujo hecho a mano." />
      </div>
    </>
  )
}
