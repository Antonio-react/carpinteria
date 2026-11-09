/**
 * Genera src/assets/hero/oak-frame-top.webp: el borde de arriba del mueble junto a su esquina derecha
 * (sobre la estantería de roble), que el recorte del mueble (hero-layers.mjs) dejaba unos píxeles por
 * debajo del canto real: a la derecha cortaba el cerco por la mitad (arriba solo quedaban ~9 de sus
 * ~24 px) y la esquina no se veía limpia. Se superpone a la foto en el hero (Hero.tsx), así que las capas
 * piece-*.webp NO se tocan (volver a comprimirlas les restaría calidad).
 *
 * Uso: node scripts/images/hero-oak-frame.mjs
 *
 * Medidas en el LIENZO (= foto original con y − 20). La línea oscura del borde (sombra contra el techo):
 *   a la izquierda de la esquina: y = 33 − 0,517 · (x − 1400)   (medida en x = 1400, 1430, 1450, 1460)
 *   a la derecha (cerco del roble): y = −10 + 0,941 · (x − 1462) (medida en x = 1490 → 17, 1630 → 147)
 * El borde blanco empieza 2 px por debajo de esa línea, a los dos lados; en la esquina, las dos rectas se
 * unen con un redondeo de ~3 px, como en la foto. Recorte viejo (lo que ya se veía):
 *   izquierda: y = 680 − 0,513 · (x − 152)      derecha: y = 8 + 0,856 · (x − 1462)
 * Por la izquierda la franja entra poco a poco (x 1340–1380), para que no se note dónde empieza.
 */
import sharp from 'sharp'

const BOX = { left: 1340, top: 0, width: 315, height: 200 } // en el lienzo (1656 × 1925)
const K = 2000 / 1656 // resolución de piece-2000

const leftEdge = (x) => 33 - 0.517 * (x - 1400) + 2
const rightEdge = (x) => -10 + 0.941 * (x - 1462) + 2
/** Máximo suave de los dos bordes: une las dos rectas con un redondeo de radio r. */
const topEdge = (x, r = 3) => {
  const a = leftEdge(x)
  const b = rightEdge(x)
  return (a + b + Math.sqrt((a - b) ** 2 + 4 * r * r)) / 2
}
const oldEdge = (x) => (x < 1462 ? 680 - 0.513 * (x - 152) : 8 + 0.856 * (x - 1462))

const W = Math.round(BOX.width * K)
const H = Math.round(BOX.height * K)
const src = await sharp('src/assets/hero-original.jpeg')
  .extract({ left: BOX.left, top: BOX.top + 20, width: BOX.width, height: BOX.height })
  .resize(W, H, { kernel: 'lanczos3' })
  .removeAlpha()
  .raw()
  .toBuffer()

const out = Buffer.alloc(W * H * 4)
for (let py = 0; py < H; py++) {
  for (let px = 0; px < W; px++) {
    const x = BOX.left + px / K
    const y = BOX.top + py / K
    // Solo la franja que faltaba: entre el borde real (1 px de transición) y el recorte viejo (+2 px de solape).
    const inside = x <= 1649.5 && y < oldEdge(x) + 2
    const fadeIn = Math.min(Math.max((x - 1340) / 40, 0), 1)
    const a = inside ? Math.min(Math.max(y - topEdge(x) + 0.5, 0), 1) * fadeIn : 0
    const i = (py * W + px) * 4
    const j = (py * W + px) * 3
    out[i] = src[j]
    out[i + 1] = src[j + 1]
    out[i + 2] = src[j + 2]
    out[i + 3] = Math.round(a * 255)
  }
}
await sharp(out, { raw: { width: W, height: H, channels: 4 } })
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile('src/assets/hero/oak-frame-top.webp')
console.log('oak-frame-top.webp', W, '×', H, '— lienzo x', BOX.left, '–', BOX.left + BOX.width, ', y 0 –', BOX.height)
