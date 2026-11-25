import { CATEGORIES, type GalleryPhoto } from '@/data/categories'

/**
 * Descarga anticipada en segundo plano, para que todo vaya fluido haga lo que haga el visitante.
 * Se lanza una sola vez (ver useSitePrefetch), siempre en el tiempo libre del navegador, de una en una
 * y con prioridad baja, así que nunca frena lo que se está viendo. Orden:
 *   1. El código de todas las páginas: cambiar de página es inmediato.
 *   2. Las portadas de las carpetas: lo que se ve arriba en Trabajos.
 *   3. Las fotos de cada carpeta, en el orden de la web (alfabético, "Otros trabajos" al final).
 * Solo el tamaño que va a usar esta pantalla (480 o 960). Con ahorro de datos o conexión muy lenta, nada.
 */

/** Las mismas importaciones que las páginas y secciones diferidas (lazyPages.ts, ContactSection). */
const PAGE_CHUNKS: ReadonlyArray<() => Promise<unknown>> = [
  () => import('@/pages/WorksPage'),
  () => import('@/pages/CategoryPage'),
  () => import('@/pages/ProcessPage'),
  () => import('@/pages/ContactPage'),
  () => import('@/components/contact/ContactForm'),
  () => import('@/pages/LegalNoticePage'),
  () => import('@/pages/PrivacyPage'),
  () => import('@/pages/CookiesPage'),
]

/** navigator.connection no está en los tipos estándar (solo lo tienen Chrome y Android). */
interface NetworkInformationLike {
  saveData?: boolean
  effectiveType?: string
}
type NavigatorWithConnection = Navigator & { connection?: NetworkInformationLike }

let started = false

function canPrefetch(): boolean {
  const connection = (navigator as NavigatorWithConnection).connection
  if (!connection) return true
  return !connection.saveData && connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g'
}

/** Espera a un momento en que el navegador no esté ocupado. */
function idle(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => resolve(), { timeout: 3000 })
    else window.setTimeout(resolve, 200)
  })
}

const done = new Set<string>()

function loadImage(src: string): Promise<void> {
  if (done.has(src)) return Promise.resolve()
  done.add(src)
  return new Promise((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.fetchPriority = 'low'
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = src
  })
}

/**
 * El tamaño que elegiría el navegador con el `sizes` de cada sitio: `share` es la parte del ancho de la
 * pantalla que ocupa la foto (en pantallas grandes / pequeñas).
 */
function pick(photo: GalleryPhoto, share: { large: number; small: number }): string {
  const fraction = window.innerWidth >= 1024 ? share.large : share.small
  const needed = window.innerWidth * fraction * window.devicePixelRatio
  return photo.srcSmall && needed <= 480 ? photo.srcSmall : photo.src
}

/** Carrusel (FolderCard): sizes="(min-width: 1024px) 26vw, 60vw". */
const COVER_SHARE = { large: 0.26, small: 0.6 }
/** Mosaico de la galería y tarjetas de "Todos los trabajos": sizes="(min-width: 1024px) 33vw, 50vw". */
const TILE_SHARE = { large: 0.33, small: 0.5 }

async function run() {
  for (const load of PAGE_CHUNKS) {
    await idle()
    await load().catch(() => undefined)
  }
  for (const category of CATEGORIES) {
    if (!category.cover) continue
    await idle()
    await loadImage(pick(category.cover, COVER_SHARE))
  }
  for (const category of CATEGORIES) {
    for (const photo of category.photos) {
      await idle()
      await loadImage(pick(photo, TILE_SHARE))
    }
  }
}

/** Empieza la descarga anticipada (solo la primera vez que se llama). */
export function startSitePrefetch() {
  if (started || !canPrefetch()) return
  started = true
  void run()
}
