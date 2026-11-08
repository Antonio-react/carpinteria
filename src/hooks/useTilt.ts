import { useRef, type PointerEvent } from 'react'

const MAX_X = 8 // grados de inclinación arriba/abajo
const MAX_Y = 11 // grados a izquierda/derecha

/**
 * Inclina un elemento hacia el lado donde está el cursor (efecto 3D de la tarjeta central).
 * Solo con ratón (no en táctil) y nunca con prefers-reduced-motion.
 * Escribe variables CSS directamente en el elemento: --rx / --ry.
 */
export function useTilt<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null)

  const canTilt = () =>
    enabled && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onPointerMove = (event: PointerEvent) => {
    const element = ref.current
    if (!element || event.pointerType !== 'mouse' || !canTilt()) return
    const box = element.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    element.style.setProperty('--ry', `${(x * 2 * MAX_Y).toFixed(2)}deg`)
    element.style.setProperty('--rx', `${(-y * 2 * MAX_X).toFixed(2)}deg`)
  }

  const onPointerLeave = () => {
    ref.current?.style.setProperty('--ry', '0deg')
    ref.current?.style.setProperty('--rx', '0deg')
  }

  return { ref, onPointerMove, onPointerLeave }
}
