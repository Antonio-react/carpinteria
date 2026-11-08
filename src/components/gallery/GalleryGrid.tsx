import { useState } from 'react'
import { GalleryTile } from '@/components/gallery/GalleryTile'
import { Lightbox } from '@/components/gallery/Lightbox'
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import { MAX_PHOTOS_PER_CATEGORY, type Category } from '@/data/categories'

interface GalleryGridProps {
  category: Category
}

/**
 * Galería simple de una categoría: sus fotos reales (máximo 10) y, mientras falten,
 * huecos grises con el nombre de la categoría. 2 columnas en móvil, 4 en pantallas intermedias
 * (portátiles y tabletas apaisadas) y 3 en escritorio grande.
 * Las fotos reales se amplían en un visor con flechas / deslizamiento.
 */
export function GalleryGrid({ category }: GalleryGridProps) {
  const photos = category.photos.slice(0, MAX_PHOTOS_PER_CATEGORY)
  const placeholders = Math.max(0, Math.min(category.placeholderCount, MAX_PHOTOS_PER_CATEGORY - photos.length))
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:compact:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.src}>
            <GalleryTile photo={photo} onOpen={() => setOpenIndex(index)} />
          </li>
        ))}
        {Array.from({ length: placeholders }, (_, index) => (
          <li key={`hueco-${index}`}>
            <PhotoPlaceholder label={category.name} className="aspect-[4/5] rounded-[14px] sm:rounded-[20px]" />
          </li>
        ))}
      </ul>
      <Lightbox photos={photos} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} categoryName={category.name} />
    </>
  )
}
