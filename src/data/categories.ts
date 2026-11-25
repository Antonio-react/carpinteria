import { CATEGORY_NAMES, CATEGORY_SLUGS, type CategorySlug } from '@/data/categorySlugs'

/** Foto de la galería. */
export interface GalleryPhoto {
  src: string
  /** Versión pequeña para pantallas estrechas (opcional). */
  srcSmall?: string
  /** Versión grande para el visor a pantalla completa (opcional; si falta, usa `src`). */
  srcLarge?: string
  /** Versión para el zoom del visor (opcional): solo se descarga cuando alguien amplía la foto. */
  srcZoom?: string
  alt: string
  width: number
  height: number
}

export interface Category {
  slug: CategorySlug
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

/**
 * Fotos reales de src/assets/gallery/<categoría>/, generadas con scripts/images/gallery.mjs:
 * NN-480.webp, NN-960.webp, NN-1600.webp y NN-zoom.webp (3200 px, solo al ampliar) por foto, y
 * portada-480/960.webp (recorte 4:5).
 */
const galleryFiles = import.meta.glob<string>('../assets/gallery/*/*.webp', { eager: true, import: 'default' })

function galleryFile(category: CategorySlug, name: string): string {
  const url = galleryFiles[`../assets/gallery/${category}/${name}.webp`]
  if (!url) throw new Error(`Falta la foto de galería ${category}/${name}.webp`)
  return url
}

/** `width` y `height`: medidas de la versión de 960 (dan la proporción de la foto en el mosaico). */
function galleryPhoto(category: CategorySlug, number: number, width: number, height: number, alt: string): GalleryPhoto {
  const name = String(number).padStart(2, '0')
  return {
    src: galleryFile(category, `${name}-960`),
    srcSmall: galleryFile(category, `${name}-480`),
    srcLarge: galleryFile(category, `${name}-1600`),
    srcZoom: galleryFile(category, `${name}-zoom`),
    alt,
    width,
    height,
  }
}

function galleryCover(category: CategorySlug, alt: string): GalleryPhoto {
  return {
    src: galleryFile(category, 'portada-960'),
    srcSmall: galleryFile(category, 'portada-480'),
    alt,
    width: 960,
    height: 1200,
  }
}

const puertasPhotos: readonly GalleryPhoto[] = [
  galleryPhoto('puertas', 1, 960, 1280, 'Puerta doble de madera oscura con cristaleras y montante en arco, entre dos estancias con suelo de barro'),
  galleryPhoto('puertas', 2, 960, 1280, 'Puerta de entrada de madera barnizada con cristales y montante, en una fachada de ladrillo'),
  galleryPhoto('puertas', 3, 960, 1280, 'Puertas de paso de madera maciza con molduras, en un pasillo junto a una librería de madera'),
  galleryPhoto('puertas', 4, 960, 540, 'Cristalera de madera con arcos de medio punto que separa dos estancias'),
  galleryPhoto('puertas', 5, 960, 1707, 'Puertas plegables lacadas en blanco con cuarterones de cristal mate'),
  galleryPhoto('puertas', 6, 960, 720, 'Puertas correderas lacadas en blanco con cristales en la parte alta, en un salón'),
  galleryPhoto('puertas', 7, 960, 1280, 'Pasillo revestido de paneles de madera con puerta oculta y luz indirecta en el techo'),
  galleryPhoto('puertas', 8, 960, 1705, 'Puerta corredera de roble con lamas verticales sobre cristal translúcido'),
  galleryPhoto('puertas', 9, 960, 1280, 'Puerta de paso lacada en gris con plafones, en un recibidor con suelo de pizarra'),
  galleryPhoto('puertas', 10, 960, 1280, 'Puertas correderas de suelo a techo con acabado textil gris, sobre tarima de roble'),
]

const cocinasPhotos: readonly GalleryPhoto[] = [
  galleryPhoto('cocinas', 1, 960, 540, 'Cocina en L con muebles de madera clara, armarios altos beige, encimera negra y ventana sobre el fregadero'),
  galleryPhoto('cocinas', 2, 960, 1280, 'Cocina alargada con muebles de madera clara, encimera de madera y puerta con cristales al fondo'),
  galleryPhoto('cocinas', 3, 960, 1280, 'Cocina abierta con muebles verde salvia, vigas de madera en el techo y escalera al fondo'),
  galleryPhoto('cocinas', 4, 960, 1280, 'Cocina con isla de madera y encimera de mármol blanco, y muebles altos de madera'),
  galleryPhoto('cocinas', 5, 960, 979, 'Cocina en U blanca con encimera negra, campana inclinada y frigorífico de acero'),
  galleryPhoto('cocinas', 6, 960, 1280, 'Cocina lineal con muebles altos blancos, bajos en gris antracita y columna negra hasta el techo'),
  galleryPhoto('cocinas', 7, 960, 1280, 'Cocina alargada con muebles bajos rojos, columnas blancas y suelo hidráulico'),
  galleryPhoto('cocinas', 8, 960, 375, 'Cocina en L de estilo clásico lacada en blanco, con vitrinas y luz bajo los muebles altos'),
  galleryPhoto('cocinas', 9, 960, 540, 'Cocina blanca con encimera de mármol blanco y península, junto a la puerta de la terraza'),
  galleryPhoto('cocinas', 10, 960, 540, 'Rincón de cocina con banco corrido tapizado en negro, mesa blanca y sillas'),
]

const salonesPhotos: readonly GalleryPhoto[] = [
  galleryPhoto('salones', 1, 960, 1280, 'Mueble de salón a medida con puertas lacadas en blanco, pantalla empotrada, estantería de roble y zócalo negro con chimenea'),
]

const CATEGORY_LIST: readonly Category[] = [
  {
    slug: 'armarios',
    name: CATEGORY_NAMES.armarios,
    tagline: 'Empotrados y vestidores',
    description:
      'Armarios empotrados y vestidores hechos al milímetro para aprovechar cada hueco de la casa: interiores organizados a medida, puertas correderas o abatibles y acabados en madera natural o lacados.',
    photos: [],
    placeholderCount: 6,
    seoDescription: 'Armarios empotrados y vestidores a medida, medidos, fabricados y montados por nosotros en toda España.',
  },
  {
    slug: 'puertas',
    name: CATEGORY_NAMES.puertas,
    tagline: 'De paso, correderas y de entrada',
    description:
      'Puertas de paso, correderas y de entrada fabricadas y colocadas por nuestro equipo, con el acabado y los herrajes que pide cada casa y ajustadas a su hueco real.',
    cover: galleryCover('puertas', 'Puerta doble de madera oscura con cristaleras y montante en arco'),
    photos: puertasPhotos,
    placeholderCount: 0,
    seoDescription: 'Puertas de madera a medida: de paso, correderas y de entrada, fabricadas y colocadas por nosotros.',
  },
  {
    slug: 'suelos',
    name: CATEGORY_NAMES.suelos,
    tagline: 'Tarima y madera',
    description:
      'Tarima y suelos de madera colocados con cuidado, desde la preparación de la base hasta el último rodapié, para que el suelo dure tanto como la casa.',
    photos: [],
    placeholderCount: 6,
    seoDescription: 'Colocación de tarima y suelos de madera, de la base al rodapié, en toda España.',
  },
  {
    slug: 'cocinas',
    name: CATEGORY_NAMES.cocinas,
    tagline: 'Muebles de cocina hechos en el taller',
    description:
      'Cocinas a medida pensadas para el espacio y la forma de cocinar de cada familia, con muebles fabricados en nuestro taller y montados por nosotros, sin intermediarios.',
    cover: galleryCover('cocinas', 'Cocina abierta con muebles verde salvia y vigas de madera en el techo'),
    photos: cocinasPhotos,
    placeholderCount: 0,
    seoDescription: 'Cocinas de madera a medida, diseñadas, fabricadas y montadas por nuestro taller familiar.',
  },
  {
    slug: 'salones',
    name: CATEGORY_NAMES.salones,
    tagline: 'Muebles de salón y estanterías',
    description:
      'Muebles de salón, estanterías y paneles que reúnen televisión, chimenea y almacenaje en una sola pieza, hecha para la pared exacta de cada casa.',
    cover: galleryCover('salones', 'Mueble de salón a medida con pantalla empotrada, estantería de roble y zócalo negro con chimenea'),
    photos: salonesPhotos,
    placeholderCount: 5,
    seoDescription: 'Muebles de salón a medida: paneles, estanterías y muebles para televisión y chimenea hechos para cada pared.',
  },
  {
    slug: 'otros-trabajos',
    name: CATEGORY_NAMES['otros-trabajos'],
    tagline: 'Escaleras, revestimientos y más',
    description:
      'Escaleras, revestimientos, mobiliario y encargos especiales que no caben en una sola categoría.',
    photos: [],
    placeholderCount: 6,
    seoDescription: 'Escaleras, revestimientos, mobiliario y encargos especiales en madera hechos a medida.',
  },
]

/** Categorías en el orden de CATEGORY_SLUGS (el que se ve en toda la web). */
export const CATEGORIES: readonly Category[] = [...CATEGORY_LIST].sort(
  (a, b) => CATEGORY_SLUGS.indexOf(a.slug) - CATEGORY_SLUGS.indexOf(b.slug),
)

export function findCategory(slug: string | undefined): Category | undefined {
  return CATEGORIES.find((category) => category.slug === slug)
}

export function categoryPath(category: Category) {
  return `/trabajos/${category.slug}`
}
