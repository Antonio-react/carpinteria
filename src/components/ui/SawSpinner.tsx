import sawUrl from '@/assets/brand/saw.svg'

interface SawSpinnerProps {
  size?: number
  /** Texto para lectores de pantalla. */
  label?: string
  className?: string
}

/**
 * Indicador de carga: la sierra circular del logo girando.
 * Con prefers-reduced-motion gira mucho más despacio (sigue indicando actividad sin marear).
 */
export function SawSpinner({ size = 48, label = 'Cargando', className = '' }: SawSpinnerProps) {
  return (
    <span role="status" className={`inline-flex items-center justify-center ${className}`}>
      <span
        aria-hidden="true"
        className="inline-block animate-saw-spin bg-current motion-reduce:[animation-duration:6s]"
        style={{
          width: size,
          height: size,
          maskImage: `url(${sawUrl})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }}
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}
