import type { Page } from '@playwright/test'
import { collectCsp, expect, openFully, test } from './support/fixtures'
import { netlify, parseCsp, siteHeaders } from './support/netlify'
import { ALL_ROUTES } from './support/routes'

/**
 * Seguridad (anti-hackeo) y anti-bots.
 * 1. Cabeceras de netlify.toml: que estén y sean estrictas.
 * 2. Cada página, servida con esas cabeceras: sin bloqueos de CSP (lo que en Netlify no cargaría),
 *    sin errores, sin peticiones a terceros y sin cookies (lo que promete la política de cookies).
 * 3. Formulario: trampa para bots (honeypot), gemelo de Netlify sincronizado y envío correcto.
 */

test.describe('cabeceras de netlify.toml', () => {
  const header = (name: string) => Object.entries(siteHeaders).find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1]

  test('Content-Security-Policy estricta', () => {
    const policy = header('Content-Security-Policy')
    expect(policy, 'Falta la cabecera Content-Security-Policy').toBeDefined()
    const csp = parseCsp(policy ?? '')
    const problems: string[] = []
    const require = (directive: string, expected: string) => {
      if (!csp.get(directive)?.includes(expected)) problems.push(`${directive} debería ser ${expected}`)
    }
    require('default-src', "'self'")
    require('script-src', "'self'")
    require('object-src', "'none'")
    require('base-uri', "'self'")
    require('form-action', "'self'")
    require('frame-ancestors', "'none'")
    const scripts = csp.get('script-src') ?? []
    for (const unsafe of ["'unsafe-inline'", "'unsafe-eval'", '*', 'http:', 'https:', 'data:']) {
      if (scripts.includes(unsafe)) problems.push(`script-src permite ${unsafe}: abre la puerta a scripts inyectados (XSS)`)
    }
    expect(problems, problems.join('\n')).toEqual([])
  })

  test('resto de cabeceras de seguridad', () => {
    expect(header('X-Content-Type-Options')).toBe('nosniff')
    expect(header('X-Frame-Options')).toBe('DENY')
    expect(header('Referrer-Policy')).toMatch(/strict-origin|no-referrer|same-origin/)
    expect(header('Cross-Origin-Opener-Policy')).toBe('same-origin')
    expect(header('Permissions-Policy')).toMatch(/camera=\(\)/)
    const hsts = header('Strict-Transport-Security') ?? ''
    const maxAge = Number(/max-age=(\d+)/.exec(hsts)?.[1] ?? 0)
    expect(maxAge, 'HSTS debería durar al menos un año').toBeGreaterThanOrEqual(31_536_000)
  })

  test('los archivos con hash tienen caché larga (y el HTML no)', () => {
    const assets = netlify.headers.find((rule) => rule.for === '/assets/*')
    expect(assets?.values['Cache-Control']).toMatch(/immutable/)
    expect(siteHeaders['Cache-Control'] ?? '', 'Si el HTML se cachea un año, nadie vería las actualizaciones').not.toMatch(/immutable|max-age=31536000/)
  })
})

for (const route of ALL_ROUTES) {
  test(`sin bloqueos de CSP, errores, terceros ni cookies · ${route.name} (${route.path})`, async ({ page, context, watch }) => {
    await openFully(page, route.path)
    await collectCsp(page, watch)
    expect(watch.cspViolations, `La CSP de netlify.toml bloquearía esto en producción:\n  · ${watch.cspViolations.join('\n  · ')}`).toEqual([])
    expect(watch.errors, `Errores en la página:\n  · ${watch.errors.join('\n  · ')}`).toEqual([])
    expect(watch.thirdPartyRequests, `Peticiones a otros dominios (la política de cookies dice que no hay terceros):\n  · ${watch.thirdPartyRequests.join('\n  · ')}`).toEqual([])
    expect(await context.cookies(), 'La web ha creado cookies (la política de cookies dice que no usa)').toEqual([])
  })
}

test('enlaces que abren pestaña nueva no dan acceso a la página (rel="noopener")', async ({ page }) => {
  const problems: string[] = []
  for (const route of ALL_ROUTES) {
    await openFully(page, route.path)
    const bad = await page.$$eval('a[target="_blank"]', (links) =>
      links.filter((link) => !/noopener|noreferrer/.test(link.getAttribute('rel') ?? '')).map((link) => link.outerHTML.slice(0, 120)),
    )
    problems.push(...bad.map((html) => `${route.path}: ${html}`))
  }
  expect(problems, problems.join('\n')).toEqual([])
})

// ───────────────────────── Formulario ─────────────────────────

