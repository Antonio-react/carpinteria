/**
 * Genera `src/config/site.ts` antes del build (Netlify), porque ese archivo NO está en GitHub.
 *
 * - Si `src/config/site.ts` ya existe (tu ordenador), no hace nada.
 * - Si no existe, lo crea con las variables de entorno de Netlify
 *   (Site configuration → Environment variables):
 *
 *     SITE_TITULAR, SITE_NIF, SITE_EMAIL,
 *     SITE_TELEFONO_PRINCIPAL, SITE_TELEFONO_SECUNDARIO,
 *     SITE_CALLE, SITE_POLIGONO, SITE_CODIGO_POSTAL, SITE_LOCALIDAD, SITE_PROVINCIA,
 *     SITE_DOMINIO
 *
 *   Nombre, lema y horario no son datos sensibles: salen de la plantilla si no se definen
 *   (SITE_NOMBRE, SITE_LEMA, SITE_HORARIO_DIAS, SITE_HORARIO_MANANA, SITE_HORARIO_TARDE).
 * - Si falta alguna variable obligatoria, el build falla con un mensaje claro
 *   (mejor que publicar la web con datos de ejemplo).
 */
import { existsSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const target = resolve(root, 'src/config/site.ts')

if (existsSync(target)) {
  console.log('[site-config] src/config/site.ts ya existe: no se genera.')
  process.exit(0)
}

const env = process.env
const required = [
  'SITE_TITULAR',
  'SITE_NIF',
  'SITE_EMAIL',
  'SITE_TELEFONO_PRINCIPAL',
  'SITE_TELEFONO_SECUNDARIO',
  'SITE_CALLE',
  'SITE_POLIGONO',
  'SITE_CODIGO_POSTAL',
  'SITE_LOCALIDAD',
  'SITE_PROVINCIA',
  'SITE_DOMINIO',
]
const missing = required.filter((key) => !env[key])
if (missing.length > 0) {
  console.error(`[site-config] Faltan variables de entorno en Netlify: ${missing.join(', ')}`)
  process.exit(1)
}

const config = {
  nombre: env.SITE_NOMBRE ?? 'Carpintería y Decoración',
  titular: env.SITE_TITULAR,
  lema: env.SITE_LEMA ?? 'Espacios de ensueño',
  email: env.SITE_EMAIL,
  telefonos: { principal: env.SITE_TELEFONO_PRINCIPAL, secundario: env.SITE_TELEFONO_SECUNDARIO },
  direccion: {
    calle: env.SITE_CALLE,
    poligono: env.SITE_POLIGONO,
    codigoPostal: env.SITE_CODIGO_POSTAL,
    localidad: env.SITE_LOCALIDAD,
    provincia: env.SITE_PROVINCIA,
  },
  horario: {
    manana: env.SITE_HORARIO_MANANA ?? '8:30 - 14:00',
    tarde: env.SITE_HORARIO_TARDE ?? '15:30 - 18:30',
    dias: env.SITE_HORARIO_DIAS ?? 'Lunes a viernes',
  },
  dominio: { com: env.SITE_DOMINIO },
  nif: env.SITE_NIF,
}

writeFileSync(target, `// Generado automáticamente en el build. No editar.\nexport const siteConfig = ${JSON.stringify(config, null, 2)} as const;\n`)
console.log('[site-config] src/config/site.ts generado desde las variables de entorno.')
