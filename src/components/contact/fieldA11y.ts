/** Atributos de accesibilidad que enlazan un campo con su ayuda y su error. */
export function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-ayuda` : '', error ? `${id}-error` : ''].filter(Boolean)
  return { 'aria-describedby': ids.length > 0 ? ids.join(' ') : undefined, 'aria-invalid': error ? true : undefined }
}

/** Estilo común de los controles de texto del formulario. */
export const CONTROL_CLASSES =
  'block w-full rounded-[6px] border border-ink/20 bg-paper px-4 py-3 text-base text-ink placeholder:text-ink/40 transition-colors duration-150 hover:border-ink/40 focus:border-ink focus:outline-none aria-invalid:border-pencil'
