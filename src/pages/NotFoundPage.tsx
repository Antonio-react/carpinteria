import { PageMeta } from '@/components/layout/PageMeta'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { SawSpinner } from '@/components/ui/SawSpinner'

/** Página 404 personalizada, con botón para volver al inicio. */
export default function NotFoundPage() {
  return (
    <>
      <PageMeta title="Página no encontrada · Carpintería y Decoración" description="La página que buscas no existe o ha cambiado de dirección." />
      <section aria-labelledby="error-titulo" className="grid min-h-svh place-items-center pt-24 pb-16">
        <Container className="text-center">
          <div className="text-oak">
            <SawSpinner size={72} label="Sierra girando" className="motion-safe:[&>span:first-child]:[animation-duration:3s]" />
          </div>
          <p className="mt-8 text-sm tracking-[0.2em] text-muted uppercase">Error 404</p>
          <h1 id="error-titulo" className="mt-4 text-5xl font-medium tracking-[-0.03em] text-balance [font-stretch:110%] sm:text-6xl">
            Aquí no hay nada que cortar.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg text-muted">La página que buscas no existe o ha cambiado de dirección.</p>
          <div className="mt-10">
            <Button to="/">
              Volver al inicio
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
