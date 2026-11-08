import { BrandMark } from '@/components/ui/BrandMark'

interface BrandBadgeProps {
  /** Diámetro en píxeles. */
  size?: number
  className?: string
}

/**
 * Logo con su aspecto original (dibujo negro sobre círculo claro), legible sobre fondos
 * oscuros y claros. Es el mismo archivo vectorial que BrandMark.
 */
export function BrandBadge({ size = 48, className = '' }: BrandBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-grid shrink-0 place-items-center rounded-full bg-paper text-ink shadow-[0_1px_0_rgb(0_0_0/0.05)] ${className}`}
      style={{ width: size, height: size }}
    >
      <BrandMark size={Math.round(size * 0.94)} />
    </span>
  )
}
