import { useEffect, useRef } from 'react'

// Marcas de la cinta: una larga cada 40 px (como los centímetros) y cortas cada 8 px (milímetros).
const TAPE_STYLE = {
  backgroundColor: 'var(--color-tape)',
  backgroundImage:
    'linear-gradient(to right, rgb(28 25 22 / 0.7) 1px, transparent 1px), linear-gradient(to right, rgb(28 25 22 / 0.35) 1px, transparent 1px)',
  backgroundSize: '40px 100%, 8px 45%',
  backgroundRepeat: 'repeat-x',
} as const

/**
 * Cinta métrica en el borde superior: se "despliega" según bajas por la página (indicador de
 * progreso de lectura). Las marcas no se estiran: la cinta se destapa, no se escala.
 * El gancho metálico va en la punta. Decorativa (aria-hidden).
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
      if (tape.current) tape.current.style.clipPath = `inset(0 ${(100 - progress * 100).toFixed(2)}% 0 0)`
      if (hook.current) {
        hook.current.style.left = `${percent}%`
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

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-2">
      <div ref={tape} className="h-full shadow-[0_1px_2px_rgb(0_0_0/0.25)]" style={{ ...TAPE_STYLE, clipPath: 'inset(0 100% 0 0)' }} />
      {/* Gancho metálico de la punta */}
      <div ref={hook} className="absolute top-0 h-3 w-1 -translate-x-full rounded-b-[1px] bg-[#3a3632] opacity-0 shadow-[0_1px_2px_rgb(0_0_0/0.35)]" />
    </div>
  )
}
