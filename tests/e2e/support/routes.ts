import { readFileSync } from 'node:fs'

/**
 * Todas las páginas de la web. Las categorías se leen de src/data/categories.ts (los "slug"), así
 * al añadir una categoría nueva entra sola en los tests. No se importa el archivo directamente
 * porque importa fotos .webp, que Node no sabe cargar.
 */
const categoriesSource = readFileSync(new URL('../../../src/data/categories.ts', import.meta.url), 'utf8')
const categorySlugs = [...categoriesSource.matchAll(/^\s*slug: '([a-z0-9-]+)'/gm)].map((match) => match[1])

export interface SiteRoute {
  path: string
  /** Nombre legible para el informe de los tests. */
  name: string
}

export const PAGES: readonly SiteRoute[] = [
  { path: '/', name: 'Inicio' },
  { path: '/trabajos', name: 'Trabajos' },
  ...categorySlugs.map((slug) => ({ path: `/trabajos/${slug}`, name: `Categoría ${slug}` })),
  { path: '/como-trabajamos', name: 'Cómo trabajamos' },
  { path: '/contacto', name: 'Contacto' },
  { path: '/aviso-legal', name: 'Aviso legal' },
  { path: '/privacidad', name: 'Privacidad' },
  { path: '/cookies', name: 'Cookies' },
]

export const NOT_FOUND: SiteRoute = { path: '/esta-pagina-no-existe', name: '404' }

/** Páginas reales + la 404 (para lo que también debe cumplir la página de error). */
export const ALL_ROUTES: readonly SiteRoute[] = [...PAGES, NOT_FOUND]

/** Título de la página 404 (src/pages/NotFoundPage.tsx). */
export const NOT_FOUND_HEADING = 'Aquí no hay nada que cortar'
