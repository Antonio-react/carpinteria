import { Link, useParams } from 'react-router'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { PageMeta } from '@/components/layout/PageMeta'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { CATEGORIES, categoryPath, findCategory } from '@/data/categories'
import { QUOTE_PATH } from '@/data/navigation'
import NotFoundPage from '@/pages/NotFoundPage'

/** Página propia de cada categoría (/trabajos/:slug): descripción general y galería simple. */
export default function CategoryPage() {
  const { slug } = useParams()
  const category = findCategory(slug)
  if (!category) return <NotFoundPage />

  return (
    <>
      <PageMeta title={`${category.name} a medida · Carpintería y Decoración`} description={category.seoDescription} />
      <section aria-labelledby="categoria-titulo" className="pt-32 pb-20 lg:pt-40 lg:compact:pt-32 lg:pb-28 lg:compact:pb-20">
        <Container>
          <nav aria-label="Ruta" className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="inline-flex min-h-11 items-center hover:text-ink">
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link to="/trabajos" className="inline-flex min-h-11 items-center hover:text-ink">
                  Trabajos
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-ink">
                {category.name}
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <h1 id="categoria-titulo" className="text-5xl leading-none font-medium tracking-[-0.03em] [font-stretch:110%] sm:text-6xl lg:col-span-6 lg:text-7xl lg:compact:text-6xl">
              {category.name}
            </h1>
            <p className="max-w-xl text-left text-lg leading-relaxed text-pretty text-muted lg:col-span-6 lg:pt-3">{category.description}</p>
          </div>

          <div className="mt-14">
            <GalleryGrid category={category} />
          </div>

          <div className="mt-20 grid gap-10 border-t border-ink/10 pt-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-medium tracking-[-0.02em] [font-stretch:105%]">Hacemos el tuyo a medida.</h2>
              <p className="mt-3 text-muted">Cuéntanos cómo es tu espacio y te preparamos el presupuesto sin coste.</p>
              <div className="mt-6">
                <Button to={QUOTE_PATH} withArrow>
                  Pedir presupuesto
                </Button>
              </div>
            </div>
            <nav aria-label="Otras categorías" className="lg:col-span-5">
              <h2 className="text-xs tracking-[0.2em] text-muted uppercase">Otros tipos de trabajo</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {CATEGORIES.filter((other) => other.slug !== category.slug).map((other) => (
                  <li key={other.slug}>
                    <Link
                      to={categoryPath(other)}
                      className="inline-flex min-h-11 items-center rounded-full border border-ink/15 px-5 text-sm text-ink/80 transition-colors hover:border-ink/40 hover:text-ink"
                    >
                      {other.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </Container>
      </section>
    </>
  )
}
