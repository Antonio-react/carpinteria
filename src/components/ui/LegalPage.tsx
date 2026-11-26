import type { ReactNode } from 'react'
import { PageMeta } from '@/components/layout/PageMeta'
import { Container } from '@/components/ui/Container'
import type { PageInfo } from '@/data/pages'

interface LegalPageProps {
  /** Título (h1 y pestaña) y descripción, de src/data/pages.ts. */
  page: PageInfo
  updated: string
  children: ReactNode
}

/** Estructura común de las páginas legales: título, fecha de actualización y texto legible. */
export function LegalPage({ page, updated, children }: LegalPageProps) {
  return (
    <>
      <PageMeta title={page.title} description={page.description} />
      <article className="pt-sheet pb-24">
        <Container className="max-w-3xl">
          <h1 className="text-4xl font-medium tracking-[-0.03em] font-stretch-110% sm:text-5xl">{page.name}</h1>
          <p className="mt-4 text-sm text-muted">Última actualización: {updated}</p>
          <div className="mt-12 space-y-10 leading-relaxed text-ink/85">{children}</div>
        </Container>
      </article>
    </>
  )
}
