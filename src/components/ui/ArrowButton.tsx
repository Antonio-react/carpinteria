interface ArrowButtonProps {
  direction: 'previous' | 'next'
  onClick: () => void
  /** Texto para lectores de pantalla ("Categoría anterior"...). */
  label: string
  /** Clases de posición (cada sitio que lo usa decide dónde va). */
  className?: string
}

/** Botón redondo con flecha ← / → para carruseles. */
export function ArrowButton({ direction, onClick, label, className = '' }: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`z-20 grid size-12 place-items-center rounded-full border border-ink/15 bg-paper/90 text-ink shadow-sm backdrop-blur transition-[transform,border-color] duration-150 hover:border-ink/40 active:scale-95 ${className}`}
    >
      <span aria-hidden="true">{direction === 'previous' ? '←' : '→'}</span>
    </button>
  )
}
