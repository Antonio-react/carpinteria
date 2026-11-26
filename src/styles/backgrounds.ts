/**
 * Fondos de página que se usan en más de un sitio. Archivo aparte y sin imports para que RootLayout
 * (que va en el código inicial) pueda usarlos sin arrastrar el código de las páginas.
 */

/** Papel de plano: madera clara con cuadrícula de 24 px (Cómo trabajamos). */
export const BLUEPRINT_BG =
  'bg-sawdust bg-[linear-gradient(to_right,rgb(28_25_22/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(28_25_22/0.07)_1px,transparent_1px)] bg-size-[24px_24px]'

/**
 * Fondo mientras se descarga el código de una página al entrar directamente en ella (escribiendo la
 * dirección, desde Google o con F5): así no se ve un instante la página lisa antes de su fondo.
 */
export const PAGE_LOADING_BG: Readonly<Record<string, string>> = {
  '/como-trabajamos': BLUEPRINT_BG,
}
