import { useEffect } from 'react'
import { startSitePrefetch } from '@/utils/prefetchSite'

/**
 * Empieza la descarga anticipada (ver utils/prefetchSite.ts) en cuanto la página ha terminado de cargar
 * (en Inicio, con la foto del hero ya descargada), en cualquier página y sin esperar a que el visitante
 * baje: así, si desde el hero se va directo a otra página, ya está cargada. Dentro, cada paso espera
 * además a que el navegador esté libre, para no frenar nada de lo que se está viendo.
 */
export function useSitePrefetch() {
  useEffect(() => {
    if (document.readyState === 'complete') {
      startSitePrefetch()
      return
    }
    window.addEventListener('load', startSitePrefetch, { once: true })
    return () => window.removeEventListener('load', startSitePrefetch)
  }, [])
}
