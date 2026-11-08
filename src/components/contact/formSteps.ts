import type { ContactField } from '@/components/contact/validation'

export interface FormStep {
  id: string
  title: string
  /** Frase corta bajo el título del paso. */
  intro: string
  /** Campos que se validan antes de pasar al siguiente paso. */
  fields: readonly ContactField[]
}

/** Pasos del presupuesto guiado. Todos los campos siguen en un único formulario (Netlify). */
export const FORM_STEPS: readonly FormStep[] = [
  {
    id: 'tipo',
    title: '¿Qué tienes en mente?',
    intro: 'Elige lo que más se parezca. Si no lo tienes claro, marca «Otro».',
    fields: ['tipo'],
  },
  {
    id: 'idea',
    title: 'Cuéntanos tu idea',
    intro: 'Cuanto más nos cuentes, mejor podremos preparar el presupuesto.',
    fields: ['mensaje', 'ubicacion', 'adjunto-1', 'adjunto-2'],
  },
  {
    id: 'datos',
    title: '¿Cómo te contactamos?',
    intro: 'Solo usaremos tus datos para responder a tu consulta.',
    fields: ['nombre', 'email', 'telefono', 'privacidad'],
  },
]

export const LAST_STEP = FORM_STEPS.length - 1
