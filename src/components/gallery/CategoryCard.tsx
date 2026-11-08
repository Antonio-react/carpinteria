import { Link } from 'react-router'
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import { categoryPath, type Category } from '@/data/categories'

interface CategoryCardProps {
  category: Category
}

/** Tarjeta de una categoría en la página de Trabajos: portada (o hueco gris), nombre y frase. */
export function CategoryCard({ category }: CategoryCardProps) {
  const { cover, name, tagline } = category
  return (
    <Link to={categoryPath(category)} className="group block transition-transform duration-200 ease-out hover:-translate-y-0.5">
      <div className="aspect-[4/5] overflow-hidden lg:compact:aspect-[4/3] rounded-[14px] bg-placeholder sm:rounded-[20px]">
        {cover ? (
          <img
            src={cover.src}
            srcSet={cover.srcSmall ? `${cover.srcSmall} 480w, ${cover.src} 960w` : undefined}
            sizes="(min-width: 1024px) 33vw, 50vw"
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <PhotoPlaceholder label={name} className="size-full" />
        )}
      </div>
      <p className="mt-3 text-base font-medium tracking-[-0.01em] [font-stretch:105%] sm:mt-4 sm:text-xl">{name}</p>
      <p className="mt-1 text-left text-xs text-muted sm:text-sm">{tagline}</p>
    </Link>
  )
}
