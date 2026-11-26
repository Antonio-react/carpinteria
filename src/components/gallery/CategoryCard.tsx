import { Link } from 'react-router'
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import { cardPhoto, cardSizeSpec } from '@/data/cardSizes'
import { categoryPath, type Category } from '@/data/categories'
import type { CategoryLinkState } from '@/data/categoryOrigin'
import { sketchFor } from '@/data/sketches'

const FOLDERS_STATE: CategoryLinkState = { from: 'folders' }

interface CategoryCardProps {
  category: Category
  /** Proporción del boceto cuando la categoría aún no tiene foto (clase de Tailwind, p. ej. "aspect-3/4"). */
  placeholderShape?: string
}

/**
 * Tarjeta de una categoría en la página de Trabajos: portada (o su boceto a lápiz), nombre y frase.
 * La foto ES la carpeta: la tarjeta toma su forma (la portada 4:5 del carrusel, o su foto de tarjeta
 * si la tiene) y, si es apaisada, se ensancha (src/data/cardSizes.ts).
 * Esquinas casi rectas (4/6 px): parecen fotos impresas dejadas sobre la mesa, no tarjetas de app.
 */
export function CategoryCard({ category, placeholderShape = 'aspect-4/5' }: CategoryCardProps) {
  const { name, tagline } = category
  const photo = cardPhoto(category)
  const size = cardSizeSpec(category)
  const ratio = photo ? `${photo.width} / ${photo.height}` : null
  const srcSet = photo?.srcSmall
    ? [`${photo.srcSmall} 480w`, `${photo.src} 960w`, ...(photo.srcLarge ? [`${photo.srcLarge} 1600w`] : [])].join(', ')
    : undefined
  return (
    <Link to={categoryPath(category)} state={FOLDERS_STATE} className="group block transition-transform duration-200 ease-out hover:-translate-y-0.5">
      <div
        style={ratio ? { aspectRatio: ratio } : undefined}
        className={`overflow-hidden rounded-sm border border-ink/10 bg-paper sm:rounded-md ${ratio ? '' : placeholderShape}`}
      >
        {photo ? (
          <img
            src={photo.src}
            srcSet={srcSet}
            sizes={size.sizes}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <PhotoPlaceholder label={name} sketch={sketchFor(category.slug)} className="size-full" />
        )}
      </div>
      <p className="mt-3 text-base font-medium tracking-[-0.01em] font-stretch-105% sm:mt-4 sm:text-xl">{name}</p>
      <p className="mt-1 text-left text-xs text-muted sm:text-sm">{tagline}</p>
    </Link>
  )
}
