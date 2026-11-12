/** Atributos de accesibilidad que enlazan un campo con su ayuda y su error. */
export function describedBy(id: string, hint?: string, error?: string) {
  const ids = [hint ? `${id}-ayuda` : '', error ? `${id}-error` : ''].filter(Boolean)
  return { 'aria-describedby': ids.length > 0 ? ids.join(' ') : undefined, 'aria-invalid': error ? true : undefined }
}

/**
 * Estilo común de los controles de texto del formulario: "sobre la línea", sin caja (se escribe encima
 * de una raya, como en una hoja de pedido). Al enfocar, la raya se oscurece y engorda (se ve con teclado).
 */
export const CONTROL_CLASSES =
  'block w-full rounded-none border-0 border-b border-ink/40 bg-transparent px-0.5 py-2 text-base text-ink placeholder:text-ink/40 transition-[border-color,box-shadow] duration-150 hover:border-ink/60 focus:border-ink focus:shadow-[0_1px_0_var(--color-ink)] focus:outline-none aria-invalid:border-pencil'

/**
 * Área de texto rayada como una libreta: un renglón cada 2rem, con el texto escrito sobre ellos. bg-local:
 * si se escribe más de lo que cabe, las rayas suben con el texto. En escritorio se puede agrandar o encoger
 * tirando de la esquina, pero nunca por debajo de 2 renglones (min-h: 2 × 2rem + relleno 1rem + raya 1px).
 */
export const LINED_CLASSES = 'min-h-[calc(5rem+1px)] resize-y bg-local py-0 leading-8 bg-[repeating-linear-gradient(transparent_0_calc(2rem-1px),rgb(28_25_22/0.16)_calc(2rem-1px)_2rem)]'
