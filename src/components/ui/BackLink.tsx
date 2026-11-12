import { Link } from 'react-router'

interface BackLinkProps {
  to: string
  label: string
  /** Estado que se pasa a la página de destino (p. ej. qué tarjeta centrar en el carrusel). */
  state?: unknown
  /** pill = píldora con borde (botón principal) · text = enlace de texto discreto. */
  variant?: 'pill' | 'text'
}

const VARIANTS = {
  pill: 'rounded-full border border-ink/15 bg-paper/60 pr-5 pl-4 font-medium text-ink transition-colors hover:border-ink/40',
  text: 'text-muted transition-colors hover:text-ink',
} as const

/** Enlace de volver con flecha a la izquierda (se desplaza un poco al pasar el ratón). */
export function BackLink({ to, label, state, variant = 'pill' }: BackLinkProps) {
  return (
    <Link to={to} state={state} className={`group inline-flex min-h-11 items-center gap-2 text-sm ${VARIANTS[variant]}`}>
      <span aria-hidden="true" className="transition-transform duration-200 ease-(--ease-out-strong) group-hover:-translate-x-0.5">
        ←
      </span>
      {label}
    </Link>
  )
}
