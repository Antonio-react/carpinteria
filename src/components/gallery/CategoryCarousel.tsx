import { useEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { CategoryPills } from '@/components/gallery/CategoryPills'
import { FolderCard } from '@/components/gallery/FolderCard'
import { ArrowButton } from '@/components/ui/ArrowButton'
import { CATEGORIES, categoryPath } from '@/data/categories'
import { readCarouselFocus, type CategoryLinkState } from '@/data/categoryOrigin'
import { useCarousel } from '@/hooks/useCarousel'
import { useSwipe } from '@/hooks/useSwipe'
import { useTilt } from '@/hooks/useTilt'

/**
 * Carrusel "coverflow" de categorías: sirve solo para ELEGIR categoría.
 * - Tarjeta central grande (enlace a la página de la categoría); laterales inclinadas en perspectiva.
 * - Píldoras arriba. Flechas en los extremos: fuera de las tarjetas si caben; si no, sobre la última
 *   tarjeta visible (nunca junto a la central).
 * - Pantallas intermedias (variante "compact" a partir de lg: portátiles y tabletas apaisadas): tarjeta
 *   más pequeña, calculada con el alto de la pantalla, para que todo quepa a la vista.
 * - Móvil: deslizamiento con el dedo. Escritorio: flechas (botones o ← → del teclado), sin arrastre con ratón.
 *   Las ← → del teclado funcionan con el foco dentro del carrusel o con el ratón encima (sin hacer clic).
 * - Sin rueda del ratón (evita "scroll jacking").
 * - En móvil se ven 3 tarjetas: la central y parte de las dos laterales.
 * - Solo la central se inclina hacia el cursor (useTilt).
 */
const CAROUSEL_STATE: CategoryLinkState = { from: 'carousel' }

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
  // Al volver desde una categoría, esa tarjeta queda en el centro (lista para pasar a la siguiente).
  const { state } = useLocation()
  const focusSlug = readCarouselFocus(state)
  const initialIndex = Math.max(0, CATEGORIES.findIndex((category) => category.slug === focusSlug))
  const { index, goTo, next, previous, offsetOf } = useCarousel(CATEGORIES.length, initialIndex)
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

  // Con el ratón encima (sin haber hecho clic), las ← → del teclado también mueven el carrusel.
  const regionRef = useRef<HTMLDivElement>(null)
  const hoveredRef = useRef(false)
  useEffect(() => {
    const onWindowKeyDown = (event: globalThis.KeyboardEvent) => {
      if (!hoveredRef.current || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      // Si el foco ya está dentro del carrusel, lo mueve su propio onKeyDown (no mover dos veces)
      if (regionRef.current?.contains(document.activeElement)) return
      // Nunca quitarle las flechas a un campo de texto
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        previous()
      }
    }
    window.addEventListener('keydown', onWindowKeyDown)
    return () => window.removeEventListener('keydown', onWindowKeyDown)
  }, [next, previous])

  return (
    <div>
      <CategoryPills names={CATEGORIES.map((category) => category.name)} activeIndex={index} onSelect={goTo} tone={tone} />

      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Categorías de trabajos"
        ref={regionRef}
        onKeyDown={onKeyDown}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') hoveredRef.current = true
        }}
        onPointerLeave={() => {
          hoveredRef.current = false
        }}
        className="relative mt-14 overflow-x-clip pt-8 [--card-w:min(60vw,22rem)] md:[--card-w:min(34vw,22rem)] lg:[--card-w:24rem] lg:compact:[--card-w:min(20rem,calc((100svh-16rem)*0.8),28vw)] phone-land:mt-8! phone-land:pt-4! phone-land:[--card-w:min(15rem,calc((100svh-6rem)*0.8))]!"
      >
        <div
          className="relative mx-auto aspect-4/5 w-(--card-w) touch-pan-y select-none perspective-[1400px] transform-3d"
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
                slug={category.slug}
                name={category.name}
                cover={category.cover}
                active={active}
              />
            )
            return (
              <div
                key={category.slug}
                className="absolute top-0 left-1/2 h-full w-full transition-[transform,opacity] duration-500 ease-in-out-strong motion-reduce:transition-none"
                style={cardStyle(offset)}
                aria-hidden={!active}
              >
                {active ? (
                  <Link
                    ref={tilt.ref}
                    to={categoryPath(category)}
                    state={CAROUSEL_STATE}
                    // Mismo texto que se ve en la tarjeta (nombre y "Ver trabajos"), sin la descripción larga de la foto.
                    aria-label={`${category.name}, Ver trabajos`}
                    onPointerMove={tilt.onPointerMove}
                    onPointerLeave={tilt.onPointerLeave}
                    draggable={false}
                    className="block size-full rounded-[20px] transition-transform duration-200 ease-out [--rx:0deg] [--ry:0deg] transform-[rotateX(var(--rx))_rotateY(var(--ry))]"
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

        {/* Flechas en los extremos del carrusel (borde del contenedor, alineadas con título y píldoras):
            fuera de las tarjetas si hay sitio; si no, encima de la última tarjeta visible, nunca junto a
            la central. */}
        <ArrowButton
          direction="previous"
          onClick={previous}
          label="Categoría anterior"
          className="absolute top-1/2 left-0 -translate-y-1/2"
        />
        <ArrowButton
          direction="next"
          onClick={next}
          label="Categoría siguiente"
          className="absolute top-1/2 right-0 -translate-y-1/2"
        />


        <p className="sr-only" aria-live="polite">
          {current?.name}, {index + 1} de {CATEGORIES.length}
        </p>
      </div>
    </div>
  )
}
