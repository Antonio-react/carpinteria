import { useCallback, useEffect, useState } from 'react'

/**
 * Para esconder una barra al bajar y mostrarla al subir (aprovecha mejor la pantalla del móvil).
 * - Nunca se esconde en los primeros `offset` px (arriba del todo siempre se ve).
 * - Ignora movimientos de menos de `tolerance` px (un temblor del dedo no la hace parpadear).
 * Devuelve si está escondida y `reveal()` para mostrarla a mano (p. ej. al recibir el foco).
 */
export function useHideOnScroll(offset = 80, tolerance = 6) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = Math.max(window.scrollY, 0)
    let frame = 0
    const update = () => {
      frame = 0
      const y = Math.max(window.scrollY, 0) // en iOS el rebote da valores negativos
      if (y <= offset) {
        setHidden(false)
        last = y
        return
      }
      const delta = y - last
      if (Math.abs(delta) < tolerance) return
      setHidden(delta > 0)
      last = y
    }
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', request, { passive: true })
    return () => {
      window.removeEventListener('scroll', request)
      cancelAnimationFrame(frame)
    }
  }, [offset, tolerance])

  const reveal = useCallback(() => setHidden(false), [])
  return { hidden, reveal }
}
