/**
 * Geometría 3D del mueble del hero, reconstruida a partir de la propia foto, para abrir sus puertas
 * con la perspectiva REAL de la cámara (no una inclinación inventada).
 *
 * Cómo se obtuvo (scratch de cálculo, no forma parte de la web):
 *   - Punto de fuga de las horizontales del frente (bordes de la tele): (-870, 1225).
 *   - Punto de fuga de la profundidad (baldas de la estantería de roble): (2840, 1285).
 *   - Con el centro de la foto como punto principal, la distancia focal sale de que esas dos
 *     direcciones son perpendiculares: f ≈ 1852 px (la típica de la cámara principal de un móvil).
 *   - Escala: la tele mide 1,45 m de ancho. Comprobaciones: la tele sale 1,45 × 0,82 (16:9 exacto),
 *     las dos puertas de la izquierda miden lo mismo (0,73 m), la de arriba es media tele (0,73 m) y la
 *     estantería tiene 40 cm de fondo.
 *
 * Mundo (metros): origen en la esquina superior izquierda de la tele; X a lo largo del mueble (hacia
 * la derecha), Y hacia abajo, Z hacia la sala. El frente del mueble es el plano Z = 0.
 * Lienzo: la foto recortada del hero, 1656 × 1925 px (mismo lienzo que piece-*.webp).
 */

export type Vec3 = readonly [number, number, number]
export type Point = readonly [number, number]
export type Quad = readonly [Point, Point, Point, Point]
type Mat3 = readonly [number, number, number, number, number, number, number, number, number]

export const CANVAS_WIDTH = 1656
export const CANVAS_HEIGHT = 1925

// Cámara: ejes del mundo en coordenadas de cámara, traslación y parámetros internos.
const AXIS_X: Vec3 = [0.69003, -0.01172, -0.72369]
const AXIS_Y: Vec3 = [-0.01616, 0.99937, -0.0316]
const AXIS_Z: Vec3 = [-0.7236, -0.0335, -0.68941]
const TRANSLATION: Vec3 = [-0.63259, -0.63081, 3.29112]
const FOCAL = 1852.13
const CENTER: Point = [896, 1175]

/** Proyecta un punto del mundo a píxeles del lienzo (1656 × 1925). */
export function project([x, y, z]: Vec3): Point {
  const cam = [0, 1, 2].map((i) => AXIS_X[i] * x + AXIS_Y[i] * y + AXIS_Z[i] * z + TRANSLATION[i])
  return [CENTER[0] + (FOCAL * cam[0]) / cam[2], CENTER[1] + (FOCAL * cam[1]) / cam[2]]
}

/** Posición de la cámara en el mundo (para saber qué cara de una puerta se ve). */
export const CAMERA: Vec3 = (() => {
  const axes = [AXIS_X, AXIS_Y, AXIS_Z]
  return axes.map((axis) => -(axis[0] * TRANSLATION[0] + axis[1] * TRANSLATION[1] + axis[2] * TRANSLATION[2])) as unknown as Vec3
})()

/** Homografía que lleva los 4 puntos `from` a los 4 puntos `to` (resolución directa 8 × 8). */
export function homography(from: Quad, to: Quad): Mat3 {
  const rows: number[][] = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = from[i]
    const [u, v] = to[i]
    rows.push([x, y, 1, 0, 0, 0, -u * x, -u * y, u])
    rows.push([0, 0, 0, x, y, 1, -v * x, -v * y, v])
  }
  for (let col = 0; col < 8; col++) {
    let pivot = col
    for (let r = col + 1; r < 8; r++) if (Math.abs(rows[r][col]) > Math.abs(rows[pivot][col])) pivot = r
    ;[rows[col], rows[pivot]] = [rows[pivot], rows[col]]
    for (let r = 0; r < 8; r++) {
      if (r === col) continue
      const factor = rows[r][col] / rows[col][col]
      for (let k = col; k < 9; k++) rows[r][k] -= factor * rows[col][k]
    }
  }
  const h = rows.map((row, i) => row[8] / row[i])
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1]
}

/** Homografía 2D como transform CSS (matrix3d, por columnas) con transform-origin 0 0. */
export function toMatrix3d([a, b, c, d, e, f, g, h, i]: Mat3): string {
  return `matrix3d(${a},${d},0,${g},${b},${e},0,${h},0,0,1,0,${c},${f},0,${i})`
}

/** Rectángulo de 0,0 a w,h como cuadrilátero (sentido horario desde arriba a la izquierda). */
export const rectQuad = (w: number, h: number): Quad => [
  [0, 0],
  [w, 0],
  [w, h],
  [0, h],
]

/**
 * Medidas reales del mueble en el mundo (metros), tomadas sobre las juntas de la foto.
 * Los bordes junto a la tele van 1 mm hacia dentro: más margen dejaba quieta una tira de la puerta
 * de la foto, que se veía como una línea gris al abrir.
 */
