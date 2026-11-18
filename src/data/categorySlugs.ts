/**
 * Direcciones (/trabajos/<slug>) y nombres de las categorías de la galería, en el orden del carrusel.
 *
 * Archivo aparte y sin imports (sin fotos) para que también lo pueda leer `vite/seoFiles.ts` al
 * compilar y generar el sitemap y el llms.txt. Para añadir una categoría: su slug y nombre aquí y su
 * ficha en categories.ts.
 */
export const CATEGORY_SLUGS = ['armarios', 'puertas', 'suelos', 'cocinas', 'salones', 'otros-trabajos'] as const

export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export const CATEGORY_NAMES: Record<CategorySlug, string> = {
  armarios: 'Armarios',
  puertas: 'Puertas',
  suelos: 'Suelos',
  cocinas: 'Cocinas',
  salones: 'Salones',
  'otros-trabajos': 'Otros trabajos',
}
