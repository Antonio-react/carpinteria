/**
 * Fotos de la galería: de los originales del cliente (fuera de Git por su peso) a WEBP ligeros en
 * src/assets/gallery/<categoría>/.
 *
 * Uso: node scripts/images/gallery.mjs "<carpeta con las subcarpetas Puertas, Cocinas...>"
 *
 * - Tres tamaños por foto: 480 y 960 de ancho para el mosaico (móvil / escritorio) y 1600 para el visor.
 * - Y una versión para el zoom (NN-zoom.webp, 3200 px por el lado largo y menos compresión): solo se
 *   descarga cuando alguien amplía esa foto en el visor, así que no afecta a la carga normal.
 * - Muchas fotos son "fotos en movimiento" del móvil: llevan un vídeo de ~4 MB pegado al JPEG. Al
 *   leerlas solo se usa la imagen, así que el vídeo desaparece solo.
 * - Se gira según el EXIF del móvil y se quitan los metadatos (fecha, GPS, modelo de cámara).
 * - No se toca el color ni la luz: solo recortes puntuales (fracciones del ancho/alto de la foto).
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { mkdir } from 'node:fs/promises'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const SOURCE = process.argv[2]
if (!SOURCE) {
  console.error('Falta la carpeta de originales: node scripts/images/gallery.mjs "<carpeta>"')
  process.exit(1)
}

const WIDTHS = [480, 960, 1600]
/** Versión para el zoom del visor: lado largo máximo (sin agrandar si el original es menor). */
const ZOOM_LONG_SIDE = 3200

/**
 * Fotos por categoría, en el orden en que salen en la galería. `crop`: lo que se quita de cada lado,
 * en fracción de la foto ya girada (0.1 = un 10 %).
 */
const PHOTOS = {
  puertas: [
    { file: 'Puertas/20251017_143034.jpg' },
    { file: 'Puertas/20260612_140725.jpg' },
    { file: 'Puertas/20191001_111736.jpg' },
    { file: 'Puertas/20261029_125201.jpg' },
    { file: 'Puertas/1.jpg' },
    { file: 'Puertas/20250718_123206.jpg' },
    { file: 'Puertas/20210302_092948.jpg' },
    { file: 'Puertas/unnamed.jpg' },
    { file: 'Puertas/20220603_113622.jpg' },
    { file: 'Puertas/20230512_095641.jpg' },
  ],
  cocinas: [
    { file: 'Cocinas/unnamed.jpg' },
    { file: 'Cocinas/20200324_195956.jpg' },
    { file: 'Cocinas/20250719_113006.jpg' },
    { file: 'Cocinas/20230826_120527.jpg' },
    { file: 'Cocinas/20160217_125611.jpg' },
    { file: 'Cocinas/20221026_110550.jpg' },
    { file: 'Cocinas/20200228_131503.jpg' },
    { file: 'Cocinas/20181010_155020.jpg', crop: { left: 0.1 } }, // hueco oscuro de la puerta
    { file: 'Cocinas/20180402_182739.jpg' },
    { file: 'Cocinas/20160225_154229.jpg' },
  ],
  // El mueble de salón del hero: su foto original está en el proyecto (solo se lee, no se modifica).
  salones: [{ file: resolve(root, 'src/assets/hero-original.jpeg') }],
}

/**
 * Portada de cada carpeta del carrusel: una de sus fotos, recortada a 4:5 (480×600 y 960×1200).
 * `photo`: número de la foto en la lista de arriba (1 = la primera). `focusX`: dónde se centra el
 * recorte en horizontal (0 = borde izquierdo, 0.5 = centro, 1 = borde derecho). `focusY` (opcional): igual
 * en vertical (0 = se queda la parte de arriba entera y se recorta abajo; por defecto 0.5, centrado).
 */
const COVERS = {
  puertas: { photo: 1, focusX: 0.5 },
  cocinas: { photo: 3, focusX: 0.5 },
  salones: { photo: 1, focusX: 0.5, focusY: 0 }, // el salón entero con la luz del techo; lo que sobra se quita del suelo
}

for (const [category, photos] of Object.entries(PHOTOS)) {
  const outDir = resolve(root, 'src/assets/gallery', category)
  await mkdir(outDir, { recursive: true })

  for (const [index, photo] of photos.entries()) {
    // failOn 'none': algunos JPEG del móvil traen avisos de formato que no afectan a la imagen
    const rotated = await sharp(resolve(SOURCE, photo.file), { failOn: 'none' }).rotate().toBuffer({ resolveWithObject: true })
    const { width, height } = rotated.info
    const c = { left: 0, top: 0, right: 0, bottom: 0, ...photo.crop }
    const region = {
      left: Math.round(width * c.left),
      top: Math.round(height * c.top),
      width: Math.round(width * (1 - c.left - c.right)),
      height: Math.round(height * (1 - c.top - c.bottom)),
    }

    const name = String(index + 1).padStart(2, '0')
    const sizes = []
    for (const target of WIDTHS) {
      const info = await sharp(rotated.data)
        .extract(region)
        .resize({ width: target, withoutEnlargement: true })
        .webp({ quality: target === 1600 ? 74 : 78, effort: 6 })
        .toFile(resolve(outDir, `${name}-${target}.webp`))
      sizes.push(`${target}: ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`)
    }
    const zoom = await sharp(rotated.data)
      .extract(region)
      .resize({ width: ZOOM_LONG_SIDE, height: ZOOM_LONG_SIDE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(resolve(outDir, `${name}-zoom.webp`))
    sizes.push(`zoom: ${zoom.width}x${zoom.height} ${(zoom.size / 1024).toFixed(0)} KB`)
    console.log(`${category}/${name}  ← ${photo.file}  |  ${sizes.join('  |  ')}`)
  }
}

// Las portadas salen del ORIGINAL (con su recorte), no de la versión de 1600 ya comprimida: así llevan
// una sola compresión y se ven más nítidas. El encuadre es el mismo.
for (const [category, { photo, focusX, focusY = 0.5 }] of Object.entries(COVERS)) {
  const outDir = resolve(root, 'src/assets/gallery', category)
  const entry = PHOTOS[category][photo - 1]
  const rotated = await sharp(resolve(SOURCE, entry.file), { failOn: 'none' }).rotate().toBuffer({ resolveWithObject: true })
  const c = { left: 0, top: 0, right: 0, bottom: 0, ...entry.crop }
  const largest = await sharp(rotated.data)
    .extract({
      left: Math.round(rotated.info.width * c.left),
      top: Math.round(rotated.info.height * c.top),
      width: Math.round(rotated.info.width * (1 - c.left - c.right)),
      height: Math.round(rotated.info.height * (1 - c.top - c.bottom)),
    })
    .toBuffer()
  const { width, height } = await sharp(largest).metadata()
  let cropWidth = width
  let cropHeight = Math.round((width * 5) / 4)
  if (cropHeight > height) {
    cropHeight = height
    cropWidth = Math.round((height * 4) / 5)
  }
  const left = Math.max(0, Math.min(width - cropWidth, Math.round(width * focusX - cropWidth / 2)))
  const top = Math.round((height - cropHeight) * focusY)

  for (const target of [480, 960]) {
    const info = await sharp(largest)
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize(target, Math.round((target * 5) / 4))
      .webp({ quality: 78, effort: 6 })
      .toFile(resolve(outDir, `portada-${target}.webp`))
    console.log(`${category}/portada-${target}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
  }
}
