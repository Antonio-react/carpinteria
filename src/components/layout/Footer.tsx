import { Link } from 'react-router'
import woodLarge from '@/assets/textures/footer-wood-1600.webp'
import woodSmall from '@/assets/textures/footer-wood-1000.webp'
import { BrandBadge } from '@/components/ui/BrandBadge'
import { Container } from '@/components/ui/Container'
import { siteConfig } from '@/config/site'
import { LEGAL_LINKS, NAV_LINKS } from '@/data/navigation'
import { useSamePageScrollTop } from '@/hooks/useSamePageScrollTop'
import { PhoneLinks } from '@/components/ui/PhoneLinks'
import { formatLocality } from '@/utils/address'
import { mapsHref } from '@/utils/contactLinks'

/**
 * Pie de página: marca, contacto, horario y enlaces legales.
 * En móvil, los enlaces van en dos columnas (páginas | legales) y con menos aire, para que el pie
 * no ocupe más de una pantalla. Desde md, el diseño de siempre (una columna de enlaces).
 * Fondo: foto de una tabla de madera, oscurecida para que el texto se lea (decorativa, carga diferida).
 * PROVISIONAL: textura de prueba; se sustituirá por una foto real del taller (scripts/images/footer-wood.mjs).
 */
export function Footer() {
  const { email, telefonos, direccion, horario } = siteConfig
  const year = new Date().getFullYear()
  const scrollTopIfSame = useSamePageScrollTop()

  return (
    <footer className="relative z-10 isolate overflow-hidden bg-night text-name">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <img
          src={woodLarge}
          srcSet={`${woodSmall} 1000w, ${woodLarge} 1600w`}
          sizes="100vw"
          alt=""
          width={1600}
          height={1067}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
        {/* Velo oscuro: más denso arriba (enlaza con la franja oscura de encima) y detrás del texto. */}
        <div className="absolute inset-0 bg-linear-to-b from-night via-night/70 to-night/60" />
      </div>
      <Container className="grid gap-10 py-12 md:grid-cols-12 md:gap-12 md:py-16 lg:py-20">
        <div className="md:col-span-5">
          <Link
            to="/"
            aria-label="Carpintería y Decoración, ir a inicio"
            onClick={() => scrollTopIfSame('/')}
            className="inline-flex items-center gap-4"
          >
            <BrandBadge size={60} />
            <span className="text-lg leading-tight font-medium [font-stretch:110%]">
              Carpintería
              <br />
              <span className="font-serif text-xl font-normal italic">y</span> Decoración
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-name/65">
            Ebanistería familiar con más de 40 años de oficio. Medimos, diseñamos y montamos en toda España.
          </p>
        </div>

        <div className="text-sm md:col-span-4">
          <h2 className="text-xs tracking-[0.2em] text-name/55 uppercase">Contacto</h2>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center break-all underline decoration-name/30 underline-offset-4 hover:decoration-name">
                {email}
              </a>
            </li>
            <li className="text-name/75">
              <PhoneLinks
                phones={[telefonos.principal, telefonos.secundario]}
                linkClassName="underline decoration-name/20 underline-offset-4 hover:text-name hover:decoration-name"
              />
            </li>
            <li className="text-name/75">
              <a
                href={mapsHref(direccion)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ver el taller en Google Maps: ${direccion.calle}, ${formatLocality(direccion)} (se abre en una pestaña nueva)`}
                className="inline-block py-1 underline decoration-name/20 underline-offset-4 hover:text-name hover:decoration-name"
              >
                {direccion.calle}, {direccion.poligono}
                <br />
                {formatLocality(direccion)}
                <span aria-hidden="true" className="ml-1.5 inline-block no-underline">↗</span>
              </a>
            </li>
            <li className="text-name/75">
              {horario.dias}: {horario.manana} y {horario.tarde}
            </li>
          </ul>
        </div>

        <nav aria-label="Pie de página" className="text-sm md:col-span-3">
          <h2 className="text-xs tracking-[0.2em] text-name/55 uppercase">Web</h2>
          <div className="mt-4 grid grid-cols-2 gap-x-6 md:grid-cols-1 md:gap-y-1">
            {[NAV_LINKS, LEGAL_LINKS].map((group) => (
              <ul key={group[0]?.to} className="space-y-1">
                {group.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="inline-flex min-h-11 items-center text-name/75 transition-colors hover:text-name">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </nav>
      </Container>
      <Container className="border-t border-white/10 py-6 text-center text-xs text-name/50">
        © {year} Carpintería y Decoración. Todos los derechos reservados.
      </Container>
    </footer>
  )
}
