import { telHref } from '@/utils/contactLinks'

interface PhoneLinksProps {
  phones: readonly string[]
  /** Clases de cada enlace (color, subrayado...). */
  linkClassName?: string
}

/** Teléfonos separados por "·"; cada uno es un enlace tel: (en móvil abre la app de llamadas). */
export function PhoneLinks({ phones, linkClassName = '' }: PhoneLinksProps) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2">
      {phones.map((phone, index) => (
        <span key={phone} className="inline-flex items-center gap-x-2">
          {index > 0 && <span aria-hidden="true">·</span>}
          <a href={telHref(phone)} aria-label={`Llamar al ${phone}`} className={`inline-flex min-h-11 items-center ${linkClassName}`}>
            {phone}
          </a>
        </span>
      ))}
    </span>
  )
}