/** Rellena los 3 pasos del presupuesto con datos válidos. */
/** Abre Contacto y baja hasta el formulario (se carga en diferido al acercarse). */
async function openForm(page: Page) {
  await page.goto('/contacto', { waitUntil: 'networkidle' })
  await page.locator('#formulario-contacto').scrollIntoViewIfNeeded()
  await expect(page.locator('form[name="contacto"]:not([hidden])')).toBeVisible()
}

async function fillValidForm(page: Page) {
  await openForm(page)
  await page.locator('label').filter({ hasText: 'Cocinas' }).first().click()
  await expect(page.locator('#campo-mensaje')).toBeVisible()
  await page.locator('#campo-mensaje').fill('Quiero una cocina en L de unos 4 metros con isla.')
  await page.locator('#campo-ubicacion').fill('Toledo')
  await page.getByRole('button', { name: /Siguiente/ }).click()
  await page.locator('#campo-nombre').fill('Prueba Automática')
  await page.locator('#campo-email').fill('prueba@example.com')
  await page.locator('#campo-privacidad').check()
}

test('gemelo de Netlify en index.html: mismos campos que el formulario de React', async ({ page }) => {
  await openForm(page)
  const fieldsOf = (selector: string) =>
    page.$$eval(`${selector} [name]`, (elements) => [...new Set(elements.map((el) => el.getAttribute('name') ?? ''))].filter((name) => name && name !== 'form-name').sort())

  const twin = await fieldsOf('form[hidden][name="contacto"]')
  const real = await fieldsOf('form[name="contacto"]:not([hidden])')
  expect(twin.length, 'No se encuentra el formulario gemelo oculto en index.html').toBeGreaterThan(0)
  expect(real, 'Los campos del formulario de React y los del gemelo de index.html no coinciden: Netlify descartaría los que falten').toEqual(twin)

  const twinForm = page.locator('form[hidden][name="contacto"]')
  await expect(twinForm).toHaveAttribute('data-netlify', 'true')
  await expect(twinForm).toHaveAttribute('netlify-honeypot', 'bot-field')
  await expect(twinForm).toHaveAttribute('enctype', 'multipart/form-data')
})

test('la trampa para bots (honeypot) no la ve ni la alcanza una persona', async ({ page }) => {
  await openForm(page)
  const trap = page.locator('form:not([hidden]) input[name="bot-field"]')
  await expect(trap).toHaveCount(1)
  await expect(trap).toBeHidden()
  await expect(trap).toHaveAttribute('tabindex', '-1')
  await expect(trap).toHaveAttribute('autocomplete', 'off')
})

test('si un bot rellena la trampa, no se envía nada', async ({ page }) => {
  let posted = false
  await page.route('**/', async (route) => {
    if (route.request().method() === 'POST') posted = true
    await route.fallback()
  })
  await fillValidForm(page)
  await page.locator('form:not([hidden]) input[name="bot-field"]').evaluate((input) => {
    if (input instanceof HTMLInputElement) input.value = 'https://spam.example'
  })
  await page.getByRole('button', { name: /Enviar/ }).click()
  await page.waitForTimeout(2500)
  expect(posted, 'Con la trampa rellena se ha enviado el formulario').toBe(false)
})

test('envío correcto: llega a Netlify como multipart con form-name y se confirma', async ({ page }) => {
  let body = ''
  let contentType = ''
  await page.route('**/', async (route) => {
    const request = route.request()
    if (request.method() !== 'POST') return route.fallback()
    body = request.postDataBuffer()?.toString('utf8') ?? ''
    contentType = (await request.allHeaders())['content-type'] ?? ''
    await route.fulfill({ status: 200, body: 'ok' })
  })
  await fillValidForm(page)
  await page.getByRole('button', { name: /Enviar/ }).click()
  await expect(page.getByText('Mensaje enviado')).toBeVisible({ timeout: 8000 })
  expect(contentType).toMatch(/multipart\/form-data/)
  for (const field of ['form-name', 'tipo', 'mensaje', 'ubicacion', 'nombre', 'email', 'privacidad']) {
    expect(body, `El envío no lleva el campo ${field}`).toContain(`name="${field}"`)
  }
  expect(body).toContain('contacto')
})

test('si Netlify falla, se avisa con un error claro', async ({ page }) => {
  await page.route('**/', (route) => (route.request().method() === 'POST' ? route.fulfill({ status: 500, body: 'error' }) : route.fallback()))
  await fillValidForm(page)
  await page.getByRole('button', { name: /Enviar/ }).click()
  await expect(page.getByText('No se ha podido enviar')).toBeVisible({ timeout: 8000 })
})

test('sin datos obligatorios no se envía y se marca el error', async ({ page }) => {
  await openForm(page)
  await page.getByRole('button', { name: /Siguiente/ }).click()
  await expect(page.getByText(/Elige una opción para seguir/)).toBeVisible()
})
