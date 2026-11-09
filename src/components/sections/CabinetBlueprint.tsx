/*
 * Plano a lápiz del mueble del hero, trazado SOBRE la foto: mismo lienzo que las capas del hero
 * (1656 × 1925 px), así al mover el comparador cada línea del plano cae sobre su borde real.
 * Las coordenadas están medidas sobre la foto en % del lienzo (x = % del ancho, y = % del alto).
 * Las cotas no llevan cifras: no inventamos medidas.
 * Las líneas usan pathLength=1 para trazarse con stroke-dashoffset (variable --draw, 1 → 0).
 */
type Point = readonly [number, number]

const W = 1656
const H = 1925
const px = ([x, y]: Point) => `${((x / 100) * W).toFixed(1)} ${((y / 100) * H).toFixed(1)}`
const line = (...points: Point[]) => `M ${points.map(px).join(' L ')}`
const shape = (...points: Point[]) => `${line(...points)} Z`

// Contornos principales
const CABINET = shape([9, 35.2], [88.9, 0.25], [87.7, 78.75], [8.4, 70])
const SHELF = shape([88.9, 0.25], [99.6, 8.5], [98.8, 77], [87.7, 78.75])
const TV = shape([32.61, 42.6], [72.46, 33.25], [71.74, 68.47], [32.31, 66.6])
const BASE = `${line([8.1, 70], [87.7, 78.75], [98.8, 77.2], [98.8, 97.5], [43.8, 89.5], [27.9, 87], [8.1, 81.2])} Z`
const FIREPLACE = shape([17.15, 71.25], [27.3, 72.75], [27, 85.5], [17.15, 83.25])
const FIREPLACE_GLASS = shape([17.8, 72.1], [26.7, 73.4], [26.5, 84.7], [17.8, 82.6])
const SOCKETS = `${shape([53.4, 78.5], [59.25, 78.5], [59.25, 82], [53.4, 82])} ${shape([53.4, 82.5], [59.25, 82.5], [59.25, 86.1], [53.4, 86.1])}`

// Baldas de la estantería y juntas entre paneles
const SHELVES = [line([89.5, 21], [98.2, 26.25]), line([89.2, 39.5], [97.9, 43]), line([88.6, 58.25], [97.6, 59.5])].join(' ')
const JOINTS = [
  line([20.9, 30.3], [20.3, 71.3]),
  line([32.85, 24.6], [32.6, 42.6]),
  line([32.4, 66.75], [32.4, 72.6]),
  line([49.3, 17.3], [49.1, 38.8]),
  line([48.4, 67.6], [48.4, 74.4]),
  line([72.9, 7], [72.46, 33.25]),
  line([71.75, 68.5], [71.75, 77]),
  line([9, 38.6], [87.4, 10]),
  line([8.6, 48.25], [32.6, 42.75]),
  line([8.4, 56.9], [32.6, 54.75]),
  line([8.4, 65.9], [32.3, 66.6]),
  line([72.6, 33.25], [88, 29.5]),
  line([71.75, 68.5], [87.4, 69.15]),
].join(' ')

// Cotas en lápiz rojo: alto total (a la izquierda) y ancho del hueco de la tele (encima)
const COTA_HEIGHT = `${line([4, 35.2], [4, 81.2])} ${line([2.6, 35.2], [5.4, 35.2])} ${line([2.6, 81.2], [5.4, 81.2])}`
const COTA_TV = `${line([32.61, 39.4], [72.46, 30.05])} ${line([32.61, 38.2], [32.61, 40.6])} ${line([72.46, 28.85], [72.46, 31.25])}`

// Anotaciones (texto + línea de referencia)
interface Note {
  text: string
  at: Point
  anchor?: 'start' | 'middle'
  /** Línea de referencia desde el texto hasta la pieza (opcional). */
  leader?: readonly [Point, Point]
}

const NOTES: readonly Note[] = [
  { text: 'Puertas lacadas', at: [12, 23], leader: [[20, 24.5], [24, 36]] },
  { text: 'Estantería de roble', at: [50, 9.5], leader: [[78.5, 10.5], [93, 18]] },
  { text: 'Hueco para la tele', at: [52, 54], anchor: 'middle' },
  { text: 'Chimenea', at: [5, 93], leader: [[13, 91.5], [20, 84]] },
]

const STROKE = 'fill-none [stroke-dasharray:1] [stroke-dashoffset:var(--draw)] transition-[stroke-dashoffset] ease-(--ease-in-out-strong)'
const INK = `${STROKE} stroke-ink [stroke-width:3.2] duration-[1600ms]`
const FINE = `${STROKE} stroke-ink/55 [stroke-width:2] delay-200 duration-[1600ms]`
const PENCIL = `${STROKE} stroke-pencil [stroke-width:2.6] delay-500 duration-[1400ms]`
const FADE_IN = 'opacity-(--fill) transition-opacity delay-[1100ms] duration-700'

export function CabinetBlueprint() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="size-full" strokeLinecap="round" strokeLinejoin="round">
      <defs>
        <pattern id="plano-rayado" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="22" className="stroke-ink/30 [stroke-width:2]" />
        </pattern>
      </defs>

      {/* Zócalo negro: rayado, como se marca un material oscuro en un plano */}
      <path d={BASE} fill="url(#plano-rayado)" className={FADE_IN} />

      <path pathLength={1} d={JOINTS} className={FINE} />
      <path pathLength={1} d={SHELVES} className={FINE} />
      <path pathLength={1} d={SOCKETS} className={FINE} />
      <path pathLength={1} d={FIREPLACE_GLASS} className={FINE} />

      <path pathLength={1} d={CABINET} className={INK} />
      <path pathLength={1} d={SHELF} className={INK} />
      <path pathLength={1} d={TV} className={INK} />
      <path pathLength={1} d={BASE} className={INK} />
      <path pathLength={1} d={FIREPLACE} className={INK} />

      <path pathLength={1} d={COTA_HEIGHT} className={PENCIL} />
      <path pathLength={1} d={COTA_TV} className={PENCIL} />

      {/* En móvil el plano se ve más pequeño: letra mayor (en el lienzo) para que siga legible. */}
      <g className={FADE_IN}>
        {NOTES.map((note) => (
          <g key={note.text}>
            {note.leader && <path d={line(...note.leader)} className="fill-none stroke-pencil/70 [stroke-width:2]" />}
            <text
              x={(note.at[0] / 100) * W}
              y={(note.at[1] / 100) * H}
              textAnchor={note.anchor ?? 'start'}
              className="fill-pencil font-serif text-[64px] italic sm:text-[52px]"
            >
              {note.text}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}
