import { useEffect, useState } from 'react'
import { DARK_TOP_PATHS } from '@/data/sheets'

/**
 * true cuando el contenido claro (la "cortina", marcado con data-curtain) ya ha subido hasta
 * la barra de navegación. Así la barra pasa de transparente a sólida justo cuando deja de
 * estar sobre la cabecera oscura (hero de Inicio, exposición de Trabajos).
 * Si la página no tiene cortina (el resto), devuelve true.
 */
export function useCurtainCovered(pathname: string, navHeight = 80) {
  const darkTop = DARK_TOP_PATHS.includes(pathname)
  // Con cabecera oscura empieza transparente; en el resto, sólida. Así no parpadea al cargar.
  const [covered, setCovered] = useState(() => !darkTop)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const curtain = document.querySelector<HTMLElement>('[data-curtain]')
      // Sin cortina todavía (la página aún se está cargando): con cabecera oscura, transparente; en el resto, sólida.
      setCovered(curtain ? curtain.getBoundingClientRect().top <= navHeight : !darkTop)
    }
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    // La página nueva puede tardar un instante en montarse (carga diferida).
    request()
    const retry = window.setTimeout(request, 300)
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      window.clearTimeout(retry)
      cancelAnimationFrame(frame)
    }
  }, [pathname, navHeight, darkTop])

  return covered
}
