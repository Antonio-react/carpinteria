import { useState } from 'react'
import { SawSpinner } from '@/components/ui/SawSpinner'
import type { GalleryPhoto } from '@/data/categories'

interface GalleryTileProps {
  photo: GalleryPhoto
  /** Abre la foto ampliada en el visor. */
  onOpen: () => void
}

/**
 * Foto de la galería (botón que la amplía), con su proporción natural (la galería es un mosaico de
 * tamaños distintos): la sierra gira mientras carga y la foto aparece con un
 * fundido suave. Al pasar el ratón, una lupa indica que se puede ampliar.
 */
export function GalleryTile({ photo, onOpen }: GalleryTileProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Ampliar foto: ${photo.alt}`}
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
      className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[14px] bg-placeholder sm:rounded-[20px]"
    >
      {!loaded && (
        <span className="absolute inset-0 grid place-items-center text-oak">
          <SawSpinner size={40} label="Cargando foto" />
        </span>
      )}
      <img
        src={photo.src}
        srcSet={photo.srcSmall ? `${photo.srcSmall} 480w, ${photo.src} 960w` : undefined}
        sizes="(min-width: 1024px) 33vw, 50vw"
        alt=""
        width={photo.width}
        height={photo.height}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`size-full object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03] ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <span
        aria-hidden="true"
        className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-paper/90 text-ink opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <svg viewBox="0 0 20 20" className="size-4 fill-none stroke-current [stroke-width:1.8]">
          <circle cx="8.5" cy="8.5" r="5.5" />
          <path d="M12.5 12.5 17 17M8.5 6v5M6 8.5h5" strokeLinecap="round" />
        </svg>
      </span>
    </button>
  )
}
