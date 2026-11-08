import { useEffect, useRef, useState } from 'react'

/**
 * Avisa (una sola vez) cuando el elemento entra en pantalla, para lanzar su animación justo
 * cuando el usuario llega a él con el scroll.
 * Con prefers-reduced-motion devuelve true desde el principio (sin animación).
 *
 * Uso: const { ref, revealed } = useRevealOnce<HTMLLIElement>()
 */
export function useRevealOnce<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const element = ref.current
    if (!element || revealed) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [revealed, threshold])

  return { ref, revealed }
}
