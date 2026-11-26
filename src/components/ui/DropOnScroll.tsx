import type { CSSProperties, ReactNode } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'

interface DropOnScrollProps {
  /** Giro con el que cae (grados; negativo = hacia la izquierda). */
  tilt: number
  /** Posición en su fila en móvil y en escritorio: las de una misma fila caen una tras otra. */
  column: { mobile: number; desktop: number }
  /**
   * Postura en la que se queda: giro (grados) y desplazamiento vertical (px en escritorio; en móvil,
   * la mitad). Sin ella, recta y en su sitio.
   */
  rest?: { rotate: number; offsetY: number }
  className?: string
  children: ReactNode
}

/**
 * Elemento de lista que, al llegar con el scroll, cae desde arriba algo girado, rebota un poco y se
 * asienta en su postura de reposo (animación folder-drop de index.css). Solo una vez. Hasta entonces
 * está invisible; con "reducir movimiento" aparece directamente, ya en su postura, sin animación.
 */
export function DropOnScroll({ tilt, column, rest, className = '', children }: DropOnScrollProps) {
  const { ref, revealed } = useRevealOnce<HTMLLIElement>(0.02)
  // El retraso va en línea: si fuera una clase, la propiedad `animation` de la caída lo pisaría.
  // --col es la columna en móvil o en escritorio, según la pantalla. --rest es la postura final: va
  // fija en `transform` (sin animación) y la caída termina en ella.
  const style = {
    '--tilt': `${tilt}deg`,
    '--col-m': column.mobile,
    '--col-d': column.desktop,
    ...(rest && {
      '--rest-y': `${rest.offsetY}px`,
      '--rest': `translateY(calc(var(--rest-y) * var(--rest-k))) rotate(${rest.rotate}deg)`,
      transform: 'var(--rest)',
    }),
    animationDelay: 'calc(var(--col) * 120ms)',
  } as CSSProperties
  return (
    <li
      ref={ref}
      style={style}
      className={`[--col:var(--col-m)] [--rest-k:0.5] lg:[--col:var(--col-d)] lg:[--rest-k:1] ${revealed ? 'motion-safe:animate-folder-drop' : 'motion-safe:opacity-0'} ${className}`}
    >
      {children}
    </li>
  )
}
