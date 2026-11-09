import { useState } from 'react'
import { GalleryTile } from '@/components/gallery/GalleryTile'
import { Lightbox } from '@/components/gallery/Lightbox'
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import { MAX_PHOTOS_PER_CATEGORY, type Category } from '@/data/categories'
import { sketchFor } from '@/data/sketches'

/** Proporciones que van alternando los bocetos, para que el mosaico no salga en cuadrícula. */
const PLACEHOLDER_SHAPES = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/4]', 'aspect-[4/5]', 'aspect-[2/3]'] as const

interface GalleryGridProps {
  category: Category
}

/**
 * Galería de una categoría: sus fotos reales (máximo 10) y, mientras falten, bocetos a lápiz del tipo
 * de trabajo. Mosaico en columnas (cada pieza con su altura, como fotos colgadas a mano, no una
 * cuadrícula de tarjetas iguales): 2 columnas en móvil, 4 en pantallas intermedias y 3 en escritorio.
 * Las fotos reales se amplían en un visor con flechas / deslizamiento.
 */
export function GalleryGrid({ category }: GalleryGridProps) {
  const photos = category.photos.slice(0, MAX_PHOTOS_PER_CATEGORY)
  const placeholders = Math.max(0, Math.min(category.placeholderCount, MAX_PHOTOS_PER_CATEGORY - photos.length))
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <ul className="columns-2 gap-3 sm:gap-4 lg:columns-3 lg:compact:columns-4 phone-land:columns-4! [&>li]:mb-3 [&>li]:break-inside-avoid sm:[&>li]:mb-4">
        {photos.map((photo, index) => (
          <li key={photo.src}>
            <GalleryTile photo={photo} onOpen={() => setOpenIndex(index)} />
          </li>
        ))}
        {Array.from({ length: placeholders }, (_, index) => (
          <li key={`hueco-${index}`}>
            <PhotoPlaceholder
              label={category.name}
              sketch={sketchFor(category.slug)}
              seed={index + 1}
              className={`${PLACEHOLDER_SHAPES[index % PLACEHOLDER_SHAPES.length]} rounded-[14px] border border-ink/10 sm:rounded-[20px]`}
            />
          </li>
        ))}
      </ul>
      <Lightbox photos={photos} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} categoryName={category.name} />
    </>
  )
}
