import type { ReactNode } from 'react'
import { PageMeta } from '@/components/layout/PageMeta'
import { Container } from '@/components/ui/Container'

interface LegalPageProps {
  title: string
  description: string
  updated: string
  children: ReactNode
}

/** Estructura común de las páginas legales: título, fecha de actualización y texto legible. */
export function LegalPage({ title, description, updated, children }: LegalPageProps) {
  return (
    <>
      <PageMeta title={`${title} · Carpintería y Decoración`} description={description} />
      <article className="pt-32 pb-24 lg:pt-40">
        <Container className="max-w-3xl">
          <h1 className="text-4xl font-medium tracking-[-0.03em] [font-stretch:110%] sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-muted">Última actualización: {updated}</p>
          <div className="mt-12 space-y-10 leading-relaxed text-ink/85">{children}</div>
        </Container>
      </article>
    </>
  )
}
