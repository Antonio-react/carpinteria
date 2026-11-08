import { useRef, useState, type PointerEvent, type ReactNode } from 'react'

interface BeforeAfterProps {
  /** Capa de la izquierda ("antes"). */
  before: ReactNode
  /** Capa de la derecha ("después"), recortada por la barra. */
  after: ReactNode
  beforeLabel: string
  afterLabel: string
  /** Nombre accesible del control ("Comparar el plano con el mueble terminado"). */
  label: string
  /** Posición inicial de la barra, en % (0–100). */
  initial?: number
  /** Tamaño / proporción / esquinas del marco. */
  className?: string
}

// La barra no llega del todo a los bordes: el tirador siempre se ve entero.
const MIN = 4
const MAX = 96
const clamp = (value: number) => Math.min(Math.max(value, MIN), MAX)

/**
 * Comparador "antes / después" con una barra que se arrastra (ratón o dedo).
 * - touch-action: pan-y → en móvil el gesto vertical sigue siendo scroll de la página.
 * - Accesible: debajo hay un <input type="range"> (teclado: flechas, Inicio/Fin) que mueve la misma barra.
 */
export function BeforeAfter({ before, after, beforeLabel, afterLabel, label, initial = 50, className = '' }: BeforeAfterProps) {
  const frame = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(initial)
  const [dragging, setDragging] = useState(false)

  const moveTo = (clientX: number) => {
    const rect = frame.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    setPosition(clamp(((clientX - rect.left) / rect.width) * 100))
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    // Captura el puntero para seguir el arrastre aunque se salga del marco (si el navegador no puede, se sigue igual).
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* sin captura: el arrastre funciona mientras el dedo esté dentro del marco */
    }
    setDragging(true)
    moveTo(event.clientX)
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging) moveTo(event.clientX)
  }
  const stop = () => setDragging(false)

  return (
    <div
      ref={frame}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stop}
      onPointerCancel={stop}
      className={`relative cursor-ew-resize touch-pan-y overflow-hidden select-none ${className}`}
    >
      {/* Cada lado lleva su etiqueta dentro: se tapa junto con su capa. */}
      <div className="absolute inset-0">
        {before}
        <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium tracking-[0.12em] text-ink uppercase shadow-sm">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        {after}
        <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium tracking-[0.12em] text-paper uppercase backdrop-blur">
          {afterLabel}
        </span>
      </div>

      {/* Control accesible (invisible): mueve la misma barra con el teclado */}
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={Math.round(position)}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={label}
        aria-valuetext={`${Math.round(((position - MIN) / (MAX - MIN)) * 100)} % ${beforeLabel.toLowerCase()}`}
        className="peer sr-only"
      />

      {/* Barra y tirador */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0" style={{ left: `${position}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-paper shadow-[0_0_0_1px_rgb(28_25_22/0.15)]" />
        <div
          className={`absolute top-1/2 left-0 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-[0_8px_24px_-6px_rgb(28_25_22/0.45)] ring-ink/50 ring-offset-2 ring-offset-paper/0 transition-transform duration-150 ease-(--ease-out-strong) [.peer:focus-visible~*_&]:ring-2 ${dragging ? 'scale-95' : ''}`}
        >
          <span className="text-sm tracking-[-0.1em]">←→</span>
        </div>
      </div>
    </div>
  )
}
