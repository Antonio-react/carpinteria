/**
 * Bocetos a lápiz de cada tipo de trabajo, para los huecos de la galería mientras no hay fotos reales
 * (y en pequeño, en el formulario y en la cajonera de Inicio). Son dibujos, no fotos: nunca hacen
 * pasar por trabajo de la empresa algo que no lo es.
 *
 * Lienzo de 200 × 240. Cada segmento es [x1, y1, x2, y2]. Las cotas (en lápiz rojo) no llevan cifras:
 * no inventamos medidas.
 */
export type Segment = readonly [number, number, number, number]

export interface Sketch {
  /** Líneas del dibujo (grafito). */
  lines: readonly Segment[]
  /** Cotas (lápiz rojo), con sus marcas en los extremos. */
  cotas: readonly Segment[]
}

/** Armario empotrado de tres puertas con altillo. */
const WARDROBE: Sketch = {
  lines: [
    [40, 30, 160, 30],
    [160, 30, 160, 210],
    [160, 210, 40, 210],
    [40, 210, 40, 30],
    [40, 62, 160, 62],
    [80, 30, 80, 210],
    [120, 30, 120, 210],
    [74, 118, 74, 142],
    [86, 118, 86, 142],
    [126, 118, 126, 142],
    [20, 210, 180, 210],
  ],
  cotas: [
    [40, 18, 160, 18],
    [172, 30, 172, 210],
  ],
}

/** Puerta de paso con su marco, cuarterones y manilla. */
const DOOR: Sketch = {
  lines: [
    [58, 28, 142, 28],
    [58, 28, 58, 210],
    [142, 28, 142, 210],
    [66, 36, 134, 36],
    [66, 36, 66, 210],
    [134, 36, 134, 210],
    [78, 50, 122, 50],
    [78, 50, 78, 110],
    [122, 50, 122, 110],
    [78, 110, 122, 110],
    [78, 130, 122, 130],
    [78, 130, 78, 194],
    [122, 130, 122, 194],
    [78, 194, 122, 194],
    [118, 120, 128, 120],
    [20, 210, 180, 210],
  ],
  cotas: [
    [66, 18, 134, 18],
    [154, 36, 154, 210],
  ],
}

/** Suelo de tarima en perspectiva, con las juntas de las tablas al tresbolillo. */
const FLOOR: Sketch = {
  lines: [
    [16, 206, 184, 206],
    [184, 206, 150, 96],
    [150, 96, 50, 96],
    [50, 96, 16, 206],
    [44, 206, 67, 96],
    [72, 206, 83, 96],
    [100, 206, 100, 96],
    [128, 206, 117, 96],
    [156, 206, 133, 96],
    [30, 160, 57, 160],
    [87, 132, 104, 132],
    [114, 176, 131, 176],
    [138, 122, 154, 122],
    [61, 118, 76, 118],
    [148, 188, 168, 188],
  ],
  cotas: [[16, 222, 184, 222]],
}

/** Cocina: muebles bajos con encimera y altos, y la placa. */
const KITCHEN: Sketch = {
  lines: [
    [20, 140, 180, 140],
    [20, 146, 180, 146],
    [20, 146, 20, 210],
    [180, 146, 180, 210],
    [20, 200, 180, 200],
    [60, 146, 60, 200],
    [100, 146, 100, 200],
    [140, 146, 140, 200],
    [20, 40, 180, 40],
    [20, 40, 20, 96],
    [180, 40, 180, 96],
    [20, 96, 180, 96],
    [60, 40, 60, 96],
    [100, 40, 100, 96],
    [140, 40, 140, 96],
    [108, 136, 152, 136],
    [10, 210, 190, 210],
  ],
  cotas: [
    [20, 28, 180, 28],
    [8, 140, 8, 210],
  ],
}

/** Mueble de salón: paneles, hueco para la tele, columna de estantes y zócalo. */
const LIVING: Sketch = {
  lines: [
    [20, 40, 180, 40],
    [20, 40, 20, 190],
    [180, 40, 180, 190],
    [20, 190, 180, 190],
    [154, 40, 154, 190],
    [154, 80, 180, 80],
    [154, 118, 180, 118],
    [154, 156, 180, 156],
    [66, 82, 146, 82],
    [66, 82, 66, 140],
    [146, 82, 146, 140],
    [66, 140, 146, 140],
    [20, 82, 66, 82],
    [20, 140, 66, 140],
    [104, 40, 104, 82],
    [100, 140, 100, 190],
    [26, 196, 174, 196],
    [10, 210, 190, 210],
  ],
  cotas: [
    [20, 28, 180, 28],
    [192, 40, 192, 190],
  ],
}

/** Escalera de madera con su pasamanos (otros trabajos). */
const STAIRS: Sketch = {
  lines: [
    [30, 210, 30, 186],
    [30, 186, 58, 186],
    [58, 186, 58, 162],
    [58, 162, 86, 162],
    [86, 162, 86, 138],
    [86, 138, 114, 138],
    [114, 138, 114, 114],
    [114, 114, 142, 114],
    [142, 114, 142, 90],
    [142, 90, 170, 90],
    [170, 90, 170, 210],
    [30, 150, 166, 54],
    [44, 186, 44, 140],
    [72, 162, 72, 120],
    [100, 138, 100, 100],
    [128, 114, 128, 80],
    [156, 90, 156, 60],
    [16, 210, 184, 210],
  ],
  cotas: [[30, 224, 170, 224]],
}

const SKETCHES: Readonly<Record<string, Sketch>> = {
  armarios: WARDROBE,
  puertas: DOOR,
  suelos: FLOOR,
  cocinas: KITCHEN,
  salones: LIVING,
  'otros-trabajos': STAIRS,
}

/** Boceto de una categoría (por su slug); si no hay uno propio, la escalera de "otros trabajos". */
export const sketchFor = (slug: string): Sketch => SKETCHES[slug] ?? STAIRS
