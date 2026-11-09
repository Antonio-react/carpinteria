/**
 * Texturas para las puertas que se abren en el hero (src/assets/hero/):
 *   inside-column.webp  interior de una columna de la izquierda (baldas blancas)
 *   inside-top.webp     interior del armario alto de encima de la tele (las dos puertas)
 *   oak-side.webp       madera de roble para el costado de la estantería cuando sale "como un cajón"
 *
 * Uso:
 *   node scripts/images/hero-doors.mjs docs/referencias/mueble-abierto.png src/assets/hero-original.jpeg src/assets/hero
 *
 * Origen: una foto del mismo mueble con las puertas abiertas, hecha de frente (1269 × 952, en
 * docs/referencias/, no se publica). Medidas tomadas sobre esa foto:
 *   - columna central de la izquierda: x 450–636, y 205–641 (sin la cara de abajo de la tapa ni el
 *     zócalo negro). Las baldas están en y 312, 425 y 540 y el suelo en 630: por la perspectiva de esa
 *     foto los huecos salen desiguales y en el hero el mueble parecía deforme. Se reparte en vertical
 *     por tramos para que los cuatro huecos midan lo mismo (el mueble real los tiene iguales). Arriba a la derecha (x ≥ 583, y < 372)
 *     la tapa la hoja de otra puerta abierta: se rellena prolongando en horizontal la columna de
 *     píxeles x = 580 (fondo liso y la balda, que sigue recta).
 *   - armario alto, mitad derecha: x 850–1022 (sin el poste central ni su línea de sombra, en 843–846,
 *     que asomando bajo una puerta entornada se leían como una raya gris; ni las placas de bisagra del
 *     borde), y 137–355 (sin el canto claro del tablero de abajo, en 357–362; en
 *     362 ya asoma el borde negro de la tele: se veía como una línea negra encima de la tele).
 *     Se refleja en horizontal: en esa foto se ve su pared interior derecha, y desde el ángulo del
 *     hero se vería la izquierda.
 * Color: cada interior se iguala al blanco del hero JUNTO a su puerta, un 15 % más oscuro (dentro
 * del mueble llega menos luz).
 */
import sharp from 'sharp'

const [openSrc, heroSrc, outDir] = process.argv.slice(2)

/** Color medio de una zona. (stats() de sharp mide la imagen de entrada: hay que recortar antes.) */
async function meanColor(src, left, top, width, height) {
  const crop = await sharp(src).extract({ left, top, width, height }).png().toBuffer()
  const { channels } = await sharp(crop).stats()
  return channels.slice(0, 3).map((c) => c.mean)
}

/** Recorte con corrección de color hacia `target`; `patch` puede retocar los píxeles antes. */
async function cut(box, target, file, { patch, flop = false, scale = 2, ref, rows, edge } = {}) {
  const raw = await sharp(openSrc).extract(box).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = raw.info
  if (patch) patch(raw.data, W, H)
  const straight = edge ? straightenEdge(raw.data, W, H, box, edge) : raw.data
  const data = rows ? remapRows(straight, W, H, rows) : straight
  // Zona de referencia para el color (por defecto, todo el recorte), relativa al recorte.
  const r = ref ?? { left: 0, top: 0, width: W, height: H }
  const mean = [0, 0, 0]
  for (let y = r.top; y < r.top + r.height; y++)
    for (let x = r.left; x < r.left + r.width; x++) for (let c = 0; c < 3; c++) mean[c] += data[(y * W + x) * 3 + c] / (r.width * r.height)
  const gain = target.map((t, i) => t / mean[i])
  for (let i = 0; i < data.length; i++) data[i] = Math.min(255, Math.round(data[i] * gain[i % 3]))
  let img = sharp(data, { raw: { width: W, height: H, channels: 3 } })
  if (flop) img = img.flop()
  await img.resize(W * scale, H * scale, { kernel: 'lanczos3' }).webp({ quality: 82 }).toFile(`${outDir}/${file}`)
  console.log(file, W * scale, '×', H * scale, 'ganancia', gain.map((g) => g.toFixed(2)).join(' '))
}

const shade = (rgb, k) => rgb.map((v) => v * k)

/**
 * Endereza una arista vertical que en la foto sale inclinada: en cada fila, la arista (edge.at(y), en
 * coordenadas de la foto) se lleva a la columna fija edge.x, estirando o encogiendo a cada lado; los
 * bordes del recorte no se mueven.
 */
