/**
 * Vectoriza el logo (docs/referencias/Logo.jpg) y genera:
 *   - src/assets/brand/logo.svg   marca de la web (se usa como máscara CSS, toma el color del texto)
 *   - src/assets/brand/saw.svg    solo la sierra, centrada en su eje (spinner de carga)
 *   - public/favicon.svg          logo completo sobre círculo blanco
 *   - public/apple-touch-icon.png icono para iPhone (180 × 180)
 *
 * Uso (sharp y potrace no son dependencias del proyecto; se instalan solo para esto):
 *   npm i --no-save sharp potrace
 *   node scripts/images/logo.mjs
 */
import sharp from 'sharp'
import potrace from 'potrace'
import { writeFile } from 'node:fs/promises'

const SRC = 'docs/referencias/Logo.jpg'
const CX = 676.5, CY = 703            // centro de la sierra en el JPG original (1356 × 1403)
const SAW_INNER = 552, SAW_OUTER = 692 // radios: banda negra de la sierra y punta de los dientes

const trace = (png, opts) => new Promise((ok, ko) => potrace.trace(png, { threshold: 140, color: '#000', background: 'transparent', ...opts }, (e, svg) => (e ? ko(e) : ok(svg))))
const withViewBox = (svg, box) => svg.replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}">`)
const inner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<rect[^>]*\/>/, '')

// 1) Marca de la web.
const base = await sharp(SRC).greyscale().png().toBuffer()
await writeFile('src/assets/brand/logo.svg', withViewBox(await trace(base, { turdSize: 10, optTolerance: 0.4 }), '0 0 1356 1403'))

// 2) Sierra: se borra todo lo de dentro del anillo; el tramo que tapa la gorra del personaje
//    (245°–278°) se rellena con el tramo opuesto girado 180° (= 15 dientes; tiene ~30, cada ~12°).
const K = 2
const { data, info } = await sharp(SRC).greyscale().resize({ width: 1356 * K, kernel: 'lanczos3' }).raw().toBuffer({ resolveWithObject: true })
const W = info.width, H = info.height, cx = CX * K, cy = CY * K
const saw = Buffer.from(data)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const dx = x - cx, dy = y - cy, r = Math.hypot(dx, dy)
  if (r < SAW_INNER * K) { saw[y * W + x] = 255; continue }
  if (r > 700 * K) continue
  const a = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360
  if (a < 245 || a > 278) continue
  const sx = Math.round(cx - dx), sy = Math.round(cy - dy)
  saw[y * W + x] = sx >= 0 && sy >= 0 && sx < W && sy < H ? data[sy * W + sx] : 255
}
const sawPng = await sharp(saw, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer()
const R = SAW_OUTER * K
await writeFile('src/assets/brand/saw.svg', withViewBox(await trace(sawPng, { turdSize: 6, optTolerance: 0.25 }), `${(cx - R).toFixed(1)} ${(cy - R).toFixed(1)} ${(2 * R).toFixed(1)} ${(2 * R).toFixed(1)}`))

// 3) Favicon: logo completo sobre círculo blanco (se ve en pestañas claras y oscuras).
const small = await sharp(SRC).greyscale().resize({ width: 512, kernel: 'lanczos3' }).png().toBuffer()
const s = 512 / 1356, fh = Math.round(1403 * s)
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 ${fh}"><circle cx="${(CX * s).toFixed(1)}" cy="${(CY * s).toFixed(1)}" r="${(560 * s).toFixed(1)}" fill="#fff"/>${inner(await trace(small, { turdSize: 4, optTolerance: 0.5 }))}</svg>`
await writeFile('public/favicon.svg', favicon)

// 4) Icono para iPhone.
await sharp(Buffer.from(favicon)).resize(160, 160, { fit: 'contain', background: '#ffffff' }).extend({ top: 10, bottom: 10, left: 10, right: 10, background: '#ffffff' }).flatten({ background: '#ffffff' }).png().toFile('public/apple-touch-icon.png')
console.log('Logo, sierra, favicon e icono generados.')
