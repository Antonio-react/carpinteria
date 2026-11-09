import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import type { GalleryPhoto } from '@/data/categories'
import { sketchFor } from '@/data/sketches'

interface FolderCardProps {
  slug: string
  name: string
  tagline: string
  cover?: GalleryPhoto
  /** Tarjeta central: muestra la invitación a abrirla. */
  active: boolean
}

/**
 * Tarjeta de categoría: solo la foto de portada, limpia, con el nombre y la descripción abajo
 * (como las referencias). "Abrir carpeta" en la central invita a entrar. Solo visual: el enlace
 * lo pone el carrusel.
 */
export function FolderCard({ slug, name, tagline, cover, active }: FolderCardProps) {
  return (
    <div className="relative size-full">
      <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-night shadow-[0_24px_60px_-20px_rgb(28_25_22/0.55)]">
        {cover ? (
          <img
            src={cover.src}
            srcSet={cover.srcSmall ? `${cover.srcSmall} 480w, ${cover.src} 960w` : undefined}
            sizes="(min-width: 1024px) 26vw, 60vw"
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            loading="lazy"
            draggable={false}
            className="size-full object-cover"
          />
        ) : (
          <PhotoPlaceholder label={name} sketch={sketchFor(slug)} className="size-full pb-24" />
        )}

        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-night/85 via-night/40 to-transparent p-5 pt-16 text-paper">
          <p className="text-2xl font-medium tracking-[-0.02em] [font-stretch:110%]">{name}</p>
          <p className="mt-1 text-sm text-paper/75">{tagline}</p>
          <p
            className={`mt-4 inline-flex items-center gap-2 text-sm font-medium transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
          >
            Ver trabajos
          </p>
        </div>
      </div>
    </div>
  )
}
