import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { SawSpinner } from '@/components/ui/SawSpinner'

interface LazySectionProps {
  /** id de la sección: existe desde el principio, así los enlaces /#id funcionan antes de cargarla. */
  id: string
  /** Alto reservado mientras no se ha cargado (evita saltos de maquetación). */
  minHeight: string
  className?: string
  /** El ancla (/ruta#id) solo hace bajar hasta aquí en móvil; en escritorio la página se abre arriba. */
  anchorMobileOnly?: boolean
  children: ReactNode
}

/**
 * Carga diferida: no monta (ni descarga) su contenido hasta que el usuario se acerca con el scroll.
 * Pensado para envolver componentes cargados con React.lazy.
 */
export function LazySection({ id, minHeight, className = '', anchorMobileOnly = false, children }: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Si alguien llega con un enlace directo a esta sección, se carga ya.
  const [visible, setVisible] = useState(() => window.location.hash === `#${id}`)

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div ref={ref} id={id} data-anchor-mobile-only={anchorMobileOnly || undefined} className={className} style={visible ? undefined : { minHeight }}>
      {visible ? (
        <Suspense
          fallback={
            <div className="grid place-items-center text-oak" style={{ minHeight }}>
              <SawSpinner />
            </div>
          }
        >
          {children}
        </Suspense>
      ) : null}
    </div>
  )
}
