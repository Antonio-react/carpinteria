import type { ReactNode } from 'react'

const STAGGER_MS = 140

interface DropInProps {
  /** Posición en la secuencia de entrada (0, 1, 2...). */
  order: number
  as?: 'div' | 'span' | 'p'
  /** false = aparece ya colocado, sin caer (p. ej. al volver a Inicio, que solo cae la primera vez). */
  play?: boolean
  className?: string
  children: ReactNode
}

/** Elemento que cae desde arriba al cargar, escalonado. Sin animación con prefers-reduced-motion. */
export function DropIn({ order, as: Tag = 'div', play = true, className = '', children }: DropInProps) {
  return (
    <Tag className={`${play ? 'motion-safe:animate-drop' : ''} ${className}`} style={play ? { animationDelay: `${order * STAGGER_MS}ms` } : undefined}>
      {children}
    </Tag>
  )
}
