import { useRef } from 'react'
import { PencilSketch } from '@/components/ui/PencilSketch'
import type { Sketch } from '@/data/sketches'

export interface WorkTypeOption {
  value: string
  hint: string
  /** Boceto a lápiz pequeño del tipo de trabajo. */
  sketch: Sketch
}

interface WorkTypeChoiceProps {
  name: string
  options: readonly WorkTypeOption[]
  /** id del título del paso (la pregunta), que da nombre al grupo. */
  labelledBy: string
  error?: string
  /** Se llama al elegir con ratón o dedo (para pasar solo al siguiente paso). */
  onPick: () => void
}

/**
 * Tarjetas grandes para elegir el tipo de trabajo (radio buttons por dentro: accesibles con teclado).
 * Con ratón o dedo, elegir avanza solo; con teclado no (las flechas cambian de opción sin saltar de paso).
 */
export function WorkTypeChoice({ name, options, labelledBy, error, onPick }: WorkTypeChoiceProps) {
  const byPointer = useRef(false)
  const errorId = `campo-${name}-error`

  return (
    <div>
      <div role="radiogroup" aria-labelledby={labelledBy} aria-describedby={error ? errorId : undefined} className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option, index) => (
          <label
            key={option.value}
            onPointerUp={(event) => {
              byPointer.current = true
              window.setTimeout(() => {
                byPointer.current = false
              }, 300)
              // Volver a pulsar la opción ya marcada (p. ej. tras "Atrás") también avanza.
              const input = event.currentTarget.querySelector('input')
              if (input?.checked) window.setTimeout(onPick, 120)
            }}
            className="group relative flex cursor-pointer flex-col justify-center border-b border-ink/15 py-3.5 pr-16 pl-3 transition-[background-color,box-shadow] duration-150 ease-out hover:bg-ink/[0.03] has-checked:bg-oak/10 has-checked:shadow-[inset_3px_0_0_var(--color-oak)] has-focus-visible:ring-2 has-focus-visible:ring-oak has-focus-visible:ring-inset"
          >
            <input
              id={index === 0 ? `campo-${name}` : undefined}
              type="radio"
              name={name}
              value={option.value}
              className="sr-only"
              onChange={() => {
                if (!byPointer.current) return
                // Un instante para que se vea la tarjeta marcada antes de pasar.
                window.setTimeout(onPick, 220)
              }}
            />
            <PencilSketch
              sketch={option.sketch}
              seed={index + 7}
              className="pointer-events-none absolute top-1/2 right-1.5 h-10 w-auto -translate-y-1/2 opacity-60 group-has-checked:opacity-90"
            />
            <span className="relative text-lg leading-tight font-medium tracking-[-0.01em] [font-stretch:105%]">{option.value}</span>
            <span className="relative mt-1 text-xs leading-snug text-muted">{option.hint}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="mt-3 text-sm text-pencil">
          {error}
        </p>
      )}
    </div>
  )
}
