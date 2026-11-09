import salonesCoverLarge from '@/assets/gallery/salones-portada-960.webp'
import salonesCoverSmall from '@/assets/gallery/salones-portada-480.webp'

/** Foto de la galería (cuando lleguen las reales, se añaden aquí). */
export interface GalleryPhoto {
  src: string
  /** Versión pequeña para pantallas estrechas (opcional). */
  srcSmall?: string
  alt: string
  width: number
  height: number
}

export interface Category {
  slug: string
  name: string
  /** Frase corta para la tarjeta del carrusel. */
  tagline: string
  /** Descripción general de la categoría (una por categoría, no por foto). */
  description: string
  /** Foto de portada de la "carpeta" (la mejor de la categoría). Sin foto → hueco gris. */
  cover?: GalleryPhoto
  /** Fotos de la categoría (máximo 10). Vacío → se muestran huecos grises. */
  photos: readonly GalleryPhoto[]
  /** Huecos grises que se muestran mientras no hay fotos reales. */
  placeholderCount: number
  /** Texto para el título y la descripción SEO de su página. */
  seoDescription: string
}

export const MAX_PHOTOS_PER_CATEGORY = 10

const salonesCover: GalleryPhoto = {
  src: salonesCoverLarge,
  srcSmall: salonesCoverSmall,
  alt: 'Mueble de salón a medida con puertas lacadas en blanco, pantalla empotrada, estantería de roble y zócalo negro con chimenea',
  width: 960,
  height: 1200,
}

export const CATEGORIES: readonly Category[] = [
  {
    slug: 'armarios',
    name: 'Armarios',
    tagline: 'Empotrados y vestidores',
    description:
      'Armarios empotrados y vestidores hechos al milímetro para aprovechar cada hueco de la casa: interiores organizados a medida, puertas correderas o abatibles y acabados en madera natural o lacados.',
    photos: [],
    placeholderCount: 6,
    seoDescription: 'Armarios empotrados y vestidores a medida, medidos, fabricados y montados por nosotros en toda España.',
  },
  {
    slug: 'puertas',
    name: 'Puertas',
    tagline: 'De paso, correderas y de entrada',
    description:
      'Puertas de paso, correderas y de entrada fabricadas y colocadas por nuestro equipo, con el acabado y los herrajes que pide cada casa y ajustadas a su hueco real.',
    photos: [],
    placeholderCount: 6,
    seoDescription: 'Puertas de madera a medida: de paso, correderas y de entrada, fabricadas y colocadas por nosotros.',
  },
  {
    slug: 'suelos',
    name: 'Suelos',
    tagline: 'Tarima y madera',
    description:
      'Tarima y suelos de madera colocados con cuidado, desde la preparación de la base hasta el último rodapié, para que el suelo dure tanto como la casa.',
    photos: [],
    placeholderCount: 6,
    seoDescription: 'Colocación de tarima y suelos de madera, de la base al rodapié, en toda España.',
  },
  {
    slug: 'cocinas',
    name: 'Cocinas',
    tagline: 'Muebles de cocina hechos en el taller',
    description:
      'Cocinas a medida pensadas para el espacio y la forma de cocinar de cada familia, con muebles fabricados en nuestro taller y montados por nosotros, sin intermediarios.',
    photos: [],
    placeholderCount: 6,
    seoDescription: 'Cocinas de madera a medida, diseñadas, fabricadas y montadas por nuestro taller familiar.',
  },
  {
    slug: 'salones',
    name: 'Salones',
    tagline: 'Muebles de salón y estanterías',
    description:
      'Muebles de salón, estanterías y paneles que reúnen televisión, chimenea y almacenaje en una sola pieza, hecha para la pared exacta de cada casa.',
    cover: salonesCover,
    photos: [salonesCover],
    placeholderCount: 5,
    seoDescription: 'Muebles de salón a medida: paneles, estanterías y muebles para televisión y chimenea hechos para cada pared.',
  },
  {
    slug: 'otros-trabajos',
    name: 'Otros trabajos',
    tagline: 'Escaleras, revestimientos y más',
    description:
      'Escaleras, revestimientos, mobiliario y encargos especiales que no caben en una sola categoría.',
    photos: [],
    placeholderCount: 6,
    seoDescription: 'Escaleras, revestimientos, mobiliario y encargos especiales en madera hechos a medida.',
  },
]

export function findCategory(slug: string | undefined): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug)
}

export function categoryPath(category: Category) {
  return `/trabajos/${category.slug}`
}
