import { PencilSketch } from '@/components/ui/PencilSketch'
import type { Sketch } from '@/data/sketches'

interface PhotoPlaceholderProps {
  /** Nombre de la categoría (al pie y en el texto alternativo). */
  label: string
  /** Boceto a lápiz del tipo de trabajo. */
  sketch: Sketch
  /** Varía el pulso del trazo entre huecos con el mismo boceto. */
  seed?: number
  /** Fondo oscuro (p. ej. sobre la exposición de Trabajos). */
  tone?: 'light' | 'dark'
  className?: string
}

/**
 * Hueco para fotos que aún no existen: un boceto a lápiz del tipo de trabajo sobre papel de plano,
 * con el nombre al pie. NUNCA fotos de stock (regla de CLAUDE.md): un dibujo no se confunde con un
 * trabajo real de la empresa. Se sustituye por la foto real cuando llegue.
 */
export function PhotoPlaceholder({ label, sketch, seed = 1, tone = 'light', className = '' }: PhotoPlaceholderProps) {
  const dark = tone === 'dark'
  return (
    <div
      role="img"
      aria-label={`Boceto de ${label.toLowerCase()} (foto pendiente)`}
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-size-[16px_16px] ${
        dark
          ? 'bg-night-soft bg-[linear-gradient(to_right,rgb(233_226_214/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(233_226_214/0.05)_1px,transparent_1px)] [&_path:first-child]:stroke-name/80'
          : 'bg-paper bg-[linear-gradient(to_right,rgb(28_25_22/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(28_25_22/0.05)_1px,transparent_1px)]'
      } ${className}`}
    >
      <PencilSketch sketch={sketch} seed={seed} className="h-[72%] max-h-full w-auto" />
      <span className={`mt-1 font-serif text-sm italic ${dark ? 'text-name/60' : 'text-ink/50'}`}>{label}</span>
    </div>
  )
}
