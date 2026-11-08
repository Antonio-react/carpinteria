/**
 * Genera las capas del hero (src/assets/hero/): piece-{800,1400,2000}.webp (mueble recortado) y
 * room-{800,1400}.webp (la sala, mismo lienzo).
 *
 * Uso (sharp no es dependencia del proyecto; se instala solo para esto):
 *   npm i --no-save sharp
 *   node scripts/images/hero-layers.mjs <foto-ampliada.png> src/assets/hero
 *
 * Origen: la foto del hero ampliada con IA (4240 × 5656). También funciona con la original
 * (src/assets/hero-original.jpeg), con menos resolución.
 */
// Capas del hero a partir de la foto AMPLIADA (4240 × 5656). Todas las medidas están tomadas sobre la
// original (1792 × 2390) y se multiplican por S, así el script sirve para cualquier resolución.
import sharp from 'sharp'
const [src, outDir] = process.argv.slice(2)
const meta = await sharp(src).metadata()
const W = meta.width, H = meta.height, S = W / 1792
const P = ([x, y]) => [x * S, y * S]
const rgb = await sharp(src).removeAlpha().raw().toBuffer()
const at = (x, y) => (y * W + x) * 3
const pointIn = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c } return c }
const box = (poly) => { const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]); return [Math.floor(Math.min(...xs)), Math.ceil(Math.max(...xs)), Math.floor(Math.min(...ys)), Math.ceil(Math.max(...ys))] }
const eachIn = (poly, fn) => { const [x0, x1, y0, y1] = box(poly); for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (pointIn(poly, x, y)) fn(x, y) }
const smooth = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t) }

// Borde inferior REAL del zócalo (en coordenadas de la original).
const zocaloBottom = (x) => x <= 650 ? 1690 + (1652 - 1690) * (x - 445) / (650 - 445) : 1652 + 0.24 * (x - 650)

// Negro mate del zócalo, medido.
let s = [0, 0, 0], n = 0
eachIn([[1420,1780],[1520,1780],[1520,1860],[1420,1860]].map(P), (x, y) => { const i = at(x, y); s[0] += rgb[i]; s[1] += rgb[i+1]; s[2] += rgb[i+2]; n++ })
const black = s.map((v) => Math.round(v / n))

// 1) Esquina del zócalo tapada por la escalera.
eachIn([[1525,1790],[1650,1790],[1650,1945],[1525,1945]].map(P), (x, y) => rgb.set(black, at(x, y)))

// 2) Zócalo a la izquierda de la chimenea (reflejo gris) → negro del zócalo, sin tocar el marco.
eachIn([[136,1380],[279,1393],[279,1624],[138,1582]].map(P), (x, y) => { const i = at(x, y); for (let c = 0; c < 3; c++) rgb[i + c] = Math.round(black[c] + (rgb[i + c] - black[c]) * 0.1) })

// 3) Cristal de la chimenea: marco y cerco originales; fuera el reflejo (más fuerte en el centro).
const glass = [[292,1410],[447,1430],[447,1665],[292,1620]].map(P)
const core = [[299,1418],[440,1438],[440,1657],[299,1613]].map(P)
eachIn(glass, (x, y) => {
  const i = at(x, y), L = 0.299 * rgb[i] + 0.587 * rgb[i+1] + 0.114 * rgb[i+2]
  const t = (y / S - 1410) / 255
  const target = [18 + 26 * t, 12 + 12 * t, 9 + 5 * t]
  const m = pointIn(core, x, y) ? 1 : smooth(34, 70, L)
  for (let c = 0; c < 3; c++) rgb[i + c] = Math.round(rgb[i + c] * (1 - m) + target[c] * m)
})

// 4) Silueta. Lateral derecho: el canto de la columna está INCLINADO (x≈1650 arriba, ≈1635 abajo),
//    así que el corte sigue esa inclinación, 1-2 px por dentro del canto, y luego el zócalo.
const yb = (x) => zocaloBottom(x)
const outline = [[152,700],[1462,28],[1649,188],[1648,400],[1634,1490],[1633,1500],[1632,yb(1632)],[650,yb(650)],[445,1690],[272,1622],[141,1580],[139,1380]].map(P)
const mask = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg"><polygon points="${outline.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="#fff"/></svg>`)
const alpha = await sharp(mask).blur(1.1 * S).extractChannel(0).raw().toBuffer()
const rgba = Buffer.alloc(W * H * 4)
for (let i = 0; i < W * H; i++) { rgba[i*4]=rgb[i*3]; rgba[i*4+1]=rgb[i*3+1]; rgba[i*4+2]=rgb[i*3+2]; rgba[i*4+3]=alpha[i] }

const crop = { left: 0, top: Math.round(20 * S), width: Math.round(1656 * S), height: Math.round(1925 * S) }
const piece = sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract(crop)

// Sala SIN el mueble: donde está el mueble se pinta del negro del hero. Si no, al separarse las
// piezas del despiece se vería por los huecos una copia oscura del mueble ("fantasma").
const roomRgb = await sharp(src).removeAlpha().raw().toBuffer()
const grown = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(1.5 * S).linear(3, 0).raw().toBuffer()
const night = [15, 13, 11]
for (let i = 0; i < W * H; i++) { const a = Math.min(255, grown[i]) / 255; for (let c = 0; c < 3; c++) roomRgb[i * 3 + c] = Math.round(roomRgb[i * 3 + c] * (1 - a) + night[c] * a) }
const room = sharp(roomRgb, { raw: { width: W, height: H, channels: 3 } }).extract(crop)
for (const w of [800, 1400, 2000]) {
  await piece.clone().resize({ width: w, kernel: 'lanczos3' }).webp({ quality: 88, alphaQuality: 95, effort: 6, smartSubsample: true }).toFile(`${outDir}/piece-${w}.webp`)
  if (w < 2000) await room.clone().resize({ width: w, kernel: 'lanczos3' }).webp({ quality: 72, effort: 6 }).toFile(`${outDir}/room-${w}.webp`)
}
console.log(JSON.stringify({ W, H, S: S.toFixed(4), crop, black }))
