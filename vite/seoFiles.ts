import type { Plugin } from 'vite'
import { CATEGORY_NAMES, CATEGORY_SLUGS } from '../src/data/categorySlugs.ts'
import { LEGAL_PAGES, MAIN_PAGES, type PageInfo } from '../src/data/pages.ts'

/**
 * Genera al compilar robots.txt, sitemap.xml y llms.txt, con el dominio de VITE_SITE_DOMAIN.
 *
 * Por qué generarlos y no dejarlos fijos en /public: el dominio cambia (ahora el de pruebas .netlify.app,
 * luego carpinteriaydecoracion.com) y el sitemap necesita direcciones completas. Así el dominio vive en
 * un solo sitio (la variable de entorno) y las categorías salen de src/data/categorySlugs.ts.
 *
 * Importante: sin estos archivos, Netlify devolvía la página web (index.html) al pedir /robots.txt,
 * por la regla de la SPA de netlify.toml, y Lighthouse daba "robots.txt no es válido".
 *
 * El robots.txt siempre permite rastrear: lo que decide si Google indexa es la etiqueta
 * <meta name="robots"> (VITE_ROBOTS). Si se bloqueara aquí, Google ni siquiera vería ese "noindex".
 */

// Páginas, nombres y resúmenes: src/data/pages.ts (el mismo archivo que usan las páginas y index.html).

function robotsTxt(origin: string) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`
}

function sitemapXml(origin: string) {
  const paths = [
    ...MAIN_PAGES.map((page) => page.path),
    ...CATEGORY_SLUGS.map((slug) => `/trabajos/${slug}`),
    ...LEGAL_PAGES.map((page) => page.path),
  ]
  const urls = paths.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

/** Resumen en Markdown para asistentes de IA (formato llmstxt.org: un H1, una cita y listas de enlaces). */
function llmsTxt(origin: string) {
  const link = (page: PageInfo) => `- [${page.name}](${origin}${page.path}): ${page.summary}`
  const categories = CATEGORY_SLUGS.map((slug) => `- [${CATEGORY_NAMES[slug]}](${origin}/trabajos/${slug})`)

  return [
    '# Carpintería y Decoración',
    '',
    '> Empresa familiar de ebanistería y carpintería con más de 40 años de experiencia. Hace muebles y trabajos de madera a medida: mide, diseña, fabrica y monta sin intermediarios, en toda España. Presupuesto gratis.',
    '',
    'Trabajan cualquier encargo en madera (armarios, puertas, suelos, cocinas, muebles de salón, escaleras y revestimientos). No se prometen plazos fijos: cada encargo se estudia a medida. La vía de contacto es el formulario de presupuesto o el correo de la página de contacto.',
    '',
    '## Páginas',
    '',
    ...MAIN_PAGES.map(link),
    '',
    '## Categorías de trabajos',
    '',
    ...categories,
    '',
    '## Optional',
    '',
    ...LEGAL_PAGES.map(link),
    '',
  ].join('\n')
}

export function seoFiles(domain: string): Plugin {
  const origin = `https://${domain}`
  return {
    name: 'carpinteria:seo-files',
    apply: 'build',
    generateBundle() {
      if (!domain) throw new Error('seoFiles: falta VITE_SITE_DOMAIN (.env o variables de Netlify)')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt(origin) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml(origin) })
      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: llmsTxt(origin) })
    },
  }
}
