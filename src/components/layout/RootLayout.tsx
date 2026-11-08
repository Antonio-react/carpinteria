import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ScrollManager } from '@/components/layout/ScrollManager'
import { ScrollTape } from '@/components/layout/ScrollTape'
import { SawSpinner } from '@/components/ui/SawSpinner'
import { TitleBlock } from '@/components/ui/TitleBlock'
import { siteConfig } from '@/config/site'
import { sheetFor } from '@/data/sheets'

const SIGNATURE = `${siteConfig.nombre} · Taller de ${siteConfig.direccion.localidad}`

/**
 * Estructura común de todas las páginas: navegación, cinta métrica (progreso), contenido y pie.
 * Cada página (salvo Inicio) lleva arriba a la derecha su cajetín de plano: "Hoja 02 · Trabajos".
 */
export function RootLayout() {
  const { pathname } = useLocation()
  const sheet = sheetFor(pathname)

  return (
    <>
      <a
        href="#contenido"
        className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm text-paper transition-transform focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <ScrollManager />
      <ScrollTape />
      <Navbar />
      <main id="contenido" className="relative">
        {sheet && (
          <TitleBlock
            number={sheet.number}
            title={sheet.title}
            signature={SIGNATURE}
            tone={sheet.tone}
            className="absolute top-[4.75rem] right-4 z-10 max-w-[calc(100%-2rem)] sm:right-6 lg:top-[5.5rem] lg:right-10"
          />
        )}
        <Suspense
          fallback={
            <div className="grid min-h-svh place-items-center text-oak">
              <SawSpinner size={64} label="Cargando página" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
