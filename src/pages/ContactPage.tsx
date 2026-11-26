import { PageMeta } from '@/components/layout/PageMeta'
import { ContactSection } from '@/components/sections/ContactSection'
import { PAGES } from '@/data/pages'

/** Página Contacto: frase de cabecera, datos y formulario. */
export default function ContactPage() {
  return (
    <>
      <PageMeta title={PAGES.contact.title} description={PAGES.contact.description} />
      <ContactSection level="h1" />
    </>
  )
}
