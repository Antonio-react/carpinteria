import { lazy } from 'react'
import { ContactDetails } from '@/components/contact/ContactDetails'
import { Container } from '@/components/ui/Container'
import { LazySection } from '@/components/ui/LazySection'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CONTACT_FORM_ID } from '@/data/navigation'

const ContactForm = lazy(() => import('@/components/contact/ContactForm'))

/** Contacto: frase de cabecera, datos y formulario (este último se carga al acercarse). */
interface ContactSectionProps {
  /** h1 cuando es la cabecera de la página Contacto. */
  level?: 'h1' | 'h2'
}

export function ContactSection({ level = 'h2' }: ContactSectionProps) {
  return (
    <section aria-labelledby="contacto-titulo" className={`relative bg-sawdust ${level === 'h1' ? 'pt-32 pb-24 lg:pt-40 lg:pb-32 lg:compact:pb-24' : 'py-24 lg:py-36 lg:compact:py-24'}`}>
      <Container className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contacto-titulo"
            level={level}
            title="Cuéntanos tu idea y la hacemos realidad."
            intro="El presupuesto es gratis. Te responderemos lo antes posible."
          />
          <div className="mt-12">
            <ContactDetails />
          </div>
        </div>
        {/* En escritorio, centrado en vertical respecto a la columna de la izquierda. */}
        <LazySection id={CONTACT_FORM_ID} anchorMobileOnly minHeight="40rem" className="lg:col-span-7 lg:self-center">
          <ContactForm />
        </LazySection>
      </Container>
    </section>
  )
}
