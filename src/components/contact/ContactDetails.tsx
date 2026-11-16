import type { ReactNode } from 'react'
import { siteConfig } from '@/config/site'
import { BrandMark } from '@/components/ui/BrandMark'
import { EmailText } from '@/components/ui/EmailText'
import { PhoneLinks } from '@/components/ui/PhoneLinks'
import { formatLocality } from '@/utils/address'
import { mapsHref } from '@/utils/contactLinks'

const LINE = 'border-ink/20'
/** Rótulo a máquina en rojo lápiz (como el cajetín del menú móvil y la ficha del taller). */
const LABEL = `${LINE} border-r py-3.5 pr-4 font-type text-xs text-pencil`
const VALUE = `${LINE} min-w-0 pl-4 text-[15px] leading-relaxed text-ink wrap-anywhere`
const LINK = 'underline decoration-ink/30 underline-offset-4 hover:decoration-ink'

/**
 * Datos de contacto en un cajetín de plano: rótulo a la izquierda y dato a la derecha, el mismo formato
 * que el menú móvil. Abajo a la derecha, el logo como sello de la empresa (tinta suave, girado y pisando
 * el borde, como estampado a mano). Cada teléfono es una zona táctil de 44 px.
 */
export function ContactDetails() {
  const { email, telefonos, direccion, horario } = siteConfig
  const rows: { label: string; value: ReactNode; flush?: boolean }[] = [
    {
      label: 'escríbenos',
      flush: true,
      value: (
        <a href={`mailto:${email}`} className={`inline-flex min-h-11 items-center font-medium ${LINK}`}>
          <span>
            <EmailText email={email} />
          </span>
        </a>
      ),
    },
    {
      label: 'llámanos',
      flush: true,
      value: <PhoneLinks phones={[telefonos.principal, telefonos.secundario]} linkClassName={LINK} />,
    },
    {
      label: 'horario',
      value: (
        <>
          {horario.dias}, <span className="whitespace-nowrap">{horario.manana}</span> y{' '}
          <span className="whitespace-nowrap">{horario.tarde}</span>
        </>
      ),
    },
    {
      label: 'taller',
      value: (
        <>
          <a
            href={mapsHref(direccion)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block ${LINK}`}
          >
            {direccion.calle}, {direccion.poligono}
            <br />
            {formatLocality(direccion)}
            {/* El nombre del enlace es la dirección que se ve + este añadido (WCAG 2.5.3: quien usa control
                por voz dice lo que ve, "Calle Mecánicos...", y tiene que coincidir con el nombre). */}
            <span className="sr-only"> (ver en Google Maps, se abre en una pestaña nueva)</span>
            <span aria-hidden="true" className="ml-1.5 inline-block text-ink/60 no-underline">
              ↗
            </span>
          </a>
        </>
      ),
    },
  ]
  const last = rows.length - 1

  return (
    <dl className={`relative grid grid-cols-[auto_minmax(0,1fr)] border ${LINE} bg-paper/45 px-4`}>
      {rows.map((row, index) => (
        <div key={row.label} className="contents">
          <dt className={`${LABEL} ${row.flush ? 'flex items-center' : ''} ${index > 0 ? 'border-t' : ''}`}>{row.label}</dt>
          {/* La última fila deja sitio abajo para el sello (que no tape la dirección). */}
          <dd className={`${VALUE} ${row.flush ? 'py-1' : 'pt-3.5'} ${row.flush ? '' : index === last ? 'pb-12' : 'pb-3.5'} ${index > 0 ? 'border-t' : ''}`}>
            {row.value}
          </dd>
        </div>
      ))}
      {/* Sello de la empresa abajo a la derecha, no justo en la esquina: algo hacia dentro, girado y
          pisando un poco el borde, como estampado deprisa a mano. Tinta suave (multiply). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-6 -bottom-9 grid size-20 md:-bottom-6 rotate-[-14deg] place-items-center rounded-full border-2 border-ink/25 text-ink/35 mix-blend-multiply"
      >
        <BrandMark size={66} />
      </span>
    </dl>
  )
}
