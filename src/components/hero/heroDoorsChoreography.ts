import insideColumn from '@/assets/hero/inside-column.webp'
import insideTop from '@/assets/hero/inside-top.webp'
import { CABINET, type Hinge, type Panel } from '@/components/hero/doorGeometry'

/**
 * Coreografía del mueble del hero: qué puertas se abren, cuánto, cuándo, con qué interior y cantos, y
 * cuándo sale la estantería de roble. Solo datos: el dibujo lo hace HeroDoors y el scroll useHeroParallax.
 * Los tiempos (start, span) van en "progreso": 1 = OPEN_SCREENS pantallas de scroll (useHeroParallax).
 */

export interface Door {
  /** Hueco de la puerta (el interior lo ocupa entero). */
  panel: Panel
  /**
   * Hoja que se mueve, si es menor que el hueco: metros que se recorta por cada lado. Junto a las juntas
   * de la foto (ranura entre puertas, junta con el marco de la tele), cortar justo por el centro hacía que
   * la hoja se llevara media junta pegada al borde: un hilo gris que viajaba con la puerta al abrirse.
   */
  trim?: Partial<Panel>
  hinge: Hinge
  /** Ángulo final (grados), momento del progreso en el que empieza y cuánto dura. */
  angle: number
  start: number
  span: number
  /** bleed: metros que el interior se alarga por el lado del canto libre, para solaparse con el de al lado
   *  (dos interiores borde con borde dejan ver, por el suavizado, una rayita de la foto de debajo).
   *  mirror: interior reflejado en horizontal. */
  inside: { src: string; width: number; height: number; mirror?: boolean; bleed?: number }
  /** Cantos del hueco que se dibujan al abrir (mismo grosor en todos) y su color (el blanco del frente). */
  rails: { top: boolean; bottom: boolean; color: string }
}

/**
 * Coreografía (la tele se queda quieta):
 *   - Columnas de la izquierda: cada una es UNA puerta alta (como el mueble real). Se abren del todo,
 *     en abanico. La foto está hecha desde la derecha: la hoja de la segunda tapa el interior de la
 *     primera; se ve el de la segunda.
 *     Son las que más se ven: se abren despacio, durante casi todo el recorrido.
 *   - Encima de la tele: la izquierda bien abierta (55°; pasa un instante de canto hacia los 30°) y la
 *     derecha solo un poco (17°).
 *   - Debajo de la tele: las abatibles se quedan cerradas (abiertas, desde este ángulo se veían como
 *     una franja blanca sobre el zócalo).
 * Cada movimiento empieza un poco después del anterior.
 */
/**
 * Cantos de los huecos abiertos: el canto delantero de los tableros de arriba (y abajo, encima de la tele),
 * 2,5 cm, igual en todos. Antes salían de cada foto y cada hueco tenía uno distinto (o ninguno).
 * Colores: el canto queda dentro del hueco, en sombra; el de encima de la tele (172,160,145, ~1,55 veces
 * su interior) se ve natural, así que el de las columnas guarda la misma proporción con el suyo
 * (interior 110,110,107 en pantalla). Casi blanco (205) se veía artificial.
 */
export const RAIL = 0.025
const COLUMN_WHITE = 'rgb(170 169 165)'
const OVER_TV_WHITE = 'rgb(172 160 145)'

const OVER_TV_RIGHT_START = 0.42
const OVER_TV_RIGHT_SPAN = 0.5
/** Progreso en el que la puerta derecha de encima de la tele termina de abrirse: ahí sube la cortina en móvil. */
export const OVER_TV_RIGHT_OPEN = OVER_TV_RIGHT_START + OVER_TV_RIGHT_SPAN

export const DOORS: readonly Door[] = [
  // La 1.ª columna usa el interior de la 2.ª reflejado: las dos comparten la caja vertical que tapa una
  // tubería, así que en la 1.ª queda a la derecha (junto a la 2.ª) y en la 2.ª a la izquierda.
  { panel: CABINET.columnA, hinge: 'left', angle: 105, start: 0.03, span: 0.85, inside: { src: insideColumn, width: 372, height: 872, mirror: true }, rails: { top: true, bottom: false, color: COLUMN_WHITE } },
  { panel: CABINET.columnB, hinge: 'left', angle: 95, start: 0.2, span: 0.85, inside: { src: insideColumn, width: 372, height: 872 }, rails: { top: true, bottom: false, color: COLUMN_WHITE } },
  { panel: CABINET.overTvLeft, hinge: 'left', angle: 55, start: 0.35, span: 0.55, trim: { right: 0.007, bottom: 0.006 }, inside: { src: insideTop, width: 344, height: 314, bleed: 0.006 }, rails: { top: true, bottom: true, color: OVER_TV_WHITE } },
  // Reflejado: la pared lateral en sombra del armario queda junto a la bisagra (tapada por la puerta) y
  // no en la rendija, donde se leía como una franja gris.
  { panel: CABINET.overTvRight, hinge: 'right', angle: 17, start: OVER_TV_RIGHT_START, span: OVER_TV_RIGHT_SPAN, trim: { left: 0.007, bottom: 0.006 }, inside: { src: insideTop, width: 344, height: 314, bleed: 0.006, mirror: true }, rails: { top: true, bottom: true, color: OVER_TV_WHITE } },
]

/**
 * Estantería de roble: sale por el extremo del mueble, como un cajón (metros de recorrido).
 * Solo se mueve la madera marrón; el cerco blanco es del mueble y no se toca.
 */
export const OAK_TRAVEL = 0.12
export const OAK_START = 0.25
export const OAK_SPAN = 0.6

/**
 * Progreso en el que el mueble ya está abierto del todo (la última puerta o el roble han terminado).
 * En escritorio, el contenido de Inicio no sube hasta entonces (useHeroParallax → CURTAIN_SCREENS).
 */
export const OPEN_COMPLETE = Math.max(...DOORS.map((door) => door.start + door.span), OAK_START + OAK_SPAN)
