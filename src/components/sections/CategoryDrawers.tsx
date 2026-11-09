import { Link } from 'react-router'
import woodTexture from '@/assets/textures/footer-wood-1000.webp'
import { Container } from '@/components/ui/Container'
import { PencilSketch } from '@/components/ui/PencilSketch'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CATEGORIES, categoryPath } from '@/data/categories'
import { sketchFor } from '@/data/sketches'

/**
 * Inicio: los tipos de trabajo como una cajonera de taller, de madera de verdad: la estructura usa la
 * foto de madera del pie y los frentes son de roble claro con su veta. Cada cajón lleva su etiqueta
 * numerada en un portaetiquetas de latón, un boceto pequeño y su tirador; al pasar el ratón sale un poco.
 * Sustituye al carrusel que había aquí, que repetía exactamente el de la página Trabajos.
 */
export function CategoryDrawers() {
  return (
    <section aria-labelledby="trabajos-titulo" className="bg-bone py-24 lg:py-36 lg:compact:py-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading id="trabajos-titulo" title="Abre el cajón que quieras y mira lo que guarda dentro." />
          <Link to="/trabajos" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            Ver todos los trabajos
          </Link>
        </div>

        {/* La cajonera: un mueble de roble con los cajones dentro. */}
        <ul
          style={{ backgroundImage: `linear-gradient(rgb(40 24 12 / 0.25), rgb(40 24 12 / 0.25)), url(${woodTexture})` }}
          className="mt-12 grid grid-cols-1 gap-2.5 rounded-[4px] bg-cover bg-center p-3.5 shadow-[0_30px_60px_-30px_rgb(28_25_22/0.6)] sm:grid-cols-2 sm:p-4 lg:grid-cols-3"
        >
          {CATEGORIES.map((category, index) => (
            <li key={category.slug}>
              <Link
                to={categoryPath(category)}
                className="group relative flex h-full min-h-40 items-center gap-4 rounded-[2px] bg-[#d9b98e] bg-[repeating-linear-gradient(90deg,rgb(140_90_45/0.07)_0_1px,transparent_1px_7px),repeating-linear-gradient(90deg,rgb(110_70_35/0.06)_0_3px,transparent_3px_23px),linear-gradient(180deg,rgb(255_245_225/0.35),rgb(120_80_40/0.12))] px-5 py-5 shadow-[inset_0_1px_0_rgb(255_240_215/0.5),inset_0_-3px_0_rgb(60_35_15/0.18)] transition-[transform,box-shadow] duration-300 ease-(--ease-out-strong) hover:-translate-y-1 hover:shadow-[inset_0_-3px_0_rgb(28_25_22/0.08),0_14px_24px_-12px_rgb(0_0_0/0.55)] focus-visible:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <div className="min-w-0 flex-1">
                  {/* Portaetiquetas de latón con la etiqueta escrita */}
                  <p className="inline-flex items-baseline gap-2 rounded-[2px] border border-[#a88b52] bg-[#fbf8f0] px-2.5 py-1 shadow-[inset_0_0_0_2px_rgb(200_170_110/0.35)]">
                    <span className="text-[11px] font-medium tracking-[0.18em] text-pencil">{String(index + 1).padStart(2, '0')}</span>
                    <span className="text-lg font-medium tracking-[-0.01em] text-ink [font-stretch:105%]">{category.name}</span>
                  </p>
                  <p className="mt-3 text-left text-sm text-ink/70">{category.tagline}</p>
                  {/* Tirador */}
                  <span aria-hidden="true" className="mt-4 block h-2 w-16 rounded-full bg-linear-to-b from-[#c9b48a] to-[#8f7a4f] shadow-[0_2px_3px_rgb(0_0_0/0.25)]" />
                </div>
                <PencilSketch sketch={sketchFor(category.slug)} seed={index + 3} className="h-28 w-auto shrink-0 opacity-75 mix-blend-multiply transition-opacity group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
