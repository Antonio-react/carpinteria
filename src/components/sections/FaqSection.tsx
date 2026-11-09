import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { EmailText } from '@/components/ui/EmailText'
import { FaqItem } from '@/components/ui/FaqItem'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { siteConfig } from '@/config/site'

const FAQS: readonly { question: string; answer: ReactNode }[] = [
  {
    question: '¿Cuánto cuesta el presupuesto?',
    answer: 'Nada. Cuéntanos tu idea y te preparamos el presupuesto sin coste.',
  },
  {
    question: '¿Trabajáis fuera de vuestra zona?',
    answer: 'Sí, en toda España. Fabricamos la pieza en nuestro taller, la transportamos y la montamos nosotros mismos.',
  },
  {
    question: '¿Cuánto se tarda?',
    answer:
      'No te vamos a prometer una fecha que no podamos cumplir. Te decimos cuándo estará cuando lo sepamos de verdad. A las consultas, eso sí, respondemos lo antes posible.',
  },
  {
    question: '¿Qué tipo de trabajos hacéis?',
    answer: 'Todo lo que sea madera: armarios, puertas, suelos, cocinas, muebles de salón, escaleras y encargos especiales.',
  },
  {
    question: '¿Trabajáis también para empresas?',
    answer: 'Sí, tanto para particulares como para empresas: oficinas, locales, tiendas o lo que necesites en madera.',
  },
  {
    question: '¿Puedo enviaros planos o fotos?',
    answer: (
      <>
        Sí. En el formulario de contacto puedes adjuntar planos o fotos de referencia (hasta 8 MB entre los dos archivos). Si
        tienes más o pesan más, escríbenos directamente a{' '}
        <a href={`mailto:${siteConfig.email}`} className="underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          <EmailText email={siteConfig.email} />
        </a>
        .
      </>
    ),
  },
]

/** Preguntas frecuentes (página Cómo trabajamos). No promete plazos fijos. */
export function FaqSection() {
  return (
    <section aria-labelledby="preguntas-titulo" className="bg-bone py-24 lg:py-32 lg:compact:py-24">
      <Container className="grid gap-12 lg:grid-cols-12">
        <SectionHeading id="preguntas-titulo" title="Preguntas frecuentes" className="lg:col-span-5" />
        {/* Hoja de libreta: rayado azul, margen en rojo y un poco torcida, sobre la mesa. */}
        <div className="relative rotate-[0.4deg] bg-[#fbf8f1] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(2.25rem-1px),rgb(110_140_180/0.22)_calc(2.25rem-1px),rgb(110_140_180/0.22)_2.25rem)] pt-0 pb-9 pr-5 pl-8 shadow-[0_20px_40px_-24px_rgb(28_25_22/0.45)] sm:pl-14 lg:col-span-7">
          <span aria-hidden="true" className="absolute inset-y-0 left-5 w-px bg-pencil/40 sm:left-10" />
          {FAQS.map((faq, index) => (
            <FaqItem key={faq.question} number={index + 1} question={faq.question}>
              <p>{faq.answer}</p>
            </FaqItem>
          ))}
        </div>
      </Container>
    </section>
  )
}
