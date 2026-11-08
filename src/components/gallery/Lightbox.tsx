import { useEffect, useRef } from 'react'
import { ArrowButton } from '@/components/ui/ArrowButton'
import type { GalleryPhoto } from '@/data/categories'
import { useSwipe } from '@/hooks/useSwipe'

interface LightboxProps {
  photos: readonly GalleryPhoto[]
  /** Foto abierta; null = cerrado. */
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  /** Nombre de la categoría (para el título accesible del visor). */
  categoryName: string
}

/**
 * Visor de fotos a pantalla completa (sobre <dialog> nativo: mantiene el foco dentro, se cierra con
 * Escape y devuelve el foco a la foto pulsada).
 * - Escritorio: flechas a los lados y teclas ← →. Móvil: flechas debajo de la foto y deslizar el dedo.
 * - Se cierra con la X, con Escape o pulsando fuera de la foto.
 * - Mientras está abierto, la página de debajo no hace scroll.
 */
export function Lightbox({ photos, index, onIndexChange, onClose, categoryName }: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const open = index !== null
  const total = photos.length
  const photo = index !== null ? photos[index] : undefined

  const go = (step: number) => {
    if (index === null || total < 2) return
    onIndexChange((index + step + total) % total)
  }
  const swipe = useSwipe(
    () => go(1),
    () => go(-1),
  )

  // Abrir / cerrar el <dialog> y bloquear el scroll de la página mientras está abierto.
  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) {
      element.showModal()
      const previous = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previous
      }
    }
    if (!open && element.open) element.close()
  }, [open])

  return (
    <dialog
      ref={dialog}
      aria-label={`Fotos de ${categoryName}`}
      onCancel={(event) => {
        // Escape: se cierra desde el estado de React (así no se desincroniza).
        event.preventDefault()
        onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') go(1)
        else if (event.key === 'ArrowLeft') go(-1)
      }}
      onClick={(event) => {
        // Pulsar fuera de la foto (en el fondo) cierra el visor.
        if (event.target === event.currentTarget) onClose()
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-night/95 p-0 text-name backdrop:bg-night/80 open:grid open:grid-rows-[auto_minmax(0,1fr)_auto]"
    >
      {/* Barra superior: contador y cerrar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-sm tracking-[0.12em] text-name/70 tabular-nums" aria-live="polite">
          {index !== null && total > 0 ? `${index + 1} / ${total}` : ''}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar las fotos"
          className="grid size-12 place-items-center rounded-full text-2xl text-name/80 transition-colors hover:bg-white/10 hover:text-name"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      {/* Foto: deslizable con el dedo; pulsar en el hueco de alrededor también cierra */}
      <div
        className="relative flex min-h-0 touch-pan-y items-center justify-center px-2 select-none sm:px-20"
        onPointerDown={swipe.onPointerDown}
        onPointerUp={swipe.onPointerUp}
        onPointerCancel={swipe.onPointerCancel}
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        {photo && (
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            draggable={false}
            className="max-h-[calc(100dvh-8.5rem)] max-w-full rounded-[12px] object-contain shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] motion-safe:animate-rise"
          />
        )}

        {total > 1 && (
          <>
            <ArrowButton direction="previous" onClick={() => go(-1)} label="Foto anterior" className="absolute top-1/2 left-4 hidden -translate-y-1/2 sm:grid lg:left-8" />
            <ArrowButton direction="next" onClick={() => go(1)} label="Foto siguiente" className="absolute top-1/2 right-4 hidden -translate-y-1/2 sm:grid lg:right-8" />
          </>
        )}
      </div>

      {/* Móvil: flechas debajo de la foto (además de deslizar), para quien prefiera pulsar */}
      {total > 1 ? (
        <div className="flex items-center justify-center gap-5 px-4 pt-4 pb-7 sm:hidden">
          <ArrowButton direction="previous" onClick={() => go(-1)} label="Foto anterior" />
          <span className="text-xs text-name/50">o desliza</span>
          <ArrowButton direction="next" onClick={() => go(1)} label="Foto siguiente" />
        </div>
      ) : (
        <span className="pb-5 sm:hidden" />
      )}
    </dialog>
  )
}
