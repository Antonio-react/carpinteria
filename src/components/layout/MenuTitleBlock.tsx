import type { ReactNode } from 'react'
import { siteConfig } from '@/config/site'
import { EmailText } from '@/components/ui/EmailText'
import { PhoneLinks } from '@/components/ui/PhoneLinks'

/**
 * Rótulo a máquina en "lápiz rojo" para fondo oscuro: el --color-pencil de la web (#b83d26) no llega
 * al contraste mínimo sobre el negro del menú en letra pequeña; este tono, más claro, sí (≈6:1).
 */
const LABEL = 'border-white/15 py-2.5 pr-3 font-type text-xs text-[#e07055]'
const VALUE = 'border-white/15 pl-3 text-[13px] text-name/85'

/**
 * Cajetín del menú móvil: correo, teléfonos y horario en una caja como la de un plano.
 * Solo en pantallas altas (lo decide MobileMenu): en móviles bajos no cabe sin hacer scroll.
 */
export function MenuTitleBlock({ className = '' }: { className?: string }) {
  const { email, telefonos, horario } = siteConfig
  const rows: { label: string; value: ReactNode; flush?: boolean }[] = [
    {
      label: 'escríbenos',
      value: (
        <a href={`mailto:${email}`} className="underline decoration-white/25 underline-offset-4 hover:decoration-white/60">
          <EmailText email={email} />
        </a>
      ),
    },
    {
      label: 'llámanos',
      // Sin relleno vertical: cada teléfono ya es una zona táctil de 44 px (si no, la fila quedaría el doble de alta).
      flush: true,
      value: (
        <PhoneLinks
          phones={[telefonos.principal, telefonos.secundario]}
          linkClassName="underline decoration-white/25 underline-offset-4 hover:decoration-white/60"
        />
      ),
    },
    {
      label: 'horario',
      // Cada tramo de horas en una pieza: que no se parta en "15:30 -" / "18:30".
      value: (
        <>
          {horario.dias}, <span className="whitespace-nowrap">{horario.manana}</span> y <span className="whitespace-nowrap">{horario.tarde}</span>
        </>
      ),
    },
  ]

  return (
    <dl className={`grid grid-cols-[auto_1fr] border border-white/15 px-3 ${className}`}>
      {rows.map((row, index) => (
        <div key={row.label} className="contents">
          <dt className={`${LABEL} border-r ${row.flush ? 'flex items-center' : ''} ${index > 0 ? 'border-t' : ''}`}>{row.label}</dt>
          <dd className={`${VALUE} ${row.flush ? '' : 'py-2.5'} ${index > 0 ? 'border-t' : ''}`}>{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}
