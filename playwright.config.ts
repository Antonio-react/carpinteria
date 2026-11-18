import { defineConfig, devices } from '@playwright/test'

/**
 * Tests de navegador (Playwright + axe) sobre la web COMPILADA (npm run build + vite preview),
 * que es lo más parecido a lo que se publica en Netlify.
 *
 *   npm run test:e2e            → todo
 *   npm run test:e2e -- --project=movil-320   → solo un tamaño de pantalla
 *   npm run test:e2e:report     → abre el informe HTML con capturas de los fallos
 *
 * Dos grupos de proyectos:
 * - Tamaños de pantalla (de móvil pequeño a monitor 2560): accesibilidad con axe, desbordes
 *   horizontales y foco visible. Lo que depende del ancho se comprueba en todos.
 * - "general" (un solo navegador de escritorio): rutas al refrescar, empezar arriba, metadatos y
 *   seguridad. No depende del ancho: repetirlo 8 veces solo alargaría la espera.
 */
// Puerto propio (no el 4173 por defecto de Vite): si otra web tuya está abierta en 4173, los tests
// se ejecutarían contra ELLA sin avisar. Ya pasó una vez con otra web en marcha.
const PORT = 4291
const VIEWPORT_TESTS = /(a11y|responsive|keyboard)\.spec\.ts/

const mobile = { isMobile: true, hasTouch: true }

const VIEWPORTS = [
  // Móviles pequeños (iPhone SE 1.ª gen., Android básicos): el caso más difícil.
  { name: 'movil-320', use: { ...devices['Desktop Chrome'], ...mobile, viewport: { width: 320, height: 568 }, deviceScaleFactor: 2 } },
  { name: 'movil-375', use: { ...devices['Desktop Chrome'], ...mobile, viewport: { width: 375, height: 667 }, deviceScaleFactor: 2 } },
  { name: 'movil-414', use: { ...devices['Desktop Chrome'], ...mobile, viewport: { width: 414, height: 896 }, deviceScaleFactor: 3 } },
  // Móvil apaisado: poca altura, el menú cambia de diseño (variante phone-land).
  { name: 'movil-apaisado', use: { ...devices['Desktop Chrome'], ...mobile, viewport: { width: 844, height: 390 }, deviceScaleFactor: 3 } },
  { name: 'tablet-768', use: { ...devices['Desktop Chrome'], ...mobile, viewport: { width: 768, height: 1024 }, deviceScaleFactor: 2 } },
  { name: 'tablet-1024', use: { ...devices['Desktop Chrome'], ...mobile, viewport: { width: 1024, height: 768 }, deviceScaleFactor: 2 } },
  { name: 'portatil-1280', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } } },
  { name: 'escritorio-1920', use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } } },
  { name: 'monitor-2560', use: { ...devices['Desktop Chrome'], viewport: { width: 2560, height: 1440 } } },
] as const

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // El ordenador de desarrollo tiene 8 GB de RAM: más de 2 navegadores a la vez lo atascan.
  workers: process.env.CI ? undefined : 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'tests/e2e-report' }]],
  outputDir: 'tests/e2e-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'es-ES',
    // Movimiento reducido: los tests miran la página quieta (sin medias animaciones que den
    // falsos fallos de contraste o posiciones). El hero con movimiento se revisa a mano.
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    // Sin grabación (trace.zip, ~2 MB por fallo): con 8 tamaños de pantalla, un fallo repetido llenó
    // tests/e2e-results con 300 MB. En local no hay reintentos, así que solo se graba en CI. Para
    // depurar un fallo concreto: npm run test:e2e -- --trace on
    trace: 'on-first-retry',
  },
  projects: [
    ...VIEWPORTS.map((project) => ({ ...project, testMatch: VIEWPORT_TESTS })),
    { name: 'general', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } }, testIgnore: VIEWPORT_TESTS },
  ],
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    // Siempre compila y arranca ESTA web (más lento, pero nunca prueba una versión vieja u otra web).
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
