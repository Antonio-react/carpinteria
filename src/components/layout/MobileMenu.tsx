import { useEffect, useRef } from 'react'
import { NavLink as RouterNavLink } from 'react-router'
import { Button } from '@/components/ui/Button'
import { QUOTE_PATH, type NavLink } from '@/data/navigation'
import { useSamePageScrollTop } from '@/hooks/useSamePageScrollTop'

interface MobileMenuProps {
  id: string
  open: boolean
  links: readonly NavLink[]
  onClose: () => void
}

/**
 * Menú a pantalla completa para móvil y tableta. Se cierra con Escape, con un enlace o con la X.
 * Marca la página actual (como la píldora de escritorio): en blanco y con un punto de color roble;
 * las demás, atenuadas. En las páginas de categoría queda marcada "Trabajos".
 */
export function MobileMenu({ id, open, links, onClose }: MobileMenuProps) {
  const firstLinkRef = useRef<HTMLAnchorElement>(null)
  const scrollTopIfSame = useSamePageScrollTop()

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstLinkRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      inert={!open}
      className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-night px-6 pt-28 pb-10 text-name phone-land:pt-20! phone-land:pb-5! transition-[opacity,transform] duration-300 ease-(--ease-out-strong) lg:hidden ${
        open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
      }`}
    >
      <nav aria-label="Menú móvil" className="flex flex-col gap-2 phone-land:grid! phone-land:grid-cols-2! phone-land:gap-x-10!">
        {links.map((link, index) => (
          <RouterNavLink
            key={link.to}
            ref={index === 0 ? firstLinkRef : undefined}
            to={link.to}
            end={link.to === '/'}
            onClick={() => {
              onClose()
              scrollTopIfSame(link.to)
            }}
            className="flex min-h-14 items-center justify-between border-b border-white/10 text-3xl font-medium tracking-[-0.02em] text-name/50 transition-colors duration-150 [font-stretch:110%] aria-[current=page]:text-name phone-land:min-h-12! phone-land:text-2xl!"
          >
            {({ isActive }) => (
              <>
                {link.label}
                {isActive && <span aria-hidden="true" className="size-2.5 rounded-full bg-oak" />}
              </>
            )}
          </RouterNavLink>
        ))}
      </nav>
      <div className="mt-auto phone-land:pt-5">
        {/* Cierra el menú también si ya estás en Contacto (la página no cambia y no se cerraría solo). */}
        <Button to={QUOTE_PATH} onClick={onClose} tone="light" withArrow className="w-full justify-between phone-land:w-auto!">
          Pedir presupuesto
        </Button>
      </div>
    </div>
  )
}
