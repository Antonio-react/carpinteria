import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

const DESKTOP = '(min-width: 1024px)'

/**
 * Al cambiar de página, empieza arriba del todo.
 * Si la URL lleva ancla (/contacto#formulario-contacto), baja a esa sección:
 * - Llegando desde OTRA página: salto directo (ver bajar toda la página resultaría raro).
 * - En la misma página: desplazamiento suave (salvo con movimiento reducido).
 * - Anclas marcadas data-anchor-mobile-only: en escritorio se ignoran (la página se abre arriba).
 * Si la sección aún no existe (página cargando), lo reintenta unos instantes.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  const previousPath = useRef<string | null>(null)

  useEffect(() => {
    const cameFromOtherPage = previousPath.current !== pathname
    previousPath.current = pathname

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    const id = decodeURIComponent(hash.slice(1))
    let attempts = 0
    let frame = 0
    const tryScroll = () => {
      const target = document.getElementById(id)
      if (target) {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const behavior = cameFromOtherPage || reduced ? 'instant' : 'smooth'
        if (target.dataset.anchorMobileOnly === 'true') {
          // Escritorio: arriba. Móvil: el cuadro entero a la vista (al bajar, la barra se esconde,
          // así que basta un pequeño respiro en vez del hueco de la barra).
          const top = window.matchMedia(DESKTOP).matches ? 0 : target.getBoundingClientRect().top + window.scrollY - 12
          window.scrollTo({ top, left: 0, behavior })
          return
        }
        target.scrollIntoView({ behavior, block: 'start' })
        return
      }
      if (attempts++ < 60) frame = requestAnimationFrame(tryScroll)
    }
    if (cameFromOtherPage) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    tryScroll()
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}
