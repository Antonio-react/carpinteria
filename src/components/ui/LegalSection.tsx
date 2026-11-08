import type { ReactNode } from 'react'

interface LegalSectionProps {
  title: string
  children: ReactNode
}

/** Apartado de una página legal (título y párrafos o listas). */
export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section>
      <h2 className="text-xl font-medium tracking-[-0.01em] text-ink">{title}</h2>
      <div className="mt-3 space-y-3 [&_a]:break-all [&_a]:underline [&_a]:underline-offset-4 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1">{children}</div>
    </section>
  )
}
