interface CategoryPillsProps {
  names: readonly string[]
  activeIndex: number
  onSelect: (index: number) => void
  /** light = sobre fondo claro · dark = sobre la exposición oscura de Trabajos. */
  tone?: 'light' | 'dark'
}

const TONES = {
  light: { active: 'border-ink bg-ink text-paper', idle: 'border-ink/15 text-ink/75 hover:border-ink/40 hover:text-ink' },
  dark: { active: 'border-name bg-name text-night', idle: 'border-name/20 text-name/70 hover:border-name/50 hover:text-name' },
} as const

/** Botones en píldora para saltar a una categoría del carrusel. */
export function CategoryPills({ names, activeIndex, onSelect, tone = 'light' }: CategoryPillsProps) {
  const styles = TONES[tone]
  return (
    <div role="group" aria-label="Categorías" className="flex flex-wrap gap-2">
      {names.map((name, index) => {
        const active = index === activeIndex
        return (
          <button
            key={name}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(index)}
            className={`min-h-11 rounded-full border px-5 text-sm transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.97] ${active ? styles.active : styles.idle}`}
          >
            {name}
          </button>
        )
      })}
    </div>
  )
}
