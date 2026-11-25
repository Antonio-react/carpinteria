import type { CSSProperties, ReactNode } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'

interface DropOnScrollProps {
  /** Giro con el que cae (grados; negativo = hacia la izquierda). */
  tilt: number
  /** Posición en su fila en móvil (2 columnas) y en escritorio (3): las de una misma fila caen una tras otra. */
  column: { mobile: number; desktop: number }
  className?: string
  children: ReactNode
}

/**
 * Elemento de lista que, al llegar con el scroll, cae desde arriba algo girado, rebota un poco y se
 * asienta (animación folder-drop de index.css). Solo una vez. Hasta entonces está invisible; con
 * "reducir movimiento" aparece directamente, sin animación.
 */
export function DropOnScroll({ tilt, column, className = '', children }: DropOnScrollProps) {
  const { ref, revealed } = useRevealOnce<HTMLLIElement>(0.02)
  // El retraso va en línea: si fuera una clase, la propiedad `animation` de la caída lo pisaría.
  // --col es la columna en móvil o en escritorio, según la pantalla.
  const style = {
    '--tilt': `${tilt}deg`,
    '--col-m': column.mobile,
    '--col-d': column.desktop,
    animationDelay: 'calc(var(--col) * 120ms)',
  } as CSSProperties
  return (
    <li
      ref={ref}
      style={style}
      className={`[--col:var(--col-m)] lg:[--col:var(--col-d)] ${revealed ? 'motion-safe:animate-folder-drop' : 'motion-safe:opacity-0'} ${className}`}
    >
      {children}
    </li>
  )
}
