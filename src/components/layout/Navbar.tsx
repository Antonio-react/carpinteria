import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { NavPill } from '@/components/layout/NavPill'
import { BrandBadge } from '@/components/ui/BrandBadge'
import { QUOTE_PATH, NAV_LINKS } from '@/data/navigation'
import { useCurtainCovered } from '@/hooks/useCurtainCovered'
import { useHideOnScroll } from '@/hooks/useHideOnScroll'
import { useScrolled } from '@/hooks/useScrolled'
import { useSamePageScrollTop } from '@/hooks/useSamePageScrollTop'

const MENU_ID = 'menu-movil'

/**
 * Barra de navegación fija, a todo el ancho (alineada con el hero).
 * - Escritorio: logo a la izquierda del todo, navegación en píldora CENTRADA y botón
 *   "Pedir presupuesto" a la derecha del todo.
 * - Móvil/tableta: logo y botón de menú (pantalla completa).
 * - Escritorio: SIN barra de fondo. Solo flotan las tres piezas (logo, píldora translúcida y botón), y cada
 *   una cambia de color según lo que tenga debajo: claras sobre fondo oscuro, oscuras sobre fondo claro.
 * - Móvil/tableta: barra a todo el ancho, transparente sobre el hero y sólida sobre el contenido claro.
 * Se esconde al bajar y vuelve al subir en todas las pantallas (nunca con el menú abierto).
 */
export function Navbar() {
  const { pathname } = useLocation()
  const covered = useCurtainCovered(pathname)
  // El menú guarda en qué página se abrió: al cambiar de página queda cerrado solo.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const menuOpen = openOn === pathname
  const closeMenu = useCallback(() => setOpenOn(null), [])
  const toggleMenu = () => setOpenOn((current) => (current === pathname ? null : pathname))
  const scrollTopIfSame = useSamePageScrollTop()

  const overlay = !covered || menuOpen
  const variant = overlay ? 'overlay' : 'solid'
  // Fuera de Inicio (p. ej. la exposición de Trabajos) lo que pasa por debajo no siempre es oscuro
  // (las tarjetas del carrusel): en cuanto hay scroll, la barra transparente coge fondo oscuro.
  const scrolled = useScrolled(8)
  const darkBacking = overlay && !menuOpen && pathname !== '/' && scrolled
  const { hidden, reveal } = useHideOnScroll()
  const tucked = hidden && !menuOpen

  return (
    <>
      <header
        onFocusCapture={reveal}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color,transform] duration-300 ease-out-strong motion-reduce:transition-none lg:border-transparent ${
          tucked ? '-translate-y-full' : ''
        } ${
          overlay
            ? `text-white ${darkBacking ? 'border-white/10 max-lg:bg-night/80 max-lg:backdrop-blur-md' : 'border-transparent'}`
            : 'border-ink/10 text-ink max-lg:bg-bone/85 max-lg:backdrop-blur-md'
        }`}
      >
        <div className="relative flex h-16 items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-10">
          <Link
            to="/"
            aria-label="Carpintería y Decoración, ir a inicio"
            onClick={() => {
              closeMenu()
              scrollTopIfSame('/')
            }}
            className="grid min-h-11 min-w-11 place-items-center rounded-full transition-transform duration-150 active:scale-95">
            {/* Escritorio: unos px más grande (56); el dibujo es vectorial, al escalarlo no se emborrona. */}
            <BrandBadge size={48} className="lg:scale-[1.1667]" />
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
            <NavPill links={NAV_LINKS} variant={variant} backed={darkBacking} />
          </div>

          <Link
            to={QUOTE_PATH}
            className={`group hidden min-h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.97] lg:inline-flex ${
              overlay ? 'bg-paper text-ink hover:bg-white' : 'bg-ink text-paper hover:bg-ink/90'
            }`}
          >
            Pedir presupuesto
            <span aria-hidden="true" className="transition-transform duration-200 ease-out-strong group-hover:translate-x-0.5">
              →
            </span>
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={toggleMenu}
            className="relative z-50 grid size-11 place-items-center rounded-full transition-transform duration-150 active:scale-95 lg:hidden"
          >
            <span aria-hidden="true" className="relative block h-3 w-6">
              <span className={`absolute left-0 h-0.5 w-6 rounded bg-current transition-transform duration-200 ease-out-strong ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-0.5 w-6 rounded bg-current transition-transform duration-200 ease-out-strong ${menuOpen ? 'top-1.5 -rotate-45' : 'top-3'}`} />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu id={MENU_ID} open={menuOpen} links={NAV_LINKS} onClose={closeMenu} />
    </>
  )
}
