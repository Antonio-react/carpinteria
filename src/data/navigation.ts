export interface NavLink {
  label: string
  to: string
}

/** Páginas principales (cada una con su ruta propia). */
export const NAV_LINKS: readonly NavLink[] = [
  { label: 'Inicio', to: '/' },
  { label: 'Trabajos', to: '/trabajos' },
  { label: 'Cómo trabajamos', to: '/como-trabajamos' },
  { label: 'Contacto', to: '/contacto' },
]

export const LEGAL_LINKS: readonly NavLink[] = [
  { label: 'Aviso legal', to: '/aviso-legal' },
  { label: 'Privacidad', to: '/privacidad' },
  { label: 'Cookies', to: '/cookies' },
]

export const CONTACT_PATH = '/contacto'

/** id del formulario en la página de Contacto (ancla de los botones "Pedir presupuesto"). */
export const CONTACT_FORM_ID = 'formulario-contacto'

/**
 * Botones "Pedir presupuesto": van directos al formulario. En móvil la página se abre en el
 * cuadro del formulario; en escritorio, arriba (el formulario ya se ve junto al título).
 */
export const QUOTE_PATH = `${CONTACT_PATH}#${CONTACT_FORM_ID}`
