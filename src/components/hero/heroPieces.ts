/**
 * Piezas del despiece del mueble, como recortes (clip-path) del MISMO lienzo de la foto
 * (1656 × 1925 px). La junta está medida sobre la foto original (1792 × 2390):
 *   - tele: esquinas reales del marco (540,840) (1200,660) (1188,1338) (535,1302).
 * Dos piezas:
 *   1. mueble: todo el lienzo (paneles blancos, estantería y base negra con la chimenea) con un
 *      "agujero" donde va la tele (evenodd). Se mueve entero: es una sola pieza hecha a medida;
 *   2. tele: el único color de la composición, la que sale hacia delante.
 */
export const TV = '32.61% 42.6%, 72.46% 33.25%, 71.74% 68.47%, 32.31% 66.6%'

export const PIECE_CLIPS = {
  cabinet: `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${TV}, 32.61% 42.6%)`,
  tv: `polygon(${TV})`,
} as const

export type HeroPiece = keyof typeof PIECE_CLIPS
