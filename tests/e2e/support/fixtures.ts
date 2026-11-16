import { test as base, expect, type Page } from '@playwright/test'
import { localTestHeaders } from './netlify'

/** Lo que la página ha hecho "por detrás" y que los tests de seguridad revisan. */
export interface PageWatch {
  /** Bloqueos de la Content-Security-Policy (algo que en Netlify NO cargaría). */
  cspViolations: string[]
  /** Errores de JavaScript sin capturar y errores de consola. */
  errors: string[]
  /** Peticiones a dominios que no son el de la web (terceros). */
  thirdPartyRequests: string[]
}

declare global {
  interface Window {
    __cspViolations?: string[]
  }
}

/**
 * Extiende el `test` de Playwright para que TODAS las páginas se sirvan con las cabeceras de
 * seguridad de netlify.toml (como en producción) y se vigile lo que pasa por detrás.
 * Si un test rompe la CSP, se ve aquí antes de publicar, no cuando la web ya está en Netlify.
 */
export const test = base.extend<{ watch: PageWatch }>({
  watch: [
    async ({ page, baseURL }, use) => {
      const watch: PageWatch = { cspViolations: [], errors: [], thirdPartyRequests: [] }
      const origin = new URL(baseURL ?? 'http://localhost').origin
      const headers = localTestHeaders()

      await page.addInitScript(() => {
        window.__cspViolations = []
        document.addEventListener('securitypolicyviolation', (event) => {
          window.__cspViolations?.push(`${event.effectiveDirective} bloqueó ${event.blockedURI || '(código en línea)'} en ${event.sourceFile || 'la página'}:${event.lineNumber}`)
        })
      })

      await page.route('**/*', async (route) => {
        const request = route.request()
        if (request.resourceType() !== 'document' || new URL(request.url()).origin !== origin) return route.continue()
        // El servidor de pruebas, con poca RAM y varios navegadores, a veces corta una conexión: se reintenta.
        const response = await route.fetch().catch(() => route.fetch())
        await route.fulfill({ response, headers: { ...response.headers(), ...headers } })
      })

      page.on('pageerror', (error) => watch.errors.push(`Error JS: ${error.message}`))
      page.on('console', (message) => {
        if (message.type() === 'error') watch.errors.push(`Consola: ${message.text()}`)
      })
      page.on('request', (request) => {
        const url = new URL(request.url())
        if (url.protocol.startsWith('http') && url.origin !== origin) watch.thirdPartyRequests.push(request.url())
      })

      await use(watch)
    },
    { auto: true },
  ],
})

export { expect }

/** Recoge las violaciones de CSP que ha visto la página (se pierden al cambiar de documento). */
export async function collectCsp(page: Page, watch: PageWatch) {
  const found = await page.evaluate(() => window.__cspViolations ?? [])
  watch.cspViolations.push(...found)
}

/**
 * Abre una página y la recorre entera hacia abajo para que carguen las secciones diferidas
 * (LazySection, carrusel...), y vuelve arriba. Así axe y los tests de foco ven la página completa.
 */
export async function openFully(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: 'networkidle' })
  await page.evaluate(async () => {
    const pause = () => new Promise((resolve) => setTimeout(resolve, 120))
    for (let y = 0; y <= document.documentElement.scrollHeight; y += Math.round(window.innerHeight * 0.7)) {
      window.scrollTo(0, y)
      await pause()
    }
    window.scrollTo(0, document.documentElement.scrollHeight)
    await pause()
  })
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
  return response
}
