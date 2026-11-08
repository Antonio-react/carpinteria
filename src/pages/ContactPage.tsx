import { PageMeta } from '@/components/layout/PageMeta'
import { ContactSection } from '@/components/sections/ContactSection'

/** Página Contacto: frase de cabecera, datos y formulario. */
export default function ContactPage() {
  return (
    <>
      <PageMeta
        title="Contacto y presupuesto · Carpintería y Decoración"
        description="Cuéntanos tu idea y la hacemos realidad. Pide presupuesto gratis por el formulario o por correo; te respondemos lo antes posible."
      />
      <ContactSection level="h1" />
    </>
  )
}
