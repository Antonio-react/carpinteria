import { useRef, useState, type FormEvent } from 'react'
import { FORM_STEPS, LAST_STEP } from '@/components/contact/formSteps'
import { pickErrors, validateContact, type ContactErrors, type ContactField } from '@/components/contact/validation'

export type ContactStatus = 'idle' | 'sending' | 'sent' | 'error'

export const FORM_NAME = 'contacto'

/** Orden de los campos en pantalla, para llevar el foco al primer error. */
const FIELD_ORDER: readonly ContactField[] = ['tipo', 'mensaje', 'ubicacion', 'adjunto-1', 'adjunto-2', 'nombre', 'email', 'telefono', 'privacidad']

/** Lo que el usuario ha contestado en los pasos anteriores (para el resumen del último). */
export interface ContactAnswers {
  tipo: string
  ubicacion: string
}

const textOf = (data: FormData, field: ContactField) => {
  const value = data.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Estado, pasos y envío del presupuesto guiado (Netlify Forms).
 * - Un único <form> con todos los campos; cada paso solo oculta los demás (así viajan todos al enviar).
 * - "Siguiente" valida solo los campos del paso actual; tras un intento fallido, revalida al escribir.
 * - Al enviar se valida todo; si algo falla, vuelve al paso donde está el error.
 * - Envía como multipart (FormData) para que viajen los adjuntos.
 * - En desarrollo (npm run dev) no existe el servicio de Netlify: se simula el envío.
 */
export function useContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<ContactStatus>('idle')
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [attempted, setAttempted] = useState(false)
  const [answers, setAnswers] = useState<ContactAnswers>({ tipo: '', ubicacion: '' })
  const [senderName, setSenderName] = useState('')

  const focusFirstError = (found: ContactErrors) => {
    const first = FIELD_ORDER.find((field) => found[field])
    // El campo puede estar en un paso que acaba de mostrarse: se enfoca en el siguiente fotograma.
    if (first) requestAnimationFrame(() => document.getElementById(`campo-${first}`)?.focus())
  }

  const stepErrors = (index: number) => {
    if (!formRef.current) return {}
    return pickErrors(validateContact(new FormData(formRef.current)), FORM_STEPS[index]?.fields ?? [])
  }

  const goToStep = (index: number) => {
    setStep(index)
    setErrors({})
    setAttempted(false)
  }

  /** Pasa al siguiente paso si el actual está bien. */
  const next = () => {
    const found = stepErrors(step)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      setAttempted(true)
      focusFirstError(found)
      return
    }
    if (formRef.current) {
      const data = new FormData(formRef.current)
      setAnswers({ tipo: textOf(data, 'tipo'), ubicacion: textOf(data, 'ubicacion') })
    }
    goToStep(Math.min(step + 1, LAST_STEP))
  }

  const back = () => goToStep(Math.max(step - 1, 0))

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Intro en un paso intermedio: avanza en vez de enviar.
    if (step < LAST_STEP) {
      next()
      return
    }

    const form = event.currentTarget
    const data = new FormData(form)
    const all = validateContact(data)
    if (Object.keys(all).length > 0) {
      // Vuelve al primer paso con errores y muestra solo los suyos.
      const failing = FORM_STEPS.findIndex((item) => Object.keys(pickErrors(all, item.fields)).length > 0)
      const target = failing === -1 ? step : failing
      const found = pickErrors(all, FORM_STEPS[target]?.fields ?? [])
      setStep(target)
      setErrors(found)
      setAttempted(true)
      focusFirstError(found)
      return
    }

    // Trampa para bots: si este campo oculto viene relleno, no se envía nada.
    if (data.get('bot-field')) return

    setStatus('sending')
    try {
      if (import.meta.env.DEV) {
        await new Promise((resolve) => setTimeout(resolve, 2400))
      } else {
        const response = await fetch('/', { method: 'POST', body: data })
        if (!response.ok) throw new Error(`Netlify respondió ${response.status}`)
      }
      setSenderName(textOf(data, 'nombre').split(' ')[0] ?? '')
      setStatus('sent')
      form.reset()
      goToStep(0)
    } catch {
      setStatus('error')
    }
  }

  /** Tras un intento fallido, los errores del paso se actualizan mientras corrige. */
  const onChange = () => {
    if (attempted) setErrors(stepErrors(step))
  }

  const reset = () => {
    setStatus('idle')
    goToStep(0)
  }

  return { formRef, status, step, errors, answers, senderName, next, back, onSubmit, onChange, reset }
}
