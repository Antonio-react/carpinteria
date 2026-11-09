import type { ReactNode } from 'react'

interface PinnedNoteProps {
  children: ReactNode
  /** Firma al pie, a mano (p. ej. "El taller"). */
  signature?: string
  /** Giro en grados: cada nota se pega un poco torcida, distinta de las demás. */
  tilt?: number
  /** Esquina de abajo a la derecha doblada hacia arriba, como un papel que se ha despegado un poco. */
  curl?: boolean
  className?: string
}

/** Tamaño de la esquina doblada. */
const FOLD = '30px'

/**
 * Nota de papel pegada con un trozo de cinta, algo torcida, como las que hay en la pared de un taller.
 * Rompe a propósito la cuadrícula de la página. El texto va en la serif cursiva (a mano).
 * La sombra va con drop-shadow (sigue la forma del papel, también con la esquina doblada).
 * Con "reducir movimiento" no cambia nada: el giro es estático.
 */
export function PinnedNote({ children, signature, tilt = -2, curl = false, className = '' }: PinnedNoteProps) {
  return (
    <aside
      style={{ rotate: `${tilt}deg` }}
      className={`relative drop-shadow-[0_14px_18px_rgb(28_25_22/0.28)] ${className}`}
    >
      <div
        style={curl ? { clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${FOLD}), calc(100% - ${FOLD}) 100%, 0 100%)` } : undefined}
        className="bg-[#f7f0e1] bg-[linear-gradient(170deg,rgb(255_255_255/0.35),transparent_40%,rgb(120_90_50/0.06))] px-7 pt-9 pb-7"
      >
        <div className="font-serif text-2xl leading-snug text-ink/85 italic">{children}</div>
        {signature && <p className="mt-4 text-right font-serif text-base text-pencil italic">— {signature}</p>}
      </div>
      {curl && (
        // La esquina doblada: el revés del papel, algo más oscuro, con su sombrita.
        <span
          aria-hidden="true"
          style={{ width: FOLD, height: FOLD, clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
          className="absolute right-0 bottom-0 bg-linear-to-br from-[#e2d6bd] to-[#cbbd9f] shadow-[-2px_-2px_4px_rgb(28_25_22/0.15)]"
        />
      )}
      {/* Cinta de carrocero */}
      <span
        aria-hidden="true"
        className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-3 bg-[#e6d6b2]/85 shadow-[0_1px_2px_rgb(28_25_22/0.12)]"
      />
    </aside>
  )
}