export const CABINET = {
  /** Columnas de la izquierda: una puerta alta cada una (como el mueble real). */
  columnA: { left: -1.457, right: -0.7237, top: -0.6282, bottom: 1.024 },
  columnB: { left: -0.7237, right: -0.001, top: -0.6282, bottom: 1.024 },
  /** Armario de encima de la tele: dos puertas, sobre el ancho exacto de la tele (1,45 m). */
  overTvLeft: { left: 0.001, right: 0.7213, top: -0.6238, bottom: -0.001 },
  overTvRight: { left: 0.7213, right: 1.4507, top: -0.6238, bottom: -0.001 },
  /**
   * Abatibles de debajo de la tele (junta en x ≈ 0,73), por si se quieren abrir: izquierda
   * { left: 0.004, right: 0.729, top: 0.836, bottom: 1.015 }, derecha { left: 0.737, right: 1.446,
   * top: 0.836, bottom: 1.008 }, con hinge 'bottom'. Se probaron y se quedan cerradas.
   */
  /**
   * Estantería de roble (en el lateral derecho del mueble, plano X = 1,805): TODA la madera marrón de
   * dentro del cerco blanco (que es del mueble y se queda quieto), INCLUIDOS sus propios cantos de roble
   * (franja naranja de ~9 px delante, detrás y abajo, entre la madera oscura y el cerco blanco: si no,
   * al salir se quedaban atrás). Medido en la foto por color hasta el cerco blanco.
   */
  oak: {
    x: 1.805,
    face: [
      [1.805, -0.5938, -0.0076],
      [1.805, -0.5953, -0.3918],
      [1.805, 1.0003, -0.3858],
      [1.805, 0.9969, 0.0181],
    ] as const satisfies readonly Vec3[],
    /** Los mismos puntos de `face` en la foto (lienzo). */
    image: [
      [1475, 27],
      [1634, 170],
      [1627, 1476],
      [1453, 1503],
    ] as const satisfies Quad,
  },
  doorThickness: 0.019,
}

export interface Panel {
  left: number
  right: number
  top: number
  bottom: number
}

/** Lado de la bisagra: puertas con bisagra lateral, o abatibles con la bisagra abajo. */
export type Hinge = 'left' | 'right' | 'bottom'

type Quad3 = readonly [Vec3, Vec3, Vec3, Vec3]

export interface DoorPose {
  /** Caras y canto, siempre en el orden de la foto: arriba-izq., arriba-der., abajo-der., abajo-izq. */
  front: Quad3
  back: Quad3
  /** Canto libre (el opuesto a la bisagra). */
  edge: Quad3
  frontVisible: boolean
  edgeVisible: boolean
}

const facing = (normal: Vec3, point: Vec3) =>
  normal[0] * (CAMERA[0] - point[0]) + normal[1] * (CAMERA[1] - point[1]) + normal[2] * (CAMERA[2] - point[2]) > 0

/**
 * Puerta girada `degrees` sobre su bisagra, abriéndose hacia la sala (Z+).
 * Ejes locales: `a` va de la bisagra al canto libre (gira) y `b` recorre la bisagra (fijo).
 */
export function doorPose(panel: Panel, hinge: Hinge, degrees: number): DoorPose {
  const { left, right, top, bottom } = panel
  const angle = (degrees * Math.PI) / 180
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  // Origen en la bisagra, dirección del canto libre en reposo, eje de la bisagra y medidas.
  const setup = {
    left: { origin: [left, top, 0], rest: [1, 0, 0], axis: [0, 1, 0], length: right - left, span: bottom - top },
    right: { origin: [right, top, 0], rest: [-1, 0, 0], axis: [0, 1, 0], length: right - left, span: bottom - top },
    bottom: { origin: [left, bottom, 0], rest: [0, -1, 0], axis: [1, 0, 0], length: bottom - top, span: right - left },
  }[hinge]
  const [rx, ry] = setup.rest
  const along: Vec3 = [rx * c, ry * c, s] // de la bisagra al canto libre, ya girado
  const normal: Vec3 = [-rx * s, -ry * s, c] // fuera de la cara delantera
  const t = CABINET.doorThickness
  const at = (a: number, b: number, depth = 0): Vec3 =>
    [0, 1, 2].map((i) => setup.origin[i] + along[i] * a + setup.axis[i] * b - normal[i] * depth) as unknown as Vec3

  // Esquinas (a, b) en el orden de la foto para cada tipo de bisagra.
  const L = setup.length
  const W = setup.span
  type Corner = readonly [number, number]
  const corners: Record<Hinge, readonly Corner[]> = {
    left: [[0, 0], [L, 0], [L, W], [0, W]],
    right: [[L, 0], [0, 0], [0, W], [L, W]],
    bottom: [[L, 0], [L, W], [0, W], [0, 0]],
  }
  const quad = (depth: number) => corners[hinge].map(([a, b]) => at(a, b, depth)) as unknown as Quad3
  return {
    front: quad(0),
    back: quad(t),
    edge: [at(L, 0), at(L, 0, t), at(L, W, t), at(L, W)],
    frontVisible: facing(normal, at(L / 2, W / 2)),
    edgeVisible: facing(along, at(L, W / 2, t / 2)),
  }
}

export const projectQuad = (points: Quad3): Quad =>
  [project(points[0]), project(points[1]), project(points[2]), project(points[3])] as const

const pct = ([x, y]: Point) => `${((x / CANVAS_WIDTH) * 100).toFixed(3)}% ${((y / CANVAS_HEIGHT) * 100).toFixed(3)}%`

/** Cuadrilátero del lienzo como clip-path en %. */
export const quadClipPath = (quad: Quad) => `polygon(${quad.map(pct).join(', ')})`
