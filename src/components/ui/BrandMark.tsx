import logoUrl from '@/assets/brand/logo.svg'

interface BrandMarkProps {
  /** Lado en píxeles (el logo es casi cuadrado). */
  size?: number
  className?: string
}

/**
 * Logo vectorizado de la empresa, usado como máscara: toma el color del texto (`currentColor`),
 * así sirve en blanco sobre el hero y en tinta sobre fondos claros con el mismo archivo.
 */
export function BrandMark({ size = 44, className = '' }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${logoUrl})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  )
}
