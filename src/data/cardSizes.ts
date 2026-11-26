import type { Category, GalleryPhoto } from '@/data/categories'

/**
 * Tamaño de cada tarjeta de "Todos los trabajos". Norma: la foto ES la carpeta, así que la tarjeta
 * toma la forma de su foto. Si la foto es apaisada, la tarjeta se ensancha (dos tercios de fila en
 * escritorio, la fila entera en móvil); si no, es normal (3 por fila en escritorio, 2 en móvil). No hay
 * un número fijo por fila: las filas que quedan a medias se centran (ver WorksPage).
 */
export interface CardSizeSpec {
  /** Huecos que ocupa en su fila: de 2 en móvil y de 6 en escritorio (para escalonar la caída). */
  span: { mobile: 1 | 2; desktop: 2 | 4 }
  /** Ancho de la tarjeta (Tailwind); --gap es el hueco entre tarjetas, definido en la lista. */
  className: string
  /** `sizes` de la imagen, según el ancho que ocupa. */
  sizes: string
}

const NORMAL: CardSizeSpec = {
  span: { mobile: 1, desktop: 2 },
  className: 'w-[calc((100%-var(--gap))/2)] lg:w-[calc((100%-2*var(--gap))/3)]',
  sizes: '(min-width: 1024px) 33vw, 50vw',
}

const WIDE: CardSizeSpec = {
  span: { mobile: 2, desktop: 4 },
  className: 'w-full lg:w-[calc((100%-2*var(--gap))/3*2+var(--gap))]',
  sizes: '(min-width: 1024px) 66vw, 100vw',
}

/** A partir de esta proporción (ancho/alto) la foto se considera apaisada y la tarjeta se ensancha. */
const WIDE_FROM = 1.2

/** La foto de la tarjeta: la suya propia si la tiene, si no la portada del carrusel. */
export function cardPhoto(category: Category): GalleryPhoto | undefined {
  return category.cardCover ?? category.cover
}

/** Su foto de tarjeta si es apaisada (la tarjeta se ensancha, aquí y en el centro del carrusel). */
export function widePhoto(category: Category): GalleryPhoto | undefined {
  const photo = cardPhoto(category)
  return photo && photo.width / photo.height >= WIDE_FROM ? photo : undefined
}

export function cardSizeSpec(category: Category): CardSizeSpec {
  return widePhoto(category) ? WIDE : NORMAL
}
