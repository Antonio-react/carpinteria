import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import type { GalleryPhoto } from '@/data/categories'
import { sketchFor } from '@/data/sketches'

interface FolderCardProps {
  slug: string
  name: string
  cover?: GalleryPhoto
  /**
   * Foto con su forma real (apaisada), la misma de "Todos los trabajos". Solo en escritorio y solo en la
   * tarjeta central, que se ensancha a esa forma (CategoryCarousel); en móvil y en las laterales, la portada.
   */
  wideCover?: GalleryPhoto
  /** Tarjeta central: muestra la invitación a abrirla. */
  active: boolean
}

/**
 * Tarjeta de categoría: solo la foto de portada, limpia, con el nombre abajo y, más suave, "Ver
 * trabajos" para invitar a entrar (solo en la central). Solo visual: el enlace lo pone el carrusel.
 */
export function FolderCard({ slug, name, cover, wideCover, active }: FolderCardProps) {
  return (
    <div className="relative size-full">
      <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-night shadow-[0_24px_60px_-20px_rgb(28_25_22/0.55)]">
        {cover ? (
          <img
            src={cover.src}
            srcSet={cover.srcSmall ? `${cover.srcSmall} 480w, ${cover.src} 960w` : undefined}
            sizes="(min-width: 1024px) 26vw, 60vw"
            // Decorativa: el nombre del enlace lo da el texto de la tarjeta ("Armarios, Ver trabajos").
            alt=""
            width={cover.width}
            height={cover.height}
            loading="lazy"
            draggable={false}
            className="size-full object-cover"
          />
        ) : (
          <PhotoPlaceholder label={name} sketch={sketchFor(slug)} decorative className="size-full pb-24" />
        )}
        {/* Encima, la foto apaisada: aparece con un fundido mientras la tarjeta se ensancha. Oculta (y sin
            descargar: display none + lazy) por debajo de lg. */}
        {wideCover && (
          <img
            src={wideCover.src}
            srcSet={[`${wideCover.srcSmall} 480w`, `${wideCover.src} 960w`, ...(wideCover.srcLarge ? [`${wideCover.srcLarge} 1600w`] : [])].join(', ')}
            sizes="(min-width: 1024px) 860px, 1px"
            alt=""
            width={wideCover.width}
            height={wideCover.height}
            loading="lazy"
            draggable={false}
            className={`absolute inset-0 hidden size-full object-cover transition-opacity duration-500 ease-in-out-strong motion-reduce:transition-none lg:block ${active ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Nombre y "Ver trabajos": solo en la tarjeta central. En las laterales, inclinadas y tapadas
            en parte por la central, se leían trozos sueltos ("tas", "trabajos"). */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-linear-to-t from-night/85 via-night/40 to-transparent p-5 pt-16 text-paper transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
        >
          <p className="text-2xl font-medium tracking-[-0.02em] font-stretch-110%">{name}</p>
          <p className="mt-1 text-sm text-paper/75">Ver trabajos</p>
        </div>
      </div>
    </div>
  )
}
