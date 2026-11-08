import type { ReactNode } from 'react'

interface ContainerProps {
  className?: string
  children: ReactNode
}

/** Márgenes laterales comunes a toda la web: los bordes de todos los bloques quedan alineados. */
export function Container({ className = '', children }: ContainerProps) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>
}
