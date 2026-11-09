import { Hero } from '@/components/hero/Hero'
import { PageMeta } from '@/components/layout/PageMeta'
import { CtaBand } from '@/components/sections/CtaBand'
import { IntroSection } from '@/components/sections/IntroSection'
import { PlanToRealSection } from '@/components/sections/PlanToRealSection'
import { WorkSection } from '@/components/sections/WorkSection'
import { ScrollMarquee } from '@/components/ui/ScrollMarquee'
import { siteConfig } from '@/config/site'
import type { CSSProperties } from 'react'
import { CURTAIN_SCREENS, CURTAIN_SCREENS_MOBILE } from '@/hooks/useHeroParallax'

/**
 * Inicio. El hero se queda fijo (sticky) mientras el mueble se abre y, cuando ya está abierto del
 * todo (espaciador de CURTAIN_SCREENS, ver useHeroParallax), el resto de la página sube por encima
 * como una cortina (data-curtain).
 */
export default function HomePage() {
  return (
    <>
      <PageMeta
        title="Carpintería y Decoración · Muebles a medida en toda España"
        description="Ebanistería y carpintería familiar con más de 40 años de experiencia. Medimos, diseñamos y montamos muebles a medida en toda España. Presupuesto gratis."
      />
      <Hero />
      {/* Tramo de scroll en el que el mueble se abre entero antes de que suba la página. */}
      {/* Móvil (y móvil apaisado): más corto, la página sube antes (ver CURTAIN_SCREENS_MOBILE). */}
      <div
        aria-hidden="true"
        className="h-(--curtain-mobile) motion-reduce:hidden md:h-(--curtain) phone-land:h-(--curtain-mobile)!"
        style={{ '--curtain': `${CURTAIN_SCREENS * 100}svh`, '--curtain-mobile': `${CURTAIN_SCREENS_MOBILE * 100}svh` } as CSSProperties}
      />
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
