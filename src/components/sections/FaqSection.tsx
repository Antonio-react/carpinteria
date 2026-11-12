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
      <Container className="grid gap-12 lg:grid-cols-12 lg:grid-rows-[auto_1fr]">
        <SectionHeading id="preguntas-titulo" title="Preguntas frecuentes" className="lg:col-span-5" />
        {/* Hoja de libreta: rayado azul, margen en rojo y un poco torcida, sobre la mesa.
            Escritorio: ocupa las dos filas de la derecha; a la izquierda, título y debajo la invitación a escribir. */}
        <div className="relative lg:row-span-2 rotate-[0.4deg] bg-[#fbf8f1] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(2.25rem-1px),rgb(110_140_180/0.22)_calc(2.25rem-1px),rgb(110_140_180/0.22)_2.25rem)] pt-0 pb-9 pr-5 pl-8 shadow-[0_20px_40px_-24px_rgb(28_25_22/0.45)] sm:pl-14 lg:col-span-7">
          <span aria-hidden="true" className="absolute inset-y-0 left-5 w-px bg-pencil/40 sm:left-10" />
          {FAQS.map((faq, index) => (
            <FaqItem key={faq.question} number={index + 1} question={faq.question}>
              <p>{faq.answer}</p>
            </FaqItem>
          ))}
        </div>
        {/* Para dudas que no están en la lista: escribir directamente. En móvil va debajo de la libreta
            (orden del HTML); en escritorio, bajo el título, con una flecha a lápiz hacia las preguntas. */}
        <div className="lg:col-span-5 lg:row-start-2 lg:-mt-4">
          <p className="max-w-sm text-left text-xl leading-snug text-ink/75">Si te queda alguna duda, pregúntanos directamente</p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-3 inline-flex min-h-11 items-center underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          >
            <EmailText email={siteConfig.email} />
          </a>
          <svg aria-hidden="true" viewBox="0 0 120 60" fill="none" className="mt-4 ml-36 hidden h-15 w-30 stroke-pencil lg:block">
            <path d="M4 8c22 30 60 42 104 34" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M96 32l12 10-14 6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Container>
    </section>
  )
}
