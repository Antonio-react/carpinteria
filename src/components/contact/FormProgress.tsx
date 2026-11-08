interface FormProgressProps {
  /** Paso actual (desde 0). */
  current: number
  /** Títulos de los pasos. */
  steps: readonly string[]
}

/** "Paso 2 de 3" con una barra por paso: las hechas en tinta, la actual en roble. */
export function FormProgress({ current, steps }: FormProgressProps) {
  return (
    <div>
      <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase" aria-live="polite">
        Paso {current + 1} de {steps.length}
        <span className="sr-only">: {steps[current]}</span>
      </p>
      <ol className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((title, index) => (
          <li key={title} aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-ink/10">
            <span
              className={`block h-full origin-left rounded-full transition-[transform,background-color] duration-500 ease-(--ease-out-strong) ${
                index < current ? 'scale-x-100 bg-ink' : index === current ? 'scale-x-100 bg-oak' : 'scale-x-0 bg-ink'
              }`}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
