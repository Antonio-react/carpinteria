import type { ReactNode } from 'react'
import { useRevealOnce } from '@/hooks/useRevealOnce'

interface PencilUnderlineProps {
  children: ReactNode
}

/**
 * Subrayado a lápiz rojo de carpintero bajo una palabra clave, trazado a mano (algo irregular)
 * cuando aparece en pantalla. Usar en pocos sitios: es un acento, no un estilo de título.
 */
export function PencilUnderline({ children }: PencilUnderlineProps) {
  const { ref, revealed } = useRevealOnce<HTMLSpanElement>(0.6)
  return (
    <span ref={ref} data-drawn={revealed} className="relative inline-block whitespace-nowrap [--draw:1] data-[drawn=true]:[--draw:0]">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 16"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.18em] left-[-2%] h-[0.32em] w-[104%] overflow-visible"
      >
        {/* Dos pasadas de lápiz, como cuando se marca una línea con prisa */}
        <path
          pathLength={1}
          d="M2 9 C 40 5, 90 11, 130 7 S 185 6, 198 8"
          className="fill-none stroke-pencil [stroke-dasharray:1] [stroke-dashoffset:var(--draw)] [stroke-linecap:round] [stroke-width:3.2] transition-[stroke-dashoffset] duration-700 ease-(--ease-out-strong)"
        />
        <path
          pathLength={1}
          d="M14 12 C 60 9, 120 14, 186 10"
          className="fill-none stroke-pencil/60 [stroke-dasharray:1] [stroke-dashoffset:var(--draw)] [stroke-linecap:round] [stroke-width:2] transition-[stroke-dashoffset] delay-300 duration-700 ease-(--ease-out-strong)"
        />
      </svg>
    </span>
  )
}
