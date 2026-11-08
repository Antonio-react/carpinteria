/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** "noindex, nofollow" en pruebas; "index, follow" con el dominio definitivo. */
  readonly VITE_ROBOTS: string
  /** Dominio de la web, sin https:// (para la URL canónica y Open Graph). */
  readonly VITE_SITE_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
