import { expect, openFully, test } from './support/fixtures'
import { ALL_ROUTES } from './support/routes'

/**
 * Diseño adaptable: en ningún tamaño (de 320 px a 2560 px) la página se puede mover de lado ni
 * hay piezas que se salgan de la pantalla. Se recorre la página entera (también lo que se carga
 * al bajar) y se buscan los elementos que asoman por la derecha o la izquierda.
 */
interface Overflow {
  selector: string
  left: number
  right: number
}

for (const route of ALL_ROUTES) {
  test(`sin desborde horizontal · ${route.name} (${route.path})`, async ({ page }) => {
    await openFully(page, route.path)

    const result = await page.evaluate(() => {
      const width = document.documentElement.clientWidth
      const describe = (el: Element) => {
        const id = el.id ? `#${el.id}` : ''
        const classes = typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).slice(0, 4).join('.')}` : ''
        return `${el.tagName.toLowerCase()}${id}${classes === '.' ? '' : classes}`
      }
      // Un ancestro (que no sea html ni body) que recorta lo que se sale: lo de dentro no desborda la página.
      const clippedByAncestor = (el: Element) => {
        for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
          const style = getComputedStyle(node)
          if (['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX) || style.contain.includes('paint')) return true
        }
        return false
      }
      const offenders: Overflow[] = []
      const seen = new Set<Element>()
      for (const el of document.body.querySelectorAll('*')) {
        const rect = el.getBoundingClientRect()
        if (rect.width <= 1 || rect.height <= 1) continue // sr-only y similares
        if (rect.right <= width + 1 && rect.left >= -1) continue
        if (clippedByAncestor(el)) continue
        // Solo el elemento "padre" que desborda, no todos sus hijos.
        let parent = el.parentElement
        let childOfOffender = false
        while (parent) {
          if (seen.has(parent)) childOfOffender = true
          parent = parent.parentElement
        }
        seen.add(el)
        if (!childOfOffender) offenders.push({ selector: describe(el), left: Math.round(rect.left), right: Math.round(rect.right) })
      }
      return { width, scrollWidth: document.documentElement.scrollWidth, offenders: offenders.slice(0, 10) }
    })

    const details = result.offenders.map((item) => `  · ${item.selector} (de ${item.left} a ${item.right} px)`).join('\n')
    expect(result.scrollWidth, `La página se mueve de lado: mide ${result.scrollWidth} px en una pantalla de ${result.width} px.\n${details}`).toBeLessThanOrEqual(result.width)
    expect(result.offenders, `Elementos que se salen de la pantalla (${result.width} px):\n${details}`).toEqual([])
  })
}

test('el zoom no está bloqueado (se puede ampliar con los dedos)', async ({ page }) => {
  await page.goto('/')
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
  expect(viewport).not.toMatch(/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/)
})
