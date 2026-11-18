import type { HtmlTagDescriptor, IndexHtmlTransformContext, Plugin } from 'vite'

/**
 * Precarga desde el HTML las fuentes de la primera pantalla, para que el navegador las pida a la vez
 * que el JavaScript y no después.
 *
 * Por qué: la web la pinta React. Sin esto, el navegador descarga el HTML → el CSS → ejecuta React →
 * y SOLO ENTONCES descubre que el texto usa estas fuentes (medido: se pedían a los ~3,8 s en un móvil
 * lento). Mientras llegan, el texto sale con la fuente de reserva y luego "salta" a la buena.
 *
 * Las fotos del hero NO se precargan: se probó (2026-11-18) y el LCP no mejoraba, porque lo que lo
 * retrasa es el arranque de React, no la descarga de la foto. Además se bajarían en todas las páginas.
 *
 * Los nombres llevan un hash que pone Vite al compilar (archivo-latin-wdth-normal-DY7AcnAa.woff2), así
 * que no se pueden escribir a mano en index.html: este plugin los busca en el resultado de la
 * compilación. Solo actúa en `vite build`.
 */

/** Solo el subconjunto "latin" (el texto es español); latin-ext y vietnamese se bajan solo si hacen falta. */
const FONTS = [
  /^assets\/archivo-latin-wdth-normal-[\w-]+\.woff2$/, // nombre gigante del hero, menú, textos
  /^assets\/instrument-serif-latin-400-italic-[\w-]+\.woff2$/, // la "y" y el lema
  /^assets\/courier-prime-latin-400-normal-[\w-]+\.woff2$/, // rótulos a máquina
]

type OutputBundle = NonNullable<IndexHtmlTransformContext['bundle']>

function findAsset(bundle: OutputBundle, pattern: RegExp): string {
  const fileName = Object.keys(bundle).find((name) => pattern.test(name))
  if (!fileName) throw new Error(`preloadCritical: no se encuentra ${pattern} en la compilación`)
  return `/${fileName}`
}

export function preloadCritical(): Plugin {
  return {
    name: 'carpinteria:preload-critical',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return []

        // crossorigin es obligatorio en las fuentes aunque sean del mismo dominio, o se descargan dos veces.
        return FONTS.map<HtmlTagDescriptor>((pattern) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: findAsset(bundle, pattern), crossorigin: '' },
          injectTo: 'head',
        }))
      },
    },
  }
}
