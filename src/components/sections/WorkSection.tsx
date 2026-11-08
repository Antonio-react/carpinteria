import { lazy } from 'react'
import { Link } from 'react-router'
import { Container } from '@/components/ui/Container'
import { LazySection } from '@/components/ui/LazySection'
import { SectionHeading } from '@/components/ui/SectionHeading'

const CategoryCarousel = lazy(() => import('@/components/gallery/CategoryCarouselLazy'))

interface WorkSectionProps {
  /** En la página de Trabajos el título es el h1; en inicio, un h2 con enlace a la página. */
  level?: 'h1' | 'h2'
}

/**
 * Trabajos: el carrusel de categorías (se carga cuando el usuario se acerca).
 * En la página Trabajos (h1) es una "exposición": fondo oscuro como el hero y una luz cenital
 * sobre la tarjeta central, como un mueble expuesto en tienda. En Inicio, sobre claro.
 */
export function WorkSection({ level = 'h2' }: WorkSectionProps) {
  const isPage = level === 'h1'
  const tone = isPage ? 'dark' : 'light'
  return (
    <section
      aria-labelledby="trabajos-titulo"
      className={`relative isolate overflow-x-clip ${isPage ? 'bg-night pt-36 pb-28 text-name lg:pt-44 lg:pb-36' : 'bg-bone py-24 lg:py-36'}`}
    >
      {isPage && (
        <>
          {/* Luz cenital sobre el carrusel y su reflejo en el "suelo" de la exposición */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[38%] -z-10 h-[70%] -translate-y-1/2 bg-[radial-gradient(ellipse_45%_55%_at_50%_45%,rgb(233_226_214/0.16),transparent_70%)]" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-16 -z-10 h-24 bg-[radial-gradient(ellipse_35%_50%_at_50%_50%,rgb(233_226_214/0.07),transparent_70%)]" />
        </>
      )}
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            id="trabajos-titulo"
            level={level}
            tone={tone}
            title={
              <>
                Elige un tipo de trabajo y mira lo que hemos hecho.
              </>
            }
          />
          {!isPage && (
            <Link to="/trabajos" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              Ver todos los trabajos
            </Link>
          )}
        </div>
        <LazySection id="carrusel-trabajos" minHeight="36rem" className="mt-12">
          <CategoryCarousel tone={tone} />
        </LazySection>
      </Container>
    </section>
  )
}
