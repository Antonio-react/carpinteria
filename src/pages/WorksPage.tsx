import { CategoryCard } from '@/components/gallery/CategoryCard'
import { PageMeta } from '@/components/layout/PageMeta'
import { NoteCta } from '@/components/sections/NoteCta'
import { WorkSection } from '@/components/sections/WorkSection'
import { Container } from '@/components/ui/Container'
import { DropOnScroll } from '@/components/ui/DropOnScroll'
import { cardSizeSpec } from '@/data/cardSizes'
import { CATEGORIES } from '@/data/categories'
import { ALL_WORKS_ID } from '@/data/categoryOrigin'
import { PAGES } from '@/data/pages'

/** Proporciones que van alternando los bocetos de las categorías sin foto, para que no salgan todas iguales. */
const PLACEHOLDER_SHAPES = ['aspect-3/4', 'aspect-5/4', 'aspect-4/5', 'aspect-square'] as const

/** Giro con el que cae cada carpeta (alternando el lado), como si se dejaran sobre la mesa a mano. */
const FOLDER_TILTS = [-5, 4, -3, 5, -4, 3] as const

/**
 * Postura en la que se queda cada carpeta tras caer: algo torcida (1–2°) y a alturas distintas, como
 * fotos dejadas sobre la mesa del taller (px en escritorio; en móvil, la mitad).
 */
const FOLDER_RESTS = [
  { rotate: -1.6, offsetY: 0 },
  { rotate: 1.2, offsetY: 22 },
  { rotate: -0.8, offsetY: -6 },
  { rotate: 1.8, offsetY: 14 },
  { rotate: -1.3, offsetY: -4 },
  { rotate: 0.9, offsetY: 26 },
] as const

/**
 * Columna en la que empieza cada tarjeta dentro de su fila (para que las de una fila caigan una tras
 * otra), sabiendo cuántas columnas ocupa cada una: no hay un número fijo de tarjetas por fila.
 */
function columnsInRow(spans: readonly number[], columns: number): number[] {
  let used = 0
  return spans.map((span) => {
    if (used + span > columns) used = 0
    const position = used
    used += span
    return position
  })
}

const SPECS = CATEGORIES.map((category) => cardSizeSpec(category))
const MOBILE_COLUMNS = columnsInRow(SPECS.map((spec) => spec.span.mobile), 2)
const DESKTOP_COLUMNS = columnsInRow(SPECS.map((spec) => spec.span.desktop), 6)

/** Página Trabajos:el carrusel de carpetas y, debajo, todas las categorías a la vista. */
export default function WorksPage() {
  return (
    <>
      <PageMeta title={PAGES.works.title} description={PAGES.works.description} />
      <WorkSection level="h1" />
      <section
        id={ALL_WORKS_ID}
        aria-labelledby="todas-titulo"
        data-curtain
        className="relative z-10 -mt-8 scroll-mt-8 rounded-t-[28px] bg-bone pt-4 pb-24 shadow-[0_-24px_60px_rgb(0_0_0/0.35)] lg:pb-32 lg:compact:pb-24"
      >
        <Container>
          <h2 id="todas-titulo" className="pt-12 text-4xl font-medium tracking-[-0.02em] font-stretch-105%">
            Todos los trabajos
          </h2>
          {/* Cada tarjeta con la misma portada que el carrusel, en filas (no en columnas como la galería) para que
              se lean en orden alfabético de izquierda a derecha. La foto es la carpeta: cada tarjeta toma la forma
              de su foto y, si es apaisada, se ensancha (cardSizes.ts). Lo normal es 2 por fila en móvil y 3 en
              escritorio, sin número fijo: las filas que quedan a medias se centran. */}
          <ul className="mt-8 flex flex-wrap items-start justify-center gap-x-(--gap) gap-y-10 [--gap:--spacing(3)] sm:mt-10 sm:gap-y-14 sm:[--gap:--spacing(6)] lg:[--gap:--spacing(8)]">
            {CATEGORIES.map((category, index) => (
              // Al bajar del carrusel, las carpetas caen y se quedan algo torcidas, fila a fila.
              <DropOnScroll
                key={category.slug}
                tilt={FOLDER_TILTS[index % FOLDER_TILTS.length]}
                rest={FOLDER_RESTS[index % FOLDER_RESTS.length]}
                column={{ mobile: MOBILE_COLUMNS[index], desktop: DESKTOP_COLUMNS[index] / 2 }}
                className={SPECS[index].className}
              >
                <CategoryCard category={category} placeholderShape={PLACEHOLDER_SHAPES[index % PLACEHOLDER_SHAPES.length]} />
              </DropOnScroll>
            ))}
          </ul>
        </Container>
      </section>
      <NoteCta title="Cada encargo empieza desde cero" text="Cuéntanos el tuyo. Al pedir presupuesto puedes adjuntar fotos de referencia." />
    </>
  )
}
