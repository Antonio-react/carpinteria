interface LocalityParts {
  codigoPostal: string
  localidad: string
  provincia: string
}

/** Línea de localidad con código postal y provincia: "45215 El Viso de San Juan (Toledo)". */
export function formatLocality({ codigoPostal, localidad, provincia }: LocalityParts) {
  return `${codigoPostal} ${localidad} (${provincia})`
}
