import type { CSSProperties } from 'react'
import { BrandMark } from '@/components/ui/BrandMark'

interface BrandBadgeProps {
  /** Diámetro en píxeles. */
  size?: number
  /** Diámetro desde lg (escritorio), si es distinto. Tamaño real, no escalado: los bordes cuadran al alinearlo. */
  desktopSize?: number
  className?: string
}

/**
 * Logo con su aspecto original (dibujo negro sobre círculo claro), legible sobre fondos
 * oscuros y claros. Es el mismo archivo vectorial que BrandMark.
 */
export function BrandBadge({ size = 48, desktopSize, className = '' }: BrandBadgeProps) {
  const style = { '--badge': `${size}px`, '--badge-lg': `${desktopSize ?? size}px` } as CSSProperties
  return (
    <span
      aria-hidden="true"
      className={`inline-grid size-(--badge) shrink-0 place-items-center rounded-full bg-paper text-ink shadow-[0_1px_0_rgb(0_0_0/0.05)] lg:size-(--badge-lg) ${className}`}
      style={style}
    >
      <BrandMark size="94%" />
    </span>
  )
}
