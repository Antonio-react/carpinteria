import type { ReactNode } from 'react'

const STAGGER_MS = 140

interface DropInProps {
  /** Posición en la secuencia de entrada (0, 1, 2...). */
  order: number
  as?: 'div' | 'span' | 'p'
  className?: string
  children: ReactNode
}

/** Elemento que cae desde arriba al cargar, escalonado. Sin animación con prefers-reduced-motion. */
export function DropIn({ order, as: Tag = 'div', className = '', children }: DropInProps) {
  return (
    <Tag className={`motion-safe:animate-drop ${className}`} style={{ animationDelay: `${order * STAGGER_MS}ms` }}>
      {children}
    </Tag>
  )
}
