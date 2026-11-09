import type { CSSProperties, KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { CategoryPills } from '@/components/gallery/CategoryPills'
import { FolderCard } from '@/components/gallery/FolderCard'
import { ArrowButton } from '@/components/ui/ArrowButton'
import { CATEGORIES, categoryPath } from '@/data/categories'
import { useCarousel } from '@/hooks/useCarousel'
import { useSwipe } from '@/hooks/useSwipe'
import { useTilt } from '@/hooks/useTilt'

/**
 * Carrusel "coverflow" de categorías: sirve solo para ELEGIR categoría.
 * - Tarjeta central grande (enlace a la página de la categoría); laterales inclinadas en perspectiva.
 * - Píldoras arriba. Flechas: a los lados de la tarjeta central en móvil/tableta, debajo en escritorio.
 * - Pantallas intermedias (variante "compact" a partir de lg: portátiles y tabletas apaisadas): tarjeta
 *   más pequeña, calculada con el alto de la pantalla, y flechas a los extremos, fuera de las tarjetas,
 *   para que todo quepa a la vista sin tener que bajar para llegar a ellas.
 * - Móvil: deslizamiento con el dedo. Escritorio: flechas (botones o ← → del teclado), sin arrastre con ratón.
 * - Sin rueda del ratón (evita "scroll jacking").
 * - En móvil se ven 3 tarjetas: la central y parte de las dos laterales.
 * - Solo la central se inclina hacia el cursor (useTilt).
 */
function cardStyle(offset: number): CSSProperties {
  const distance = Math.abs(offset)
  if (distance > 2) return { transform: 'translateX(-50%) scale(0.5)', opacity: 0, pointerEvents: 'none' }
  const side = Math.sign(offset)
  const x = distance === 0 ? 0 : side * (distance === 1 ? 74 : 128)
  const rotate = side * (distance === 1 ? -34 : -44)
  const scale = distance === 0 ? 1 : distance === 1 ? 0.84 : 0.7
  return {
    transform: `translateX(-50%) translateX(${x}%) translateZ(${-distance * 120}px) rotateY(${rotate}deg) scale(${scale})`,
    opacity: distance === 2 ? 0.45 : 1,
    zIndex: 10 - distance,
  }
}

interface CategoryCarouselProps {
  /** light = sobre fondo claro (Inicio) · dark = sobre la exposición oscura (Trabajos). */
  tone?: 'light' | 'dark'
}

export function CategoryCarousel({ tone = 'light' }: CategoryCarouselProps) {
  const { index, goTo, next, previous, offsetOf } = useCarousel(CATEGORIES.length)
  const swipe = useSwipe(next, previous)
  const tilt = useTilt<HTMLAnchorElement>(true)
  const current = CATEGORIES[index]

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previous()
    }
  }

  return (
    <div>
      <CategoryPills names={CATEGORIES.map((category) => category.name)} activeIndex={index} onSelect={goTo} tone={tone} />

      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Categorías de trabajos"
        onKeyDown={onKeyDown}
        className="relative mt-14 overflow-x-clip pt-8 [--card-w:min(60vw,22rem)] md:[--card-w:min(34vw,22rem)] lg:[--card-w:24rem] lg:compact:[--card-w:min(20rem,calc((100svh-16rem)*0.8),28vw)] phone-land:mt-8! phone-land:pt-4! phone-land:[--card-w:min(15rem,calc((100svh-6rem)*0.8))]!"
      >
        <div
          className="relative mx-auto aspect-[4/5] w-(--card-w) touch-pan-y select-none perspective-[1400px] [transform-style:preserve-3d]"
          onPointerDown={swipe.onPointerDown}
          onPointerUp={swipe.onPointerUp}
          onPointerCancel={swipe.onPointerCancel}
          onClickCapture={swipe.onClickCapture}
        >
          {CATEGORIES.map((category, itemIndex) => {
            const offset = offsetOf(itemIndex)
            const active = offset === 0
            const card = (
              <FolderCard
                name={category.name}
                tagline={category.tagline}
                cover={category.cover}
                active={active}
              />
            )
            return (
              <div
                key={category.slug}
                className="absolute top-0 left-1/2 h-full w-full transition-[transform,opacity] duration-500 ease-(--ease-in-out-strong) motion-reduce:transition-none"
                style={cardStyle(offset)}
                aria-hidden={!active}
              >
                {active ? (
                  <Link
                    ref={tilt.ref}
                    to={categoryPath(category)}
                    aria-label={`Ver trabajos de ${category.name}`}
                    onPointerMove={tilt.onPointerMove}
                    onPointerLeave={tilt.onPointerLeave}
                    draggable={false}
                    className="block size-full rounded-[20px] transition-transform duration-200 ease-out [--rx:0deg] [--ry:0deg] [transform:rotateX(var(--rx))_rotateY(var(--ry))]"
                  >
                    {card}
                  </Link>
                ) : (
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => goTo(itemIndex)}
                    className="block size-full cursor-pointer"
                    aria-label={`Ver ${category.name}`}
                  >
                    {card}
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Flechas: en móvil y tableta a los lados de la tarjeta central; en escritorio, juntas debajo;
            en pantallas intermedias, en los extremos (fuera de las tarjetas). */}
        <div className="lg:mt-12 lg:flex lg:justify-center lg:gap-3 lg:compact:mt-0 lg:compact:block">
          <ArrowButton
            direction="previous"
            onClick={previous}
            label="Categoría anterior"
            className="absolute top-1/2 left-[max(0.25rem,calc(50%-var(--card-w)/2-4.25rem))] -translate-y-1/2 lg:static lg:translate-y-0 lg:compact:absolute lg:compact:left-0 lg:compact:-translate-y-1/2"
          />
          <ArrowButton
            direction="next"
            onClick={next}
            label="Categoría siguiente"
            className="absolute top-1/2 right-[max(0.25rem,calc(50%-var(--card-w)/2-4.25rem))] -translate-y-1/2 lg:static lg:translate-y-0 lg:compact:absolute lg:compact:right-0 lg:compact:-translate-y-1/2"
          />
        </div>

        <p className="sr-only" aria-live="polite">
          {current?.name}, {index + 1} de {CATEGORIES.length}
        </p>
      </div>
    </div>
  )
}
