import { NavLink as RouterNavLink } from 'react-router'
import type { NavLink } from '@/data/navigation'
import { useSamePageScrollTop } from '@/hooks/useSamePageScrollTop'

interface NavPillProps {
  links: readonly NavLink[]
  /** overlay = sobre el hero oscuro · solid = sobre fondo claro. */
  variant: 'overlay' | 'solid'
  /** Fondo oscuro pero con cosas claras pasando por debajo (fotos del carrusel): más fondo para que se lea. */
  backed?: boolean
}

const VARIANTS = {
  overlay: {
    pill: 'border-white/15 bg-white/5',
    link: 'text-white/75 hover:bg-white/10 hover:text-white aria-[current=page]:bg-white/15 aria-[current=page]:text-white',
  },
  solid: {
    pill: 'border-ink/10 bg-paper/80',
    link: 'text-ink/70 hover:bg-ink/5 hover:text-ink aria-[current=page]:bg-ink aria-[current=page]:text-paper',
  },
} as const

/** Navegación principal en forma de píldora (escritorio). Marca la página actual. */
export function NavPill({ links, variant, backed = false }: NavPillProps) {
  const styles = VARIANTS[variant]
  const pill = backed && variant === 'overlay' ? 'border-white/15 bg-night/75' : styles.pill
  const scrollTopIfSame = useSamePageScrollTop()
  return (
    <nav aria-label="Principal" className={`flex items-center gap-1 rounded-full border p-1 backdrop-blur-md transition-colors duration-300 ${pill}`}>
      {links.map((link) => (
        <RouterNavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          onClick={() => scrollTopIfSame(link.to)}
          className={`inline-flex min-h-11 items-center rounded-full px-4 text-sm transition-colors duration-150 ${styles.link}`}
        >
          {link.label}
        </RouterNavLink>
      ))}
    </nav>
  )
}
