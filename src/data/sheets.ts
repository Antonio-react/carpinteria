import { CATEGORIES } from '@/data/categories'

/** Una "hoja" del cuaderno de planos del taller: lo que muestra el cajetín de cada página. */
export interface Sheet {
  /** Número de hoja ("02", "02.4", "A1"...). */
  number: string
  title: string
  /** Fondo de la cabecera de la página: el cajetín se dibuja claro sobre oscuro. */
  tone: 'light' | 'dark'
}

const FIXED: Record<string, Sheet> = {
  '/trabajos': { number: '02', title: 'Trabajos', tone: 'dark' },
  '/como-trabajamos': { number: '03', title: 'Cómo trabajamos', tone: 'light' },
  '/contacto': { number: '04', title: 'Contacto', tone: 'light' },
  '/aviso-legal': { number: 'A1', title: 'Aviso legal', tone: 'light' },
  '/privacidad': { number: 'A2', title: 'Privacidad', tone: 'light' },
  '/cookies': { number: 'A3', title: 'Cookies', tone: 'light' },
}

/** Páginas cuya cabecera es oscura (la barra de navegación empieza transparente sobre ellas). */
export const DARK_TOP_PATHS: readonly string[] = ['/', '/trabajos']

/**
 * Hoja de la página actual. Inicio no lleva (ya tiene el hero). Las categorías son
 * sub-hojas de Trabajos (02.1, 02.2...). Cualquier otra ruta es la 404: "hoja extraviada".
 */
export function sheetFor(pathname: string): Sheet | null {
  if (pathname === '/') return null
  const fixed = FIXED[pathname]
  if (fixed) return fixed
  const categoryIndex = CATEGORIES.findIndex((category) => pathname === `/trabajos/${category.slug}`)
  const category = CATEGORIES[categoryIndex]
  if (category) return { number: `02.${categoryIndex + 1}`, title: category.name, tone: 'light' }
  return { number: '—', title: 'Hoja extraviada', tone: 'light' }
}
