import { CategoryCarousel } from '@/components/gallery/CategoryCarousel'

interface CategoryCarouselLazyProps {
  tone?: 'light' | 'dark'
}

/** Punto de entrada para cargar el carrusel con React.lazy (necesita export default). */
export default function CategoryCarouselLazy({ tone }: CategoryCarouselLazyProps) {
  return <CategoryCarousel tone={tone} />
}
