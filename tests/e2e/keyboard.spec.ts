import type { Page } from '@playwright/test'
import { expect, openFully, test } from './support/fixtures'
import { ALL_ROUTES } from './support/routes'

/**
 * Uso con teclado: "Saltar al contenido" y foco visible en TODO lo que se puede enfocar.
 * Se recorre cada página con Tab de principio a fin y, en cada parada, se comprueba que:
 * - se ve un indicador de foco (contorno o sombra), WCAG 2.4.7;
 * - el elemento está a la vista y no queda tapado por la barra fija u otra capa, WCAG 2.4.11;
 * - no es un elemento invisible (foco "perdido" en algo que no se ve).
 */
interface FocusStop {
  description: string
  hasIndicator: boolean
  visible: boolean
  obscuredBy: string | null
}

async function inspectFocus(page: Page): Promise<FocusStop | null> {
  return page.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body || !(el instanceof HTMLElement)) return null
    const text = (el.getAttribute('aria-label') ?? el.innerText ?? '').trim().replace(/\s+/g, ' ').slice(0, 50)
    const description = `<${el.tagName.toLowerCase()}${el.id ? ` id="${el.id}"` : ''}> "${text}"`

    // Indicador: contorno, sombra (anillos de Tailwind) en el elemento o en su etiqueta/tarjeta
    // (los radios y casillas ocultos muestran el foco en la tarjeta que los envuelve).
    const ring = (node: Element | null) => {
      if (!node) return false
      const style = getComputedStyle(node)
      const outline = style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0
      return outline || style.boxShadow !== 'none'
    }
    const hasIndicator = ring(el) || ring(el.closest('label')) || ring(el.parentElement)

    const rect = el.getBoundingClientRect()
    const target = el.closest('label') ?? el
    const box = target.getBoundingClientRect()
    const visible = rect.width > 0 && rect.height > 0 && box.bottom > 0 && box.top < window.innerHeight

    // ¿Qué hay encima del centro del elemento? Si es otra cosa (la barra fija, una capa), está tapado.
    let obscuredBy: string | null = null
    if (visible) {
      const x = Math.min(Math.max(box.left + box.width / 2, 0), window.innerWidth - 1)
      const y = Math.min(Math.max(box.top + box.height / 2, 0), window.innerHeight - 1)
      const top = document.elementFromPoint(x, y)
      if (top && top !== el && !el.contains(top) && !top.contains(el) && !target.contains(top)) {
        obscuredBy = `<${top.tagName.toLowerCase()} class="${String(top.className).slice(0, 80)}">`
      }
    }
    return { description, hasIndicator, visible, obscuredBy }
  })
}

test('«Saltar al contenido» es lo primero al pulsar Tab y lleva al contenido', async ({ page }) => {
  await page.goto('/trabajos', { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  const skip = page.getByRole('link', { name: 'Saltar al contenido' })
  await expect(skip).toBeFocused()
  // Con foco tiene que VERSE (antes está escondido fuera de la pantalla).
  await page.waitForTimeout(250)
  const box = await skip.boundingBox()
  expect(box, 'El enlace no tiene tamaño').not.toBeNull()
  expect(box?.y ?? -1, 'Con foco, el enlace sigue fuera de la pantalla').toBeGreaterThanOrEqual(0)

  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  const insideMain = await page.evaluate(() => !!document.activeElement?.closest('main'))
  expect(insideMain, 'Tras saltar, el siguiente Tab debería caer dentro del contenido (<main>), no en el menú').toBe(true)
})

for (const route of ALL_ROUTES) {
  test(`foco visible en todo lo enfocable · ${route.name} (${route.path})`, async ({ page }) => {
    await openFully(page, route.path)
    const problems: string[] = []
    let first: string | null = null

    for (let i = 0; i < 160; i++) {
      await page.keyboard.press('Tab')
      // La barra se esconde/aparece con una transición: se deja terminar antes de mirar.
      await page.waitForTimeout(60)
      const stop = await inspectFocus(page)
      if (!stop) continue
      // Vuelta completa: el foco ha vuelto al primer elemento.
      if (stop.description === first) break
      first ??= stop.description
      if (!stop.visible) problems.push(`${stop.description}: recibe el foco pero no se ve (sin tamaño o fuera de la pantalla)`)
      else if (!stop.hasIndicator) problems.push(`${stop.description}: al enfocarlo no se ve ningún contorno de foco`)
      else if (stop.obscuredBy) problems.push(`${stop.description}: queda tapado por ${stop.obscuredBy}`)
    }
    expect(problems, `Problemas de foco en ${route.path}:\n  · ${problems.join('\n  · ')}`).toEqual([])
  })
}

test('menú móvil: el foco entra al abrir, Escape cierra y el foco vuelve al botón', async ({ page }) => {
  await page.goto('/trabajos', { waitUntil: 'networkidle' })
  const toggle = page.getByRole('button', { name: 'Abrir menú' })
  test.skip(!(await toggle.isVisible()), 'En escritorio no hay menú móvil')

  await toggle.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Menú' })
  await expect(dialog).toBeVisible()
  expect(await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')), 'Al abrir, el foco debería ir al primer enlace del menú').toBe(true)

  // Con el menú abierto (aria-modal), Tab no debe escaparse a la página que hay detrás.
  const escaped: string[] = []
  for (let i = 0; i < 15; i++) {
    await page.keyboard.press('Tab')
    const where = await page.evaluate(() => {
      const el = document.activeElement
      if (!el || el.closest('[role="dialog"]') || el.closest('header')) return null
      return `<${el.tagName.toLowerCase()}> "${(el.textContent ?? '').trim().slice(0, 40)}"`
    })
    if (where) escaped.push(where)
  }
  expect(escaped, `Con el menú abierto, el Tab se va a la página de detrás:\n  · ${[...new Set(escaped)].join('\n  · ')}`).toEqual([])

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('button', { name: 'Abrir menú' }), 'Al cerrar el menú, el foco debería volver al botón que lo abrió').toBeFocused()
})
