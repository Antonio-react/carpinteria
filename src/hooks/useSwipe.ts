import { useRef, type MouseEvent, type PointerEvent } from 'react'

const DISTANCE = 40 // px mínimos de arrastre
const VELOCITY = 0.35 // o un gesto rápido (px/ms), aunque sea corto

/**
 * Deslizamiento horizontal con el DEDO (o lápiz) para pasar de elemento.
 * Con ratón no hace nada: en escritorio se navega con las flechas (botones o teclado), así un
 * arrastre accidental al hacer clic no cambia de elemento.
 * Si el gesto fue un arrastre, anula el clic que viene detrás (para no abrir la tarjeta sin querer).
 * Ignora la rueda del ratón a propósito: nada de "scroll jacking".
 */
export function useSwipe(onLeft: () => void, onRight: () => void) {
  const start = useRef<{ x: number; y: number; time: number; id: number } | null>(null)
  const dragged = useRef(false)

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse') return // escritorio: flechas
    if (start.current) return // otro dedo: se ignora
    start.current = { x: event.clientX, y: event.clientY, time: performance.now(), id: event.pointerId }
    dragged.current = false
  }

  const onPointerUp = (event: PointerEvent) => {
    const origin = start.current
    if (!origin || origin.id !== event.pointerId) return
    start.current = null
    const dx = event.clientX - origin.x
    const dy = event.clientY - origin.y
    if (Math.abs(dx) < Math.abs(dy)) return // gesto vertical: es scroll de la página
    const velocity = Math.abs(dx) / Math.max(1, performance.now() - origin.time)
    if (Math.abs(dx) >= DISTANCE || velocity > VELOCITY) {
      dragged.current = Math.abs(dx) > 6
      if (dx < 0) onLeft()
      else onRight()
    }
  }

  const onPointerCancel = () => {
    start.current = null
  }

  /** Para colocar en onClickCapture del contenedor. */
  const onClickCapture = (event: MouseEvent) => {
    if (dragged.current) {
      event.preventDefault()
      event.stopPropagation()
      dragged.current = false
    }
  }

  return { onPointerDown, onPointerUp, onPointerCancel, onClickCapture }
}
