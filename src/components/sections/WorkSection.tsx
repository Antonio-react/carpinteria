import { Link } from 'react-router'
import { CategoryCarousel } from '@/components/gallery/CategoryCarousel'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'

interface WorkSectionProps {
  /** En la página de Trabajos el título es el h1; en inicio, un h2 con enlace a la página. */
  level?: 'h1' | 'h2'
}

/**
 * Trabajos: el carrusel de categorías. Se monta directamente con la página: es lo primero que se ve en
 * Trabajos (antes iba en una sección diferida y salía la sierra un momento aunque ya estuviera
 * descargado), y su código ya llega dentro del de la página, que se descarga aparte y por adelantado.
 * En la página Trabajos (h1) es una "exposición": fondo oscuro como el hero y una luz cenital
 * sobre la tarjeta central, como un mueble expuesto en tienda. En Inicio, sobre claro.
 */
export function WorkSection({ level = 'h2' }: WorkSectionProps) {
  const isPage = level === 'h1'
  const tone = isPage ? 'dark' : 'light'
  return (
    <section
      aria-labelledby="trabajos-titulo"
      className={`relative isolate overflow-x-clip ${isPage ? 'bg-night pt-sheet pb-28 text-name lg:pb-36 lg:compact:pb-24' : 'bg-bone py-24 lg:py-36 lg:compact:py-24'}`}
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
            // Móvil: en dos líneas. Desde 640px, en UNA: la letra se ajusta al ancho (sin pasar de la escala
            // normal), así no salta de 1 a 2 líneas y vuelta a 1 al cambiar de tamaño de letra.
            className="sm:max-w-none"
            titleSize="text-4xl sm:text-[min(3rem,calc((100vw-3rem)/15.2))] lg:text-6xl lg:compact:text-5xl"
            title={
              <>
                Lo que ha salido <br className="sm:hidden" />
                de nuestro taller
              </>
            }
          />
          {!isPage && (
            <Link to="/trabajos" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
              Ver todos los trabajos
            </Link>
          )}
        </div>
        <div id="carrusel-trabajos" className="mt-12">
          <CategoryCarousel tone={tone} />
        </div>
      </Container>
    </section>
  )
}
