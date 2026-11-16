import type { ReactNode } from 'react'

interface DimensionLabelProps {
  children: ReactNode
  /** light = sobre fondo claro (lápiz rojo) · dark = sobre fondo oscuro (rojo más claro, para que se lea). */
  tone?: 'light' | 'dark'
}

/** Cota de plano: línea de medida con sus dos topes, a cada lado del rótulo. Decorativa. */
function Tick() {
  return (
    <span
      aria-hidden="true"
      className="h-[7px] w-[22px] shrink-0 border-x border-current bg-[linear-gradient(currentColor,currentColor)] bg-size-[100%_1px] bg-center bg-no-repeat opacity-70"
    />
  )
}

/**
 * Rótulo pequeño "en cota": en minúsculas y en rojo, entre dos líneas de medida, como se acota un
 * plano. Sustituye a los rótulos en MAYÚSCULAS espaciadas (aire de plantilla) en los títulos de
 * fichas, columnas del pie y pasos del formulario. Las casillas DENTRO de un cajetín siguen en
 * mayúsculas: ahí es letra de plano de verdad. Lo personal (tarjeta de contacto) va a máquina.
 */
export function DimensionLabel({ children, tone = 'light' }: DimensionLabelProps) {
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-normal tracking-normal normal-case ${tone === 'dark' ? 'text-pencil-light' : 'text-pencil'}`}>
      <Tick />
      {children}
      <Tick />
    </span>
  )
}
