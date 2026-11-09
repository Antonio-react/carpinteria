import { siteConfig } from '@/config/site'
import { BrandMark } from '@/components/ui/BrandMark'
import { EmailText } from '@/components/ui/EmailText'
import { PhoneLinks } from '@/components/ui/PhoneLinks'
import { formatLocality } from '@/utils/address'
import { mapsHref } from '@/utils/contactLinks'

/** Rótulo a mano (serif cursiva en lápiz rojo), en vez de etiquetas en mayúsculas de plantilla. */
const LABEL = 'font-serif text-base text-pencil italic'

/**
 * Datos de contacto como la tarjeta del taller: papel de estraza pegado con cinta, algo torcido, con el
 * logo como sello de tinta y los datos escritos "a mano". El email va destacado; los teléfonos,
 * discretos (la empresa prefiere el formulario y el correo, y no se promociona WhatsApp).
 */
export function ContactDetails() {
  const { email, telefonos, direccion, horario } = siteConfig
  return (
    <div
      className="relative -rotate-1 bg-[#dcc6a0] bg-[radial-gradient(circle_at_20%_30%,rgb(255_250_235/0.35),transparent_45%),repeating-linear-gradient(115deg,rgb(120_85_45/0.05)_0_2px,transparent_2px_6px)] px-5 pt-10 pb-8 shadow-[0_22px_44px_-22px_rgb(28_25_22/0.55),0_2px_6px_rgb(28_25_22/0.1)] sm:px-9"
    >
      {/* Cinta de carrocero */}
      <span aria-hidden="true" className="absolute -top-3 left-10 h-7 w-24 -rotate-3 bg-[#efe3c4]/85 shadow-[0_1px_2px_rgb(28_25_22/0.12)]" />
      {/* Sello del taller, de fondo: a media altura y cortado por el borde derecho, muy suave. No aparta
          el texto (va detrás); el recorte lo hace este contenedor, así la cinta de arriba no se corta. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute top-1/2 -right-10 grid size-40 -translate-y-1/2 rotate-12 place-items-center rounded-full border-[3px] border-ink/10 text-ink/10 mix-blend-multiply">
          <BrandMark size={128} />
        </span>
      </span>

      <dl className="relative grid gap-6 text-ink">
        <div>
          <dt className={LABEL}>escríbenos</dt>
          <dd className="mt-1">
            <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center text-[15px] font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink sm:text-lg">
              <span>
                <EmailText email={email} />
              </span>
            </a>
          </dd>
        </div>
        <div>
          <dt className={LABEL}>cuándo estamos</dt>
          <dd className="mt-1 leading-relaxed">
            {horario.dias}, {horario.manana} y {horario.tarde}
          </dd>
        </div>
        <div>
          <dt className={LABEL}>el taller</dt>
          <dd className="mt-1 leading-relaxed">
            <a
              href={mapsHref(direccion)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver el taller en Google Maps: ${direccion.calle}, ${formatLocality(direccion)} (se abre en una pestaña nueva)`}
              className="inline-block underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              {direccion.calle}, {direccion.poligono}
              <br />
              {formatLocality(direccion)}
              <span aria-hidden="true" className="ml-1.5 inline-block text-ink/60 no-underline">↗</span>
            </a>
          </dd>
        </div>
        <div>
          <dt className={LABEL}>o llámanos</dt>
          <dd className="mt-1 text-sm leading-relaxed text-ink/75">
            <PhoneLinks
              phones={[telefonos.principal, telefonos.secundario]}
              linkClassName="underline decoration-ink/25 underline-offset-4 hover:text-ink hover:decoration-ink"
            />
          </dd>
        </div>
      </dl>
    </div>
  )
}
