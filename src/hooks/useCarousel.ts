import { useCallback, useState } from 'react'

/** Índice de un carrusel circular (al pasar del último vuelve al primero). */
export function useCarousel(length: number, initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex)

  const goTo = useCallback((next: number) => setIndex(((next % length) + length) % length), [length])
  const next = useCallback(() => setIndex((current) => (current + 1) % length), [length])
  const previous = useCallback(() => setIndex((current) => (current - 1 + length) % length), [length])

  /** Distancia más corta (con signo) de un elemento al central, teniendo en cuenta la vuelta. */
  const offsetOf = useCallback(
    (itemIndex: number) => {
      let offset = itemIndex - index
      if (offset > length / 2) offset -= length
      if (offset < -length / 2) offset += length
      return offset
    },
    [index, length],
  )

  return { index, goTo, next, previous, offsetOf }
}
