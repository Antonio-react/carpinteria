/**
 * Desde dónde se ha abierto una categoría: viaja en el estado del enlace (state de react-router)
 * para que el botón "Volver" de la página de categoría lleve justo a ese sitio.
 */
export type CategoryOrigin = 'drawers' | 'carousel' | 'folders'

export interface CategoryLinkState {
  from: CategoryOrigin
}

/** Lo que recibe Trabajos al volver desde el carrusel: qué tarjeta dejar en el centro. */
export interface CarouselFocusState {
  focus: string
}

export interface BackTarget {
  to: string
  label: string
  state?: CarouselFocusState
}

const ORIGINS: readonly CategoryOrigin[] = ['drawers', 'carousel', 'folders']

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

/** Lee el origen del estado del historial (puede venir vacío o de otra página). */
export function readCategoryOrigin(state: unknown): CategoryOrigin | null {
  if (!isObject(state)) return null
  const from = state.from
  return ORIGINS.find((origin) => origin === from) ?? null
}

/** Lee la tarjeta que el carrusel debe dejar en el centro al volver (o null). */
export function readCarouselFocus(state: unknown): string | null {
  if (!isObject(state)) return null
  return typeof state.focus === 'string' ? state.focus : null
}

/** id de la cajonera de Inicio y de la lista "Todos los trabajos" (anclas del botón Volver). */
export const DRAWERS_ID = 'cajones'
export const ALL_WORKS_ID = 'todos-los-trabajos'

/**
 * A dónde lleva "Volver". Sin origen (se entró directo, desde Google o un enlace compartido):
 * a Trabajos, para que pueda ver el resto de categorías.
 */
export function backTargetFor(origin: CategoryOrigin | null, slug: string): BackTarget {
  switch (origin) {
    case 'drawers':
      return { to: `/#${DRAWERS_ID}`, label: 'Volver a los cajones' }
    case 'carousel':
      return { to: '/trabajos', label: 'Volver a las carpetas', state: { focus: slug } }
    case 'folders':
      return { to: `/trabajos#${ALL_WORKS_ID}`, label: 'Volver a las carpetas' }
    default:
      return { to: '/trabajos', label: 'Ver todos los trabajos' }
  }
}
