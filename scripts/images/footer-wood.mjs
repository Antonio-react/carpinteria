/**
 * Textura de madera del pie de página: de la foto original (en docs/referencias/, fuera de Git por su
 * peso) a dos WEBP ligeros en src/assets/textures/.
 * PROVISIONAL: es una foto de prueba. Cuando el cliente mande la foto real de una tabla de su taller,
 * se cambia SOURCE y se vuelve a ejecutar: node scripts/images/footer-wood.mjs
 * - Se oscurece y se baja el contraste aquí (va detrás de texto). A 1600px de ancho basta: va oscurecida.
 * - Sin metadatos (EXIF) ni perfil de cámara.
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const SOURCE = resolve(root, 'docs/referencias/footer-madera-original.jpg')
const OUT = resolve(root, 'src/assets/textures')

for (const width of [1000, 1600]) {
  const file = resolve(OUT, `footer-wood-${width}.webp`)
  const info = await sharp(SOURCE)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .modulate({ brightness: 0.5, saturation: 0.85 }) // ya oscurecida: pesa mucho menos y el CSS solo remata
    .linear(0.85, 10) // menos contraste: las vetas se ven, pero no compiten con el texto
    .webp({ quality: 50, effort: 6 })
    .toFile(file)
  console.log(`footer-wood-${width}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)
}
