/**
 * Direcciones (/trabajos/<slug>) y nombres de las categorías de la galería, en el orden en que salen en
 * toda la web (carrusel, "Todos los trabajos", hojas 02.x): alfabético, con "Otros trabajos" al final.
 *
 * Archivo aparte y sin imports (sin fotos) para que también lo pueda leer `vite/seoFiles.ts` al
 * compilar y generar el sitemap y el llms.txt. Para añadir una categoría: su slug y nombre aquí y su
 * ficha en categories.ts.
 */
export const CATEGORY_SLUGS = ['armarios', 'cocinas', 'puertas', 'salones', 'suelos', 'otros-trabajos'] as const

export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export const CATEGORY_NAMES: Record<CategorySlug, string> = {
  armarios: 'Armarios',
  puertas: 'Puertas',
  suelos: 'Suelos',
  cocinas: 'Cocinas',
  salones: 'Salones',
  'otros-trabajos': 'Otros trabajos',
}

/**
 * Descripción para Google de la página de cada categoría (mejor entre 70 y 160 caracteres). Aquí y no en
 * categories.ts para que vite/seoHead.ts pueda escribirla al compilar en el HTML de cada categoría.
 */
export const CATEGORY_SEO_DESCRIPTIONS: Record<CategorySlug, string> = {
  armarios: 'Armarios empotrados y vestidores a medida, medidos, fabricados y montados por nosotros en toda España.',
  puertas: 'Puertas de madera a medida: de paso, correderas y de entrada, fabricadas y colocadas por nosotros.',
  suelos: 'Colocación de tarima y suelos de madera, de la base al rodapié, en toda España.',
  cocinas: 'Cocinas de madera a medida, diseñadas, fabricadas y montadas por nuestro taller familiar.',
  salones: 'Muebles de salón a medida: paneles, estanterías y muebles para televisión y chimenea hechos para cada pared.',
  'otros-trabajos': 'Escaleras, revestimientos, mobiliario y encargos especiales en madera hechos a medida.',
}
