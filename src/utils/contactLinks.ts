interface AddressParts {
  calle: string
  poligono: string
  codigoPostal: string
  localidad: string
  provincia: string
}

/** Enlace para llamar ("675 81 66 09" → "tel:+34675816609"). En móvil abre la app de teléfono. */
export function telHref(phone: string) {
  return `tel:+34${phone.replace(/\D/g, '')}`
}

/**
 * Enlace a Google Maps con la dirección del taller. En móvil abre la app de mapas
 * (si está instalada); en escritorio, Google Maps en el navegador.
 */
export function mapsHref({ calle, poligono, codigoPostal, localidad, provincia }: AddressParts) {
  const query = `${calle}, ${poligono}, ${codigoPostal} ${localidad}, ${provincia}`
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}
