import type { Segment, Sketch } from '@/data/sketches'

interface PencilSketchProps {
  sketch: Sketch
  /** Cambia el pulso del trazo: así dos huecos con el mismo dibujo no salen calcados. */
  seed?: number
  className?: string
}

/** Pseudoaleatorio estable (mismo resultado en cada render y en el servidor). */
function jitter(seed: number) {
  let state = (seed * 9301 + 49297) % 233280
  return () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280 - 0.5
  }
}

/** Alarga un segmento `extra` unidades por cada lado: los carpinteros pasan el trazo de la esquina. */
function overshoot([x1, y1, x2, y2]: Segment, extra: number): Segment {
  const length = Math.hypot(x2 - x1, y2 - y1) || 1
  const dx = ((x2 - x1) / length) * extra
  const dy = ((y2 - y1) / length) * extra
  return [x1 - dx, y1 - dy, x2 + dx, y2 + dy]
}

/**
 * Boceto a lápiz: cada línea se pasa un poco de las esquinas, tiembla levemente y lleva un segundo
 * trazo muy suave encima (como el grafito repasado). Las cotas van en lápiz rojo con sus marcas.
 * Decorativo: quien lo usa pone el texto alternativo.
 */
export function PencilSketch({ sketch, seed = 1, className = '' }: PencilSketchProps) {
  const random = jitter(seed)
  const wobble = (segment: Segment): Segment => segment.map((value) => value + random() * 2.2) as unknown as Segment
  const path = (segments: readonly Segment[]) =>
    segments.map(([x1, y1, x2, y2]) => `M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`).join('')

  const lines = sketch.lines.map((segment) => wobble(overshoot(segment, 5)))
  const retrace = sketch.lines.map((segment) => wobble(overshoot(segment, 2)))
  // Marcas perpendiculares en los dos extremos de cada cota.
  const cotas = sketch.cotas.flatMap((segment) => {
    const [x1, y1, x2, y2] = wobble(segment)
    const length = Math.hypot(x2 - x1, y2 - y1) || 1
    const nx = (-(y2 - y1) / length) * 5
    const ny = ((x2 - x1) / length) * 5
    return [
      [x1, y1, x2, y2],
      [x1 - nx, y1 - ny, x1 + nx, y1 + ny],
      [x2 - nx, y2 - ny, x2 + nx, y2 + ny],
    ] as Segment[]
  })

  return (
    <svg viewBox="0 0 200 240" aria-hidden="true" className={className} fill="none" strokeLinecap="round">
      <path d={path(lines)} stroke="rgb(58 54 50 / 0.85)" strokeWidth={1.4} />
      <path d={path(retrace)} stroke="rgb(58 54 50 / 0.3)" strokeWidth={0.8} />
      <path d={path(cotas)} className="stroke-pencil" strokeWidth={1.1} />
    </svg>
  )
}
