interface PhotoPlaceholderProps {
  /** Texto centrado (el nombre de la categoría). */
  label: string
  className?: string
}

/**
 * Hueco gris para fotos que aún no existen (regla de CLAUDE.md: NUNCA fotos de stock).
 * Se sustituye por la foto real cuando la empresa la envíe.
 */
export function PhotoPlaceholder({ label, className = '' }: PhotoPlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Foto pendiente: ${label}`}
      className={`grid place-items-center bg-placeholder text-center text-sm font-medium tracking-wide text-ink/55 ${className}`}
    >
      <span className="px-4">{label}</span>
    </div>
  )
}
