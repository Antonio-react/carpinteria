import { useEffect, useRef, useState, type PointerEvent } from 'react'

interface ScrollMarqueeProps {
  /** Línea de arriba (serif cursiva). */
  primary: string
  /** Línea de abajo (letra ancha y translúcida, como el nombre del hero). */
  secondary: string
}

const REPEAT = 4
const SPEED = 38 // px por segundo (despacio)
const RESUME_AFTER = 1200 // ms tras soltar el dedo

/**
 * Dos líneas de texto gigante que se desplazan solas, despacio y en sentidos opuestos.
 * Eco del nombre gigante del hero. Se puede interactuar con ella:
 * - Escritorio: se para con el ratón encima.
 * - Móvil: al tocarla se para; arrastrando el dedo a los lados se mueve a mano (el gesto
 *   vertical sigue siendo scroll de la página). Al soltar, sigue sola.
 * - Botón de pausa (teclado y lectores de pantalla: lo que se mueve solo debe poder pararse).
 * Solo se anima mientras está en pantalla. Con movimiento reducido, quieta.
 * Las líneas son decorativas (aria-hidden): el texto ya está en la página.
 */
export function ScrollMarquee({ primary, secondary }: ScrollMarqueeProps) {
  const root = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const offset = useRef(0)
  const hovering = useRef(false)
  const touching = useRef(false)
  const lastX = useRef(0)
  const resumeAt = useRef(0)
  const [userPaused, setUserPaused] = useState(false)
  const userPausedRef = useRef(false)
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    userPausedRef.current = userPaused
  }, [userPaused])

  /** Coloca las dos líneas según el desplazamiento acumulado. */
  const paint = () => {
    const a = top.current
    const b = bottom.current
    if (!a || !b) return
    const unitA = a.scrollWidth / REPEAT
    const unitB = b.scrollWidth / REPEAT
    if (!unitA || !unitB) return
    const x = ((offset.current % unitA) + unitA) % unitA
    const y = ((offset.current * 0.8) % unitB + unitB) % unitB
    a.style.transform = `translate3d(${-x}px, 0, 0)`
    b.style.transform = `translate3d(${y - unitB}px, 0, 0)`
  }

  useEffect(() => {
    if (reduced) return
    let frame = 0
    let last = 0
    let visible = false

    const tick = (time: number) => {
      const dt = last ? Math.min(time - last, 64) : 0
      last = time
      const stopped = hovering.current || touching.current || userPausedRef.current || time < resumeAt.current
      if (!stopped) offset.current += (SPEED * dt) / 1000
      paint()
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      const now = entry?.isIntersecting ?? false
      if (now && !visible) {
        last = 0
        frame = requestAnimationFrame(tick)
      } else if (!now && visible) {
        cancelAnimationFrame(frame)
      }
      visible = now
    })
    if (root.current) observer.observe(root.current)
    paint()
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [reduced])

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') hovering.current = true
  }
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') hovering.current = false
  }
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') return
    touching.current = true
    lastX.current = event.clientX
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!touching.current) return
    // Arrastrar a la derecha mueve la línea de arriba a la derecha.
    offset.current -= event.clientX - lastX.current
    lastX.current = event.clientX
    paint()
  }
  const release = () => {
    if (!touching.current) return
    touching.current = false
    resumeAt.current = performance.now() + RESUME_AFTER
  }

  const row = (text: string) => Array.from({ length: REPEAT }, (_, index) => <span key={index}>{text}&nbsp;·&nbsp;</span>)

  return (
    <div className="relative">
      <div
        ref={root}
        aria-hidden="true"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        className="touch-pan-y overflow-hidden py-10 select-none lg:py-16"
      >
        <div ref={top} className="w-max font-serif text-[clamp(4rem,13vw,11rem)] leading-[1.05] whitespace-nowrap text-ink italic will-change-transform">
          {row(primary)}
        </div>
        <div
          ref={bottom}
          className="w-max text-[clamp(3rem,10vw,8.5rem)] leading-[1] font-semibold tracking-[-0.02em] whitespace-nowrap text-ink/12 uppercase will-change-transform [font-stretch:110%]"
        >
          {row(secondary)}
        </div>
      </div>

      {!reduced && (
        <button
          type="button"
          onClick={() => setUserPaused((paused) => !paused)}
          aria-pressed={userPaused}
          aria-label={userPaused ? 'Reanudar el texto en movimiento' : 'Pausar el texto en movimiento'}
          className="absolute right-4 bottom-2 grid size-11 place-items-center rounded-full text-ink/40 transition-colors duration-150 hover:text-ink focus-visible:text-ink sm:right-6 lg:right-10 lg:bottom-4"
        >
          {userPaused ? (
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 fill-current">
              <path d="M4 2.5v11l9-5.5z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 fill-current">
              <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}
