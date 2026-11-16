import { expect, test } from './support/fixtures'
import { PAGES } from './support/routes'

/**
 * Metadatos: cada página con su título y descripción propios (y distintos), URL canónica,
 * idioma, un solo h1 y la tarjeta para compartir (Open Graph), fija para toda la web.
 */
interface PageMetaInfo {
  path: string
  title: string
  description: string
  canonical: string | null
  h1Count: number
}

const metaOf = async (page: import('@playwright/test').Page, path: string): Promise<PageMetaInfo> => {
  await page.goto(path, { waitUntil: 'networkidle' })
  // PageMeta se aplica tras pintar: se espera a que el título cambie al de la página.
  await page.waitForTimeout(300)
  return page.evaluate((current) => ({
    path: current,
    title: document.title,
    description: document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? '',
    canonical: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? null,
    h1Count: document.querySelectorAll('h1').length,
  }), path)
}

test('cada página tiene título, descripción y canónica propios', async ({ page }) => {
  const all: PageMetaInfo[] = []
  for (const route of PAGES) all.push(await metaOf(page, route.path))

  const problems: string[] = []
  for (const info of all) {
    if (info.title.length < 15 || info.title.length > 65) problems.push(`${info.path}: el título mide ${info.title.length} caracteres (mejor entre 15 y 65): "${info.title}"`)
    if (info.description.length < 70 || info.description.length > 160) problems.push(`${info.path}: la descripción mide ${info.description.length} caracteres (mejor entre 70 y 160)`)
    if (!info.canonical) problems.push(`${info.path}: falta <link rel="canonical">`)
    else if (!info.canonical.startsWith('https://') || new URL(info.canonical).pathname !== info.path) problems.push(`${info.path}: canónica incorrecta (${info.canonical})`)
    if (info.h1Count !== 1) problems.push(`${info.path}: tiene ${info.h1Count} <h1> (debe haber exactamente uno)`)
  }
  const repeated = (key: 'title' | 'description') =>
    all.filter((info, index) => all.findIndex((other) => other[key] === info[key]) !== index).map((info) => `${info.path}: ${key === 'title' ? 'título' : 'descripción'} repetido de otra página`)
  problems.push(...repeated('title'), ...repeated('description'))

  expect(problems, `Metadatos a revisar:\n  · ${problems.join('\n  · ')}`).toEqual([])
})

test('metadatos comunes: idioma, robots, favicon y Open Graph', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /\S/)
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg')
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1)
  for (const property of ['og:title', 'og:description', 'og:url', 'og:image', 'og:image:alt', 'og:locale', 'og:type']) {
    await expect(page.locator(`meta[property="${property}"]`), `Falta ${property}`).toHaveAttribute('content', /\S/)
  }
  // Las variables %VITE_...% de index.html tienen que haberse sustituido al compilar.
  const html = await page.content()
  expect(html, 'Queda una variable %VITE_...% sin sustituir en index.html (¿falta en .env?)').not.toMatch(/%VITE_[A-Z_]+%/)

  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
  const image = await page.request.get(new URL(ogImage ?? '', 'http://x').pathname)
  expect(image.status(), 'La imagen para compartir (og-image.jpg) no existe').toBe(200)
})
