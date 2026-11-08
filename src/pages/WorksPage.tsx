import { CategoryCard } from '@/components/gallery/CategoryCard'
import { PageMeta } from '@/components/layout/PageMeta'
import { CtaBand } from '@/components/sections/CtaBand'
import { WorkSection } from '@/components/sections/WorkSection'
import { Container } from '@/components/ui/Container'
import { CATEGORIES } from '@/data/categories'

/** Página Trabajos: el carrusel de carpetas y, debajo, todas las categorías a la vista. */
export default function WorksPage() {
  return (
    <>
      <PageMeta
        title="Trabajos · Carpintería y Decoración"
        description="Armarios, puertas, suelos, cocinas, muebles de salón y otros trabajos en madera hechos a medida por nuestro taller familiar."
      />
      <WorkSection level="h1" />
      <section
        aria-labelledby="todas-titulo"
        data-curtain
        className="relative z-10 -mt-8 rounded-t-[28px] bg-bone pt-4 pb-24 shadow-[0_-24px_60px_rgb(0_0_0/0.35)] lg:pb-32 lg:compact:pb-24"
      >
        <Container>
          <h2 id="todas-titulo" className="pt-12 text-2xl font-medium tracking-[-0.02em] [font-stretch:105%]">
            Todos los trabajos
          </h2>
          {/* Móvil: 2 columnas (menos scroll); escritorio: 3. */}
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:mt-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <CategoryCard category={category} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand title="Elige lo que te guste y lo adaptamos a tu casa." text="Al pedir presupuesto puedes adjuntar fotos de referencia." />
    </>
  )
}
