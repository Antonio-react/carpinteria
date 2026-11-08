import { Container } from '@/components/ui/Container'
import { FaqItem } from '@/components/ui/FaqItem'
import { SectionHeading } from '@/components/ui/SectionHeading'

const FAQS = [
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
      'Depende de cada trabajo: no damos plazos cerrados sin conocer el proyecto. Cuando lo veamos, te diremos cómo lo organizamos. A las consultas respondemos lo antes posible.',
  },
  {
    question: '¿Qué tipo de trabajos hacéis?',
    answer: 'Todo lo que sea madera: armarios, puertas, suelos, cocinas, muebles de salón, porches, pérgolas y encargos especiales.',
  },
  {
    question: '¿Trabajáis también para empresas?',
    answer: 'Sí, tanto para particulares como para empresas: oficinas, locales, tiendas o lo que necesites en madera.',
  },
  {
    question: '¿Puedo enviaros planos o fotos?',
    answer: 'Sí. En el formulario de contacto puedes adjuntar planos o fotos de referencia (hasta 8 MB entre los dos archivos).',
  },
] as const

/** Preguntas frecuentes (página Cómo trabajamos). No promete plazos fijos. */
export function FaqSection() {
  return (
    <section aria-labelledby="preguntas-titulo" className="bg-bone py-24 lg:py-32 lg:compact:py-24">
      <Container className="grid gap-12 lg:grid-cols-12">
        <SectionHeading id="preguntas-titulo" title="Preguntas frecuentes" className="lg:col-span-5" />
        <div className="lg:col-span-7">
          {FAQS.map((faq) => (
            <FaqItem key={faq.question} question={faq.question}>
              <p>{faq.answer}</p>
            </FaqItem>
          ))}
        </div>
      </Container>
    </section>
  )
}
