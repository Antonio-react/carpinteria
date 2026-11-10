import { useId, type CSSProperties } from 'react'

type Point = readonly [number, number]

/** Filo de dientes (dibujo en horizontal): inclinado, estrecho en la punta y ancho junto al mango. */
const TOE: Point = [20, 16]
const HEEL: Point = [64, 22]
const TEETH_COUNT = 22

/** Dientes en zigzag a lo largo del filo, apuntando hacia abajo. */
const TEETH_PATH = (() => {
  const at = (t: number): Point => [TOE[0] + (HEEL[0] - TOE[0]) * t, TOE[1] + (HEEL[1] - TOE[1]) * t]
  let d = `M ${TOE[0]} ${TOE[1]}`
  for (let i = 0; i < TEETH_COUNT; i++) {
    const [tipX, tipY] = at((i + 0.5) / TEETH_COUNT)
    const [nextX, nextY] = at((i + 1) / TEETH_COUNT)
    d += ` L ${tipX.toFixed(2)} ${(tipY + 1.7).toFixed(2)} L ${nextX.toFixed(2)} ${nextY.toFixed(2)}`
  }
  return `${d} Z`
})()

/** Mango de roble oscuro: contorno ondulado y agujero alargado para la mano (regla par-impar). */
const HANDLE_PATH =
  'M 60 11 C 64 10.2 72.44 10.6 75.44 9.6 C 78.44 8.8 82.44 9.6 84.94 11.5 C 85.94 13.2 84.24 14.6 85.04 16.4 ' +
  'C 86.04 18.6 86.44 21.5 84.44 24 C 80.44 25.6 67 24.6 61.5 24.2 C 60.4 22 60.2 15 60 11 Z ' +
  'M 67.74 14.2 C 67.74 12.2 80.64 11.7 80.64 13.8 L 80.64 20 C 80.64 22.2 67.74 22.6 67.74 20.5 Z'

/** Motas de serrín: desvío al caer, retraso y posición (bajo la tabla, donde asoma la punta). */
const SAWDUST: readonly { dx: number; delay: number; x: number }[] = [
  { dx: -2.5, delay: 0, x: 24 },
  { dx: 1.5, delay: 0.18, x: 26.5 },
  { dx: 3, delay: 0.36, x: 29 },
  { dx: -1.5, delay: 0.54, x: 25 },
  { dx: 2, delay: 0.72, x: 28 },
]

/**
 * Animación del botón mientras se envía: un serrucho de verdad (lomo recto, filo inclinado, mango de roble
 * oscuro con agujero para la mano y tres remaches) va y viene atravesando una tabla, y el serrín cae por
 * debajo. Inclinado 30°: la punta asoma bajo la tabla y el mango nunca la toca (medido en toda la pasada).
 * La tabla se pinta encima de la hoja: lo que está dentro de la madera queda oculto.
 * Con prefers-reduced-motion queda quieto y sin serrín (el texto ya dice "Enviando…").
 */
export function SawingPlank() {
  const steel = useId()
  return (
    <svg viewBox="0 0 96 32" aria-hidden="true" className="h-9 w-[108px] overflow-visible">
      <defs>
        <linearGradient id={steel} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef0f3" />
          <stop offset="1" stopColor="#a3aab3" />
        </linearGradient>
      </defs>

      {/* Serrucho, dibujado en horizontal y colocado inclinado sobre el punto de corte. */}
      <g transform="translate(50 23.9) rotate(-30) translate(-44 -19.27)">
        <g className="motion-safe:animate-saw-stroke">
          <path d="M 21 12 L 64 12 L 64 22 L 20.5 16 Q 19.5 14 21 12 Z" fill={`url(#${steel})`} />
          <path d={TEETH_PATH} className="fill-[#8f969f]" />
          <path d="M 21 12.45 L 62 12.45" className="stroke-[#f2f4f6] [stroke-width:0.6] opacity-85" />
          {/* Agujero de la punta */}
          <rect x="22.5" y="13" width="3.2" height="1.4" rx="0.7" className="fill-ink" />
          {/* Mango: más corto en horizontal (escala 0,82 desde su frente, que agarra la hoja). */}
          <g transform="translate(60 0) scale(0.82 1) translate(-60 0)">
            <path fillRule="evenodd" d={HANDLE_PATH} className="fill-[#6b4226]" />
            <path d="M 60.6 11.4 C 64 10.7 72.44 11 75.44 10.1" className="fill-none stroke-[#94643e] [stroke-width:0.5] opacity-80" />
          </g>
          <circle cx="62.6" cy="14" r="0.75" className="fill-[#d6d9de]" />
          <circle cx="63.4" cy="17.6" r="0.75" className="fill-[#d6d9de]" />
          <circle cx="62.6" cy="21.2" r="0.75" className="fill-[#d6d9de]" />
        </g>
      </g>

      {/* Tabla, por delante de la hoja: canto claro arriba y veta. */}
      <rect x="4" y="23" width="88" height="8.5" rx="1" className="fill-oak" />
      <rect x="4" y="23" width="88" height="1.2" className="fill-[#c08350]" />
      <path d="M 8 26.5 C 20 25.5 30 28 44 26.7 M 56 28.5 C 66 27.5 76 29.5 88 28" className="fill-none stroke-oak-dark [stroke-width:0.7]" />

      {SAWDUST.map(({ dx, delay, x }) => (
        <circle
          key={x}
          cx={x}
          cy="31.8"
          r="1.1"
          className="fill-[#f0dcae] opacity-0 motion-safe:animate-sawdust motion-reduce:hidden"
          style={{ '--dx': `${dx}px`, animationDelay: `${delay}s` } as CSSProperties}
        />
      ))}
    </svg>
  )
}
