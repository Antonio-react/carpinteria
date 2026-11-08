/** Nombres de los campos: deben coincidir con el formulario oculto de index.html (Netlify). */
export type ContactField = 'nombre' | 'email' | 'telefono' | 'ubicacion' | 'tipo' | 'mensaje' | 'adjunto-1' | 'adjunto-2' | 'privacidad'

export type ContactErrors = Partial<Record<ContactField, string>>

/** Límite de Netlify Forms: la petición entera (con adjuntos) no puede pasar de 8 MB. */
export const MAX_UPLOAD_MB = 8
const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024
/** Margen para el resto de campos del formulario. */
const FORM_OVERHEAD_BYTES = 64 * 1024

export const ACCEPTED_FILES = 'image/*,.pdf,.dwg,.dxf'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_PATTERN = /^\+?[\d\s().-]{9,}$/

const text = (data: FormData, field: ContactField) => {
  const value = data.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

const file = (data: FormData, field: ContactField) => {
  const value = data.get(field)
  return value instanceof File && value.size > 0 ? value : null
}

/** Valida el formulario completo. Devuelve un objeto vacío si todo está bien. */
export function validateContact(data: FormData): ContactErrors {
  const errors: ContactErrors = {}

  if (text(data, 'nombre').length < 2) errors.nombre = 'Escribe tu nombre.'

  const email = text(data, 'email')
  if (!email) errors.email = 'Escribe tu correo para poder responderte.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Revisa el correo: parece que falta algo (ejemplo: nombre@correo.com).'

  const phone = text(data, 'telefono')
  if (phone && !PHONE_PATTERN.test(phone)) errors.telefono = 'Revisa el teléfono (mínimo 9 cifras).'

  if (!text(data, 'tipo')) errors.tipo = 'Elige una opción para seguir (si no lo tienes claro, «Otro»).'

  if (text(data, 'ubicacion').length < 2) errors.ubicacion = 'Indica la localidad o zona donde sería el trabajo.'

  if (text(data, 'mensaje').length < 10) errors.mensaje = 'Cuéntanos un poco más sobre tu idea (al menos 10 caracteres).'

  const files = [file(data, 'adjunto-1'), file(data, 'adjunto-2')]
  const total = files.reduce((sum, item) => sum + (item?.size ?? 0), 0)
  if (total + FORM_OVERHEAD_BYTES > MAX_UPLOAD_BYTES) {
    errors['adjunto-1'] = `Los archivos ocupan demasiado: entre los dos, como máximo ${MAX_UPLOAD_MB} MB.`
  }

  if (data.get('privacidad') !== 'on') errors.privacidad = 'Necesitamos tu permiso para usar tus datos y responderte.'

  return errors
}

/** Se queda solo con los errores de los campos indicados (los de un paso). */
export function pickErrors(errors: ContactErrors, fields: readonly ContactField[]): ContactErrors {
  const picked: ContactErrors = {}
  for (const field of fields) {
    const message = errors[field]
    if (message) picked[field] = message
  }
  return picked
}
