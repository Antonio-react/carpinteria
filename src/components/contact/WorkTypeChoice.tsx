import { useRef } from 'react'

export interface WorkTypeOption {
  value: string
  hint: string
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
      <div role="radiogroup" aria-labelledby={labelledBy} aria-describedby={error ? errorId : undefined} className="grid grid-cols-2 gap-3 lg:grid-cols-3">
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
            className="group relative flex min-h-24 cursor-pointer lg:min-h-36 lg:compact:min-h-24 flex-col justify-between rounded-[16px] border border-ink/15 bg-paper p-4 transition-[border-color,background-color,transform] duration-150 ease-out hover:border-ink/40 active:scale-[0.98] has-checked:border-ink has-checked:bg-ink has-checked:text-paper has-focus-visible:ring-2 has-focus-visible:ring-oak has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-bone"
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
            <span className="text-lg leading-tight font-medium tracking-[-0.01em] [font-stretch:105%]">{option.value}</span>
            <span className="mt-2 text-xs leading-snug text-muted group-has-checked:text-paper/70">{option.hint}</span>
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
