import { Link } from 'react-router'

interface BackLinkProps {
  to: string
  label: string
  /** Estado que se pasa a la página de destino (p. ej. qué tarjeta centrar en el carrusel). */
  state?: unknown
}

/** Enlace de volver: píldora con borde y flecha a la izquierda (se desplaza un poco al pasar el ratón). */
export function BackLink({ to, label, state }: BackLinkProps) {
  return (
    <Link
      to={to}
      state={state}
      className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 bg-paper/60 pr-5 pl-4 text-sm font-medium text-ink transition-colors hover:border-ink/40"
    >
      <span aria-hidden="true" className="transition-transform duration-200 ease-out-strong group-hover:-translate-x-0.5">
        ←
      </span>
      {label}
    </Link>
  )
}