function straightenEdge(px, W, H, box, edge) {
  const out = Buffer.alloc(px.length)
  const target = edge.x - box.left
  for (let y = 0; y < H; y++) {
    const e = edge.at(box.top + y) - box.left
    for (let x = 0; x < W; x++) {
      const sx = x <= target ? (x / target) * e : e + ((x - target) / (W - 1 - target)) * (W - 1 - e)
      const x0 = Math.floor(sx), x1 = Math.min(x0 + 1, W - 1), f = sx - x0
      for (let c = 0; c < 3; c++) out[(y * W + x) * 3 + c] = Math.round(px[(y * W + x0) * 3 + c] * (1 - f) + px[(y * W + x1) * 3 + c] * f)
    }
  }
  return out
}

/**
 * Reparte las filas por tramos: rows.from son alturas del recorte (p. ej. las baldas) y rows.to las
 * alturas a las que deben quedar. Interpolación lineal entre filas.
 */
function remapRows(px, W, H, { from, to }) {
  const out = Buffer.alloc(px.length)
  for (let y = 0; y < H; y++) {
    let k = 0
    while (k < to.length - 2 && y > to[k + 1]) k++
    const t = (y - to[k]) / (to[k + 1] - to[k])
    const sy = Math.min(Math.max(from[k] + t * (from[k + 1] - from[k]), 0), H - 1)
    const y0 = Math.floor(sy), y1 = Math.min(y0 + 1, H - 1), f = sy - y0
    for (let x = 0; x < W * 3; x++) out[y * W * 3 + x] = Math.round(px[y0 * W * 3 + x] * (1 - f) + px[y1 * W * 3 + x] * f)
  }
  return out
}

// 1) Interior de columna: blanco de las puertas de la izquierda del hero.
const leftWhite = await meanColor(heroSrc, 220, 900, 280, 200)
// Baldas (relativas al recorte, que empieza en 205): 107, 220, 335; suelo 425; fin 436.
await cut({ left: 450, top: 205, width: 186, height: 436 }, shade(leftWhite, 0.85), 'inside-column.webp', {
  rows: { from: [0, 107, 220, 335, 425, 436], to: [0, 106.25, 212.5, 318.75, 425, 436] },
  // El canto de la caja de la tubería va de x = 523 (y 230) a x = 537 (y 625): por la perspectiva de
  // esa foto, los huecos de su derecha salían más anchos arriba que abajo. Se pone vertical en x = 530.
  edge: { x: 530, at: (y) => 523 + 0.0354 * (y - 230) },
  patch(px, W) {
    const fromX = 580 - 450
    for (let y = 0; y < 372 - 205; y++)
      for (let x = 583 - 450; x < W; x++) for (let c = 0; c < 3; c++) px[(y * W + x) * 3 + c] = px[(y * W + fromX) * 3 + c]
  },
})

// 2) Interior del armario alto: blanco de la puerta de encima de la tele.
const topWhite = await meanColor(heroSrc, 880, 300, 260, 180)
// Solo el interior (y 198–355): sin la franja de la tapa (137–196, muy gruesa y con una sombra que se
// veía como una línea) ni el canto de abajo (356–362). Los cantos de arriba y abajo los dibuja HeroDoors,
// con el mismo grosor en todos los huecos.
await cut({ left: 850, top: 198, width: 172, height: 157 }, shade(topWhite, 0.85), 'inside-top.webp', { flop: true })

// 3) Roble: la veta del fondo de la estantería (en sombra en la foto), coloreada con el tono del canto,
//    algo más cálido y sin aclarar (aclarado se veía brillante y artificial junto al blanco del frente).
const oakTone = await meanColor(heroSrc, 1469, 600, 5, 300)
const { data: grain, info: g } = await sharp(heroSrc)
  .extract({ left: 1500, top: 215, width: 110, height: 190 })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true })
const WARM = [0.95, 0.88, 0.72]
const avg = grain.reduce((s, v) => s + v, 0) / grain.length
const oak = Buffer.alloc(g.width * g.height * 3)
for (let i = 0; i < grain.length; i++) {
  const k = 1 + ((grain[i] - avg) / avg) * 0.9 // veta marcada
  for (let c = 0; c < 3; c++) oak[i * 3 + c] = Math.max(0, Math.min(255, Math.round(oakTone[c] * WARM[c] * k)))
}
await sharp(oak, { raw: { width: g.width, height: g.height, channels: 3 } })
  .resize(110, 380)
  .webp({ quality: 82 })
  .toFile(`${outDir}/oak-side.webp`)
console.log('oak-side.webp 110 × 380')
