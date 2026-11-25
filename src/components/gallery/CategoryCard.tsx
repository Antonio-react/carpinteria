import { Link } from 'react-router'
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
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
 * La foto es la misma portada que en el carrusel (4:5), para que las dos se vean igual.
 */
export function CategoryCard({ category, placeholderShape = 'aspect-4/5' }: CategoryCardProps) {
  const { name, tagline } = category
  const photo = category.cover
  return (
    <Link to={categoryPath(category)} state={FOLDERS_STATE} className="group block transition-transform duration-200 ease-out hover:-translate-y-0.5">
      <div
        style={photo ? { aspectRatio: `${photo.width} / ${photo.height}` } : undefined}
        className={`overflow-hidden rounded-[14px] border border-ink/10 bg-paper sm:rounded-[20px] ${photo ? '' : placeholderShape}`}
      >
        {photo ? (
          <img
            src={photo.src}
            srcSet={photo.srcSmall ? `${photo.srcSmall} 480w, ${photo.src} 960w` : undefined}
            sizes="(min-width: 1024px) 33vw, 50vw"
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
