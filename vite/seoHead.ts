import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import type { HtmlTagDescriptor, Plugin } from 'vite'
import { siteConfig } from '../src/config/site.ts'
import { CATEGORY_NAMES, CATEGORY_SEO_DESCRIPTIONS, CATEGORY_SLUGS } from '../src/data/categorySlugs.ts'
import { categoryTitle, LEGAL_PAGES, MAIN_PAGES, PAGES } from '../src/data/pages.ts'

/**
 * SEO desde los datos (como en la web de la escuela): al compilar, mete en el <head> de index.html el título,
 * la descripción, el canonical, los textos para compartir (og:*) y la ficha del negocio para Google (JSON-LD),
 * sacados de src/data/pages.ts y src/config/site.ts. Así index.html no lleva ninguno escrito a mano.
 *
 * Van en el HTML (y no solo los pone React) porque Google, WhatsApp y Facebook los leen sin ejecutar
 * JavaScript. Al navegar por la web, PageMeta cambia los de cada página.
 *
 * Además (opción A), al terminar el build crea un HTML por página con su título y descripción: ver closeBundle.
 *
 * El JSON-LD no choca con la CSP de netlify.toml: un <script type="application/ld+json"> es un bloque de
 * datos, el navegador no lo ejecuta.
 */

const { home } = PAGES

/** "675 81 66 09" → "+34675816609" (formato internacional que pide schema.org). */
const internationalPhone = (phone: string) => `+34${phone.replace(/\D/g, '')}`

/** "8:30 - 14:00" → { opens: "08:30", closes: "14:00" } (schema.org pide la hora con dos cifras). */
function openingRange(range: string) {
  const [opens = '', closes = ''] = range.split(/\s*-\s*/).map((hour) => hour.trim().padStart(5, '0'))
  return { opens, closes }
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const

/**
 * Ficha del taller para Google (https://schema.org): nombre, dirección, contacto, horario y zona de servicio.
 * Se comprueba con la Prueba de resultados enriquecidos de Google. HomeAndConstructionBusiness es el tipo de
 * negocio local de schema.org que engloba a carpinteros y reformas (no existe uno solo para carpintería).
 */
function structuredData(origin: string): Record<string, unknown> {
  const { direccion, horario, telefonos } = siteConfig
  // El horario de site.ts es texto ("Lunes a viernes"): solo se declara si son los días de siempre.
  const weekdays = horario.dias.trim().toLowerCase() === 'lunes a viernes'
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${origin}/#taller`,
    name: siteConfig.nombre,
    slogan: siteConfig.lema,
    description: home.description,
    url: `${origin}/`,
    logo: `${origin}/favicon-192.png`,
    image: `${origin}/og-image.jpg`,
    email: siteConfig.email,
    telephone: internationalPhone(telefonos.principal),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${direccion.calle}, ${direccion.poligono}`,
      postalCode: direccion.codigoPostal,
      addressLocality: direccion.localidad,
      addressRegion: direccion.provincia,
      addressCountry: 'ES',
    },
    areaServed: { '@type': 'Country', name: 'España' },
    ...(weekdays && {
      openingHoursSpecification: [horario.manana, horario.tarde].map((range) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: WEEKDAYS,
        ...openingRange(range),
      })),
    }),
  }
}

interface RouteHead {
  path: string
  title: string
  description: string
}

/** Todas las páginas menos Inicio (que ya es el index.html): principales, categorías y legales. */
function otherRoutes(): RouteHead[] {
  return [
    ...MAIN_PAGES.filter((page) => page.path !== '/'),
    ...CATEGORY_SLUGS.map((slug) => ({
      path: `/trabajos/${slug}`,
      title: categoryTitle(CATEGORY_NAMES[slug]),
      description: CATEGORY_SEO_DESCRIPTIONS[slug],
    })),
    ...LEGAL_PAGES,
  ]
}

/** Para meter un texto dentro de un atributo o del <title> sin romper el HTML. */
const escapeHtml = (text: string) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

/**
 * Copia del index.html ya compilado con el título, la descripción, el canonical y los og:* de otra página.
 * Si alguna etiqueta no se encuentra, el build falla: mejor eso que publicar páginas con los datos de Inicio.
 */
function headFor(html: string, route: RouteHead, origin: string): string {
  const url = `${origin}${route.path}`
  const title = escapeHtml(route.title)
  const description = escapeHtml(route.description)
  const replacements: [RegExp, string][] = [
    [/<title>[^<]*<\/title>/, `<title>${title}</title>`],
    [/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`],
    [/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`],
    [/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`],
    [/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`],
    [/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`],
  ]
  return replacements.reduce((result, [pattern, value]) => {
    if (!pattern.test(result)) throw new Error(`seoHead: no encuentro ${pattern} en index.html para ${route.path}`)
    return result.replace(pattern, value)
  }, html)
}

export function seoHead(domain: string): Plugin {
  const origin = `https://${domain}`
  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' })
  let outDir = 'dist'

  return {
    name: 'carpinteria:seo-head',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    /**
     * Opción A (como la acordada para el gimnasio): al terminar el build, un HTML por página
     * (dist/contacto.html, dist/trabajos/cocinas.html…) con su título, descripción y canonical.
     * Netlify sirve estos archivos antes que la regla de la SPA (netlify.toml no usa force), así Google,
     * WhatsApp y Facebook ven los de cada página sin ejecutar JavaScript. La web es la misma: React arranca
     * igual y PageMeta cambia las mismas etiquetas al navegar (sin duplicarlas).
     */
    async closeBundle() {
      if (this.meta.watchMode) return
      // En `npm run dev` no hay dist/index.html: no se hace nada.
      const html = await readFile(path.join(outDir, 'index.html'), 'utf8').catch(() => '')
      if (!html) return
      for (const route of otherRoutes()) {
        // Archivo suelto (contacto.html, trabajos/cocinas.html) y no carpeta (contacto/index.html): Netlify
        // sirve /contacto con contacto.html sin redirigir, mientras que con la carpeta redirige a /contacto/
        // (con barra) y la dirección ya no coincidiría con el canonical.
        const file = path.join(outDir, `${route.path.slice(1)}.html`)
        await mkdir(path.dirname(file), { recursive: true })
        await writeFile(file, headFor(html, route, origin))
      }
    },
    transformIndexHtml() {
      if (!domain) throw new Error('seoHead: falta VITE_SITE_DOMAIN (.env o variables de Netlify)')
      return [
        { tag: 'title', children: home.title, injectTo: 'head' },
        meta({ name: 'description', content: home.description }),
        { tag: 'link', attrs: { rel: 'canonical', href: `${origin}/` }, injectTo: 'head' },
        meta({ property: 'og:url', content: `${origin}/` }),
        meta({ property: 'og:title', content: home.title }),
        meta({ property: 'og:description', content: home.description }),
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          // "<" escrito como <: así ningún texto puede cerrar la etiqueta <script> antes de tiempo.
          children: JSON.stringify(structuredData(origin)).replaceAll('<', '\\u003c'),
          injectTo: 'head',
        },
      ]
    },
  }
}
