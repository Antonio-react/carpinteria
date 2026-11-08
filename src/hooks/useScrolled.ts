import { useEffect, useState } from 'react'

/** true cuando la página se ha desplazado más de `threshold` píxeles. */
export function useScrolled(threshold = 0) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > threshold)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [threshold])

  return scrolled
}
