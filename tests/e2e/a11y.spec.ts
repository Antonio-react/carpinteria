import AxeBuilder from '@axe-core/playwright'
import type { Page, TestInfo } from '@playwright/test'
import { expect, openFully, test } from './support/fixtures'
import { ALL_ROUTES } from './support/routes'

/**
 * Accesibilidad automática con axe-core en todas las páginas y todos los tamaños de pantalla.
 * Normas: WCAG 2.0, 2.1 y 2.2 niveles A y AA (lo que pide la ley europea de accesibilidad) más las
 * "buenas prácticas" de axe (zonas de la página, un solo h1...).
 * axe detecta en torno a la mitad de los problemas reales; el resto (orden lógico, textos
 * comprensibles) se revisa a mano. Los tests de teclado (keyboard.spec.ts) cubren parte de eso.
 */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']

async function audit(page: Page, testInfo: TestInfo, label: string) {
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()
  // Informe legible: regla, impacto, qué arreglar y en qué elemento (con su HTML).
  const report = results.violations.map((violation) => {
    const nodes = violation.nodes
      .slice(0, 6)
      .map((node) => `    · ${node.target.join(' ')}\n      ${node.html.slice(0, 180)}\n      ${node.failureSummary?.split('\n').join(' ') ?? ''}`)
      .join('\n')
    return `[${violation.impact}] ${violation.id}: ${violation.help}\n  ${violation.helpUrl}\n${nodes}`
  })
  await testInfo.attach(`axe-${label}.json`, { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' })
  expect(report, `Fallos de accesibilidad en ${label}:\n\n${report.join('\n\n')}`).toEqual([])
}

for (const route of ALL_ROUTES) {
  test(`axe · ${route.name} (${route.path})`, async ({ page }, testInfo) => {
    await openFully(page, route.path)
    await audit(page, testInfo, route.name)
  })
}

test('axe · menú móvil abierto', async ({ page }, testInfo) => {
  const toggle = page.getByRole('button', { name: 'Abrir menú' })
  await page.goto('/trabajos', { waitUntil: 'networkidle' })
  test.skip(!(await toggle.isVisible()), 'En escritorio no hay menú móvil')
  await toggle.click()
  await expect(page.getByRole('dialog', { name: 'Menú' })).toBeVisible()
  await page.waitForTimeout(400)
  await audit(page, testInfo, 'menú móvil')
})
