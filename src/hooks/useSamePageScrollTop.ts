import { useLocation } from 'react-router'

/**
 * Para enlaces que pueden apuntar a la página en la que ya estás (logo e "Inicio" → "/").
 * React Router no hace nada al navegar a la misma ruta, así que la página se quedaría donde
 * está. Este hook devuelve un manejador de clic que, en ese caso, sube arriba del todo con un
 * desplazamiento suave (en Inicio se ve bajar la cortina y volver a montarse el mueble).
 * Con "reducir movimiento" activado, salta directamente.
 *
 * Uso: const scrollTopIfSame = useSamePageScrollTop()
 *      <Link to="/" onClick={() => scrollTopIfSame('/')}>
 */
export function useSamePageScrollTop() {
  const { pathname, hash } = useLocation()

  return (to: string) => {
    if (to !== pathname || hash) return // otra página o un ancla: ya lo gestiona ScrollManager
    // En el siguiente fotograma: así da tiempo a que el menú móvil se cierre y libere el scroll.
    requestAnimationFrame(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'instant' : 'smooth' })
    })
  }
}
