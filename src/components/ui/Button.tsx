import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'

/** light = botón claro (sobre fondos oscuros) · dark = botón tinta (sobre fondos claros). */
type ButtonTone = 'light' | 'dark'

interface ButtonBaseProps {
  tone?: ButtonTone
  /** Muestra la flecha en círculo a la derecha (gira al pasar el ratón). */
  withArrow?: boolean
  className?: string
  children: ReactNode
}

type LinkButtonProps = ButtonBaseProps & { to: string; onClick?: () => void }
type NativeButtonProps = ButtonBaseProps & { to?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>
type ButtonProps = LinkButtonProps | NativeButtonProps

const TONES: Record<ButtonTone, { button: string; arrow: string }> = {
  light: { button: 'bg-paper text-ink', arrow: 'bg-ink text-paper' },
  dark: { button: 'bg-ink text-paper', arrow: 'bg-paper text-ink' },
}

/** Botón principal de la web (enlace interno o <button>), con respuesta al pulsar. */
export function Button(props: ButtonProps) {
  const { tone = 'dark', withArrow = false, className = '', children, ...rest } = props
  const styles = TONES[tone]
  const classes = `group inline-flex min-h-12 items-center justify-center gap-3 rounded-full text-sm font-medium whitespace-nowrap transition-transform duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 ${withArrow ? 'py-1.5 pr-1.5 pl-6' : 'px-6'} ${styles.button} ${className}`

  const content = (
    <>
      {children}
      {withArrow && (
        <span
          aria-hidden="true"
          className={`grid size-9 place-items-center rounded-full transition-transform duration-200 ease-(--ease-out-strong) group-hover:translate-x-0.5 ${styles.arrow}`}
        >
          →
        </span>
      )}
    </>
  )

  if (rest.to !== undefined) {
    return (
      <Link to={rest.to} onClick={rest.onClick} className={classes}>
        {content}
      </Link>
    )
  }

  // Aquí `rest` solo tiene atributos nativos de <button> (`to` es undefined y React lo omite).
  const { type = 'button', ...native } = rest
  return (
    <button type={type} className={classes} {...native}>
      {content}
    </button>
  )
}
