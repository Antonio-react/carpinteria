import { siteConfig } from '@/config/site'
import { PhoneLinks } from '@/components/ui/PhoneLinks'
import { formatLocality } from '@/utils/address'
import { mapsHref } from '@/utils/contactLinks'

/**
 * Datos de contacto junto al formulario. El email va destacado; los teléfonos, discretos
 * (la empresa prefiere el formulario y el correo, y no se promociona WhatsApp).
 */
export function ContactDetails() {
  const { email, telefonos, direccion, horario } = siteConfig
  return (
    <dl className="grid gap-8 text-sm">
      <div>
        <dt className="text-xs tracking-[0.2em] text-muted uppercase">Correo</dt>
        <dd className="mt-2">
          <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center text-base font-medium break-all underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
            {email}
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-xs tracking-[0.2em] text-muted uppercase">Horario</dt>
        <dd className="mt-2 leading-relaxed">
          {horario.dias}
          <br />
          {horario.manana} y {horario.tarde}
        </dd>
      </div>
      <div>
        <dt className="text-xs tracking-[0.2em] text-muted uppercase">Taller</dt>
        <dd className="mt-2 leading-relaxed">
          <a
            href={mapsHref(direccion)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ver el taller en Google Maps: ${direccion.calle}, ${formatLocality(direccion)} (se abre en una pestaña nueva)`}
            className="inline-block underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            {direccion.calle}
            <br />
            {direccion.poligono}
            <br />
            {formatLocality(direccion)}
            <span aria-hidden="true" className="ml-1.5 inline-block text-muted no-underline">↗</span>
          </a>
        </dd>
      </div>
      <div>
        <dt className="text-xs tracking-[0.2em] text-muted uppercase">Teléfono</dt>
        <dd className="mt-1 leading-relaxed text-muted">
          <PhoneLinks
            phones={[telefonos.principal, telefonos.secundario]}
            linkClassName="underline decoration-ink/20 underline-offset-4 hover:text-ink hover:decoration-ink"
          />
        </dd>
      </div>
    </dl>
  )
}
