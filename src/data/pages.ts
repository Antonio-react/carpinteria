/**
 * Título, descripción y resumen de cada página, en UN solo sitio (como en la web de la escuela).
 * Lo leen:
 *   - cada página, con PageMeta (título y descripción al navegar por la web);
 *   - vite/seoHead.ts, al compilar: mete los de Inicio en el <head> de index.html (Google, WhatsApp y
 *     Facebook los leen sin ejecutar JavaScript);
 *   - vite/seoFiles.ts, al compilar: sitemap.xml y llms.txt.
 * Archivo sin imports (ni fotos) para que también lo pueda leer vite.config.ts.
 * Las categorías construyen su título con categoryTitle() y su descripción está en src/data/categories.ts.
 */
export interface PageInfo {
  path: string
  /** Nombre corto (enlaces de llms.txt; h1 de las páginas legales). */
  name: string
  /** <title> de la pestaña y de Google (mejor entre 15 y 65 caracteres). */
  title: string
  /** <meta name="description"> (mejor entre 70 y 160 caracteres). */
  description: string
  /** Resumen de una línea para llms.txt (asistentes de IA). */
  summary: string
}

const BRAND = 'Carpintería y Decoración'

export const PAGES = {
  home: {
    path: '/',
    name: 'Inicio',
    title: `${BRAND} · Muebles a medida en toda España`,
    description:
      'Ebanistería y carpintería familiar con más de 40 años de experiencia. Medimos, diseñamos y montamos muebles a medida en toda España. Presupuesto gratis.',
    summary: 'quiénes somos y un mueble de salón hecho por el taller',
  },
  works: {
    path: '/trabajos',
    name: 'Trabajos',
    title: `Trabajos · ${BRAND}`,
    description:
      'Armarios, puertas, suelos, cocinas, muebles de salón y otros trabajos en madera hechos a medida por nuestro taller familiar.',
    summary: 'galería de trabajos por categorías',
  },
  process: {
    path: '/como-trabajamos',
    name: 'Cómo trabajamos',
    title: `Cómo trabajamos · ${BRAND}`,
    description: 'Medimos, diseñamos y montamos nosotros mismos, sin intermediarios y en toda España. Presupuesto gratis.',
    summary: 'medimos, diseñamos y montamos, y preguntas frecuentes',
  },
  contact: {
    path: '/contacto',
    name: 'Contacto',
    title: `Contacto y presupuesto · ${BRAND}`,
    description:
      'Cuéntanos tu idea y la hacemos realidad. Pide presupuesto gratis por el formulario o por correo; te respondemos lo antes posible.',
    summary: 'pedir presupuesto gratis, correo, teléfonos, horario y dirección del taller',
  },
  legalNotice: {
    path: '/aviso-legal',
    name: 'Aviso legal',
    title: `Aviso legal · ${BRAND}`,
    description: `Aviso legal de ${BRAND}: datos del titular de la web, condiciones de uso y propiedad de los contenidos.`,
    summary: 'datos del titular',
  },
  privacy: {
    path: '/privacidad',
    name: 'Política de privacidad',
    title: `Política de privacidad · ${BRAND}`,
    description: 'Cómo tratamos los datos que nos envías por el formulario o por correo.',
    summary: 'qué se hace con los datos del formulario',
  },
  cookies: {
    path: '/cookies',
    name: 'Política de cookies',
    title: `Política de cookies · ${BRAND}`,
    description: `Política de cookies de ${BRAND}: esta web no utiliza cookies de análisis, publicidad ni de terceros.`,
    summary: 'la web no usa cookies de terceros',
  },
  notFound: {
    path: '*',
    name: 'Página no encontrada',
    title: `Página no encontrada · ${BRAND}`,
    description: 'La página que buscas no existe o ha cambiado de dirección.',
    summary: '',
  },
} as const satisfies Record<string, PageInfo>

/** Páginas principales y legales, en el orden del sitemap y de llms.txt (la 404 no va). */
export const MAIN_PAGES: readonly PageInfo[] = [PAGES.home, PAGES.works, PAGES.process, PAGES.contact]
export const LEGAL_PAGES: readonly PageInfo[] = [PAGES.legalNotice, PAGES.privacy, PAGES.cookies]

/** Título de la página de una categoría: "Cocinas a medida · Carpintería y Decoración". */
export function categoryTitle(categoryName: string): string {
  return `${categoryName} a medida · ${BRAND}`
}
