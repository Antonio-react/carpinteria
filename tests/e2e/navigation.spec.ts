import { expect, test } from './support/fixtures'
import { netlify } from './support/netlify'
import { NOT_FOUND, NOT_FOUND_HEADING, PAGES } from './support/routes'

/**
 * Rutas al refrescar (F5), página 404 y "empezar arriba del todo".
 * El servidor de pruebas (vite preview) ya devuelve index.html para cualquier ruta, igual que
 * Netlify con la regla de netlify.toml. Por eso, además de probarlo en el navegador, se comprueba
 * que esa regla siga en netlify.toml: si alguien la borra, en Netlify F5 daría 404.
 */

test('netlify.toml: cualquier ruta devuelve index.html (F5 no da 404)', () => {
  const spa = netlify.redirects.find((rule) => rule.from === '/*')
  expect(spa, 'Falta la regla [[redirects]] from = "/*" en netlify.toml').toBeDefined()
  expect(spa?.to).toBe('/index.html')
  expect(spa?.status, 'Debe ser 200 (reescritura), no 301/302: la URL no debe cambiar').toBe(200)
  // Con force = true taparía también los archivos reales (/favicon.svg, /assets/...).
  expect(spa?.force ?? false).toBe(false)
})

for (const route of PAGES) {
  test(`F5 funciona y empieza arriba · ${route.name} (${route.path})`, async ({ page }) => {
    const response = await page.goto(route.path, { waitUntil: 'networkidle' })
    expect(response?.status()).toBe(200)
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).not.toHaveText(NOT_FOUND_HEADING)
    const before = (await heading.textContent()) ?? ''

    // Bajar a mitad de página y recargar: debe volver arriba y a la misma página.
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2))
    await page.waitForTimeout(200)
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page).toHaveURL(new RegExp(`${route.path.replace(/\//g, '\\/')}$`))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(before)
    await page.waitForTimeout(300)
    expect(await page.evaluate(() => window.scrollY), 'Tras recargar, la página no empieza arriba').toBe(0)
  })
}

test('cambiar de página con un enlace empieza arriba del todo', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await page.waitForTimeout(400)
  await page.locator('footer').getByRole('link', { name: /aviso legal/i }).click()
  await expect(page).toHaveURL(/\/aviso-legal$/)
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
})

test('volver atrás con el navegador no deja la página a medias', async ({ page }) => {
  await page.goto('/trabajos', { waitUntil: 'networkidle' })
  await page.locator('footer').getByRole('link', { name: /privacidad/i }).click()
  await expect(page).toHaveURL(/\/privacidad$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/trabajos$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('página 404 propia con botón a Inicio', async ({ page }) => {
  await page.goto(NOT_FOUND.path, { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(NOT_FOUND_HEADING)
  await page.getByRole('link', { name: 'Volver al inicio' }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('una categoría que no existe muestra la 404, no una página vacía', async ({ page }) => {
  await page.goto('/trabajos/categoria-inventada', { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(NOT_FOUND_HEADING)
})

test('enlace con ancla desde otra página baja al formulario', async ({ page }) => {
  await page.goto('/contacto#formulario-contacto', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  const top = await page.locator('#formulario-contacto').evaluate((el) => el.getBoundingClientRect().top)
  const viewport = page.viewportSize()?.height ?? 900
  expect(top, 'El formulario debería quedar a la vista').toBeLessThan(viewport)
})
