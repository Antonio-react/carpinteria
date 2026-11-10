import { useScrolled } from '@/hooks/useScrolled'

/**
 * Pista de que hay más página bajo el hero: el borde de la hoja clara de Inicio (mismo color,
 * esquinas y sombra que la de verdad) asoma unos píxeles por abajo cada pocos segundos y se vuelve
 * a esconder. Al empezar a hacer scroll se desvanece y se para (ya no hace falta la pista); si se
 * vuelve arriba del todo, reaparece. Con movimiento reducido no se mueve: se queda asomando quieta.
 */
export function HeroPeek() {
  const scrolled = useScrolled(4)
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-35 transition-opacity duration-300 ease-out ${scrolled ? 'opacity-0' : ''}`}
    >
      <div
        className={`h-12 rounded-t-[28px] bg-bone shadow-[0_-10px_30px_rgb(0_0_0/0.35)] motion-safe:animate-peek motion-reduce:translate-y-[calc(100%-14px)] ${scrolled ? '[animation-play-state:paused]' : ''}`}
      />
    </div>
  )
}
