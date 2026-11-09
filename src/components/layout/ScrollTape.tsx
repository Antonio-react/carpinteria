import { useEffect, useRef, type PointerEvent } from 'react'

// Marcas de la cinta: una larga cada 40 px (como los centímetros) y cortas cada 8 px (milímetros).
// Cinta vertical: las marcas son rayas horizontales que salen del borde derecho de la pantalla.
const TAPE_STYLE = {
  backgroundColor: 'var(--color-tape)',
  backgroundImage:
    'linear-gradient(to bottom, rgb(28 25 22 / 0.7) 1px, transparent 1px), linear-gradient(to bottom, rgb(28 25 22 / 0.35) 1px, transparent 1px)',
  backgroundSize: '100% 40px, 45% 8px',
  backgroundPosition: 'right top',
  backgroundRepeat: 'repeat-y',
} as const

/**
 * Cinta métrica en el borde DERECHO, en lugar de la barra de desplazamiento del navegador (oculta en
 * index.css): se "despliega" hacia abajo según bajas por la página, como un metro que se tira.
 * Las marcas no se estiran: la cinta se destapa, no se escala. El gancho metálico va en la punta.
 *
 * Con ratón hace también de barra de desplazamiento: se puede pulsar (salta a esa altura) o
 * arrastrar, con una franja de agarre algo más ancha que la cinta. En pantallas táctiles no
 * intercepta nada (se desplaza con el dedo, como siempre). Para el teclado y los lectores de
 * pantalla la página se desplaza como siempre, así que la cinta es decorativa (aria-hidden).
 */
export function ScrollTape() {
  const tape = useRef<HTMLDivElement>(null)
  const hook = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
      const percent = (progress * 100).toFixed(2)
      if (tape.current) tape.current.style.clipPath = `inset(0 0 ${(100 - progress * 100).toFixed(2)}% 0)`
      if (hook.current) {
        hook.current.style.top = `${percent}%`
        hook.current.style.opacity = progress > 0.002 ? '1' : '0'
      }
    }
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    // La altura de la página cambia al cargar secciones diferidas.
    const observer = new ResizeObserver(request)
    observer.observe(document.body)
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])

  /** Lleva la página a la altura que corresponde a la posición vertical del puntero. */
  const scrollToPointer = (event: PointerEvent<HTMLDivElement>) => {
    const ratio = Math.min(Math.max(event.clientY / window.innerHeight, 0), 1)
    const max = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({ top: ratio * max, behavior: 'instant' })
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    event.preventDefault() // sin seleccionar texto al arrastrar
    event.currentTarget.setPointerCapture(event.pointerId)
    scrollToPointer(event)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) scrollToPointer(event)
  }

  return (
    <div
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      className="group pointer-events-none fixed inset-y-0 right-0 z-[55] flex w-4 justify-end pointer-fine:pointer-events-auto pointer-fine:cursor-ns-resize"
    >
      <div className="relative h-full w-1.5 transition-[width] duration-150 ease-out sm:w-2 pointer-fine:group-hover:w-2.5">
        {/* Rastro de la cinta (al pasar el ratón): indica que se puede agarrar aunque esté recogida. */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-150 pointer-fine:group-hover:opacity-25" style={TAPE_STYLE} />
        <div ref={tape} className="relative size-full shadow-[-1px_0_2px_rgb(0_0_0/0.25)]" style={{ ...TAPE_STYLE, clipPath: 'inset(0 0 100% 0)' }} />
        {/* Gancho metálico de la punta */}
        <div ref={hook} className="absolute right-0 h-1 w-2.5 -translate-y-full rounded-l-[1px] bg-[#3a3632] opacity-0 shadow-[-1px_0_2px_rgb(0_0_0/0.35)] sm:w-3" />
      </div>
    </div>
  )
}
