import { CategoryCard } from '@/components/gallery/CategoryCard'
import { PageMeta } from '@/components/layout/PageMeta'
import { NoteCta } from '@/components/sections/NoteCta'
import { WorkSection } from '@/components/sections/WorkSection'
import { Container } from '@/components/ui/Container'
import { DropOnScroll } from '@/components/ui/DropOnScroll'
import { CATEGORIES } from '@/data/categories'
import { ALL_WORKS_ID } from '@/data/categoryOrigin'

/** Proporciones que van alternando los bocetos de las categorías sin foto, para que no salgan todas iguales. */
const PLACEHOLDER_SHAPES = ['aspect-3/4', 'aspect-5/4', 'aspect-4/5', 'aspect-square'] as const

/** Giro con el que cae cada carpeta (alternando el lado), como si se dejaran sobre la mesa a mano. */
const FOLDER_TILTS = [-5, 4, -3, 5, -4, 3] as const

/** Página Trabajos:el carrusel de carpetas y, debajo, todas las categorías a la vista. */
export default function WorksPage() {
  return (
    <>
      <PageMeta
        title="Trabajos · Carpintería y Decoración"
        description="Armarios, puertas, suelos, cocinas, muebles de salón y otros trabajos en madera hechos a medida por nuestro taller familiar."
      />
      <WorkSection level="h1" />
      <section
        id={ALL_WORKS_ID}
        aria-labelledby="todas-titulo"
        data-curtain
        className="relative z-10 -mt-8 scroll-mt-8 rounded-t-[28px] bg-bone pt-4 pb-24 shadow-[0_-24px_60px_rgb(0_0_0/0.35)] lg:pb-32 lg:compact:pb-24"
      >
        <Container>
          <h2 id="todas-titulo" className="pt-12 text-2xl font-medium tracking-[-0.02em] font-stretch-105%">
            Todos los trabajos
          </h2>
          {/* Cada tarjeta con la misma portada que el carrusel, en filas (no en columnas como la galería) para que
              se lean en orden alfabético de izquierda a derecha. Móvil: 2 columnas (menos scroll); escritorio: 3. */}
          <ul className="mt-8 grid grid-cols-2 items-start gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              // Al bajar del carrusel, las carpetas caen y se colocan en su sitio, fila a fila.
              <DropOnScroll key={category.slug} tilt={FOLDER_TILTS[index % FOLDER_TILTS.length]} column={{ mobile: index % 2, desktop: index % 3 }}>
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
