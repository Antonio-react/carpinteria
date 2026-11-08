import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { CheckboxField } from '@/components/contact/CheckboxField'
import { FileField } from '@/components/contact/FileField'
import { FormProgress } from '@/components/contact/FormProgress'
import { FORM_STEPS, LAST_STEP } from '@/components/contact/formSteps'
import { FormStatusMessage } from '@/components/contact/FormStatusMessage'
import { SubmitButton } from '@/components/contact/SubmitButton'
import { TextField } from '@/components/contact/TextField'
import { FORM_NAME, useContactForm } from '@/components/contact/useContactForm'
import { ACCEPTED_FILES, MAX_UPLOAD_MB } from '@/components/contact/validation'
import { WorkTypeChoice, type WorkTypeOption } from '@/components/contact/WorkTypeChoice'
import { siteConfig } from '@/config/site'
import { CATEGORIES } from '@/data/categories'

/** Opciones del paso 1: las categorías de la galería (sin "Otros trabajos") y "Otro". */
const WORK_TYPES: readonly WorkTypeOption[] = [
  ...CATEGORIES.filter((category) => category.slug !== 'otros-trabajos').map((category) => ({ value: category.name, hint: category.tagline })),
  { value: 'Otro', hint: 'Cualquier otro trabajo en madera' },
]
const FILES_HINT_ID = 'adjuntos-ayuda'
const titleId = (index: number) => `paso-${FORM_STEPS[index]?.id ?? index}-titulo`

/**
 * Presupuesto guiado en 3 pasos (Netlify Forms): qué tienes en mente → tu idea → tus datos.
 * Es UN solo formulario: los pasos que no se ven solo están ocultos, así al enviar viajan todos
 * los campos. Los nombres de campo coinciden con el formulario gemelo de index.html.
 */
export default function ContactForm() {
  const { formRef, status, step, errors, answers, senderName, next, back, onSubmit, onChange, reset } = useContactForm()
  const headings = useRef<(HTMLHeadingElement | null)[]>([])
  const previousStep = useRef(step)

  // Al CAMBIAR de paso (nunca al abrir la página), el foco va a su título: lectores de pantalla y
  // teclado saben dónde están. Se compara con el paso anterior en vez de usar una marca de
  // "primera vez": en desarrollo React ejecuta los efectos dos veces al montar y la marca fallaba,
  // enfocando el título al cargar la página (y el navegador la desplazaba hasta él).
  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    if (Object.keys(errors).length === 0) headings.current[step]?.focus()
    // Solo al cambiar de paso: los errores enfocan su propio campo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  if (status === 'sent') {
    return (
      <div className="space-y-6">
        <FormStatusMessage tone="success" title="Mensaje enviado">
          <p>
            Gracias{senderName ? `, ${senderName}` : ''}. Hemos recibido tu idea y te contestaremos lo antes posible.
          </p>
        </FormStatusMessage>
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center text-sm font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
          Enviar otra consulta
        </button>
      </div>
    )
  }

  /** Cabecera y contenido de un paso. Los pasos ocultos siguen en el formulario. */
  const stepPanel = (index: number, children: ReactNode) => {
    const item = FORM_STEPS[index]
    if (!item) return null
    return (
      <section hidden={step !== index} aria-labelledby={titleId(index)} className="motion-safe:animate-rise">
        <h3
          id={titleId(index)}
          ref={(node) => {
            headings.current[index] = node
          }}
          tabIndex={-1}
          className="scroll-mt-28 text-2xl font-medium tracking-[-0.02em] outline-none [font-stretch:105%] sm:text-3xl"
        >
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-muted">{item.intro}</p>
        <div className="mt-6">{children}</div>
      </section>
    )
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form
      ref={formRef}
      name={FORM_NAME}
      method="POST"
      encType="multipart/form-data"
      data-netlify="true"
      netlify-honeypot="bot-field"
      noValidate
      onSubmit={onSubmit}
      onChange={onChange}
      // Escritorio: misma altura en los 3 pasos (la del más largo) y botones fijos abajo: centrado
      // junto al texto de la izquierda sin saltar al cambiar de paso.
      className="rounded-[20px] border border-ink/10 bg-paper/60 p-5 sm:p-8 lg:flex lg:min-h-[48rem] lg:flex-col"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label>
          No rellenes este campo: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <FormProgress current={step} steps={FORM_STEPS.map((item) => item.title)} />

      <div className="mt-8 lg:flex-1">
        {stepPanel(0, <WorkTypeChoice name="tipo" options={WORK_TYPES} labelledBy={titleId(0)} error={errors.tipo} onPick={next} />)}

        {stepPanel(
          1,
          <div className="grid gap-6">
            <TextField
              name="mensaje"
              label="Tu idea"
              multiline
              required
              placeholder="Qué quieres hacer, para qué estancia, medidas aproximadas si las tienes…"
              error={errors.mensaje}
            />
            <TextField
              name="ubicacion"
              label="Localidad o zona"
              autoComplete="address-level2"
              placeholder="Ej.: Toledo, Madrid centro…"
              required
              error={errors.ubicacion}
            />
            <fieldset>
              <legend className="text-sm font-medium">
                Planos o fotos de referencia <span className="font-normal text-muted">(opcional)</span>
              </legend>
              <p id={FILES_HINT_ID} className="mt-1 text-xs text-muted">
                Imágenes, PDF o DWG. Entre los dos archivos, como máximo {MAX_UPLOAD_MB} MB.
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <FileField name="adjunto-1" label="Adjuntar archivo" accept={ACCEPTED_FILES} error={errors['adjunto-1']} hintId={FILES_HINT_ID} />
                <FileField name="adjunto-2" label="Adjuntar otro" accept={ACCEPTED_FILES} hintId={FILES_HINT_ID} />
              </div>
            </fieldset>
          </div>,
        )}

        {stepPanel(
          2,
          <div className="grid gap-6 sm:grid-cols-2">
            {answers.tipo && (
              <p className="flex flex-wrap items-center gap-2 text-sm sm:col-span-2">
                <span className="text-muted">Tu consulta:</span>
                <span className="rounded-full bg-ink px-3 py-1 text-paper">{answers.tipo}</span>
                {answers.ubicacion && <span className="rounded-full border border-ink/20 px-3 py-1">{answers.ubicacion}</span>}
              </p>
            )}
            <TextField name="nombre" label="Nombre" autoComplete="name" required error={errors.nombre} />
            <TextField name="email" label="Correo electrónico" type="email" autoComplete="email" required error={errors.email} />
            <TextField name="telefono" label="Teléfono" type="tel" autoComplete="tel" error={errors.telefono} className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <CheckboxField name="privacidad" required error={errors.privacidad}>
                He leído la{' '}
                <Link to="/privacidad" className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                  política de privacidad
                </Link>{' '}
                y acepto que se usen mis datos para responder a mi consulta.
              </CheckboxField>
            </div>
            {status === 'error' && (
              <div className="sm:col-span-2">
                <FormStatusMessage tone="error" title="No se ha podido enviar">
                  <p>
                    Comprueba tu conexión y vuelve a intentarlo. Si sigue fallando, escríbenos a{' '}
                    <a href={`mailto:${siteConfig.email}`} className="break-all text-ink underline underline-offset-4">
                      {siteConfig.email}
                    </a>
                    .
                  </p>
                </FormStatusMessage>
              </div>
            )}
          </div>,
        )}
      </div>

      {hasErrors && step > 0 && (
        <p role="alert" className="mt-6 text-sm text-pencil">
          Revisa los campos marcados para seguir.
        </p>
      )}

      {/* Navegación entre pasos */}
      <div className="mt-8 flex flex-wrap-reverse items-center justify-between gap-4 border-t border-ink/10 pt-6">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span> Atrás
          </button>
        ) : (
          <span />
        )}
        {step < LAST_STEP ? (
          <button
            type="button"
            onClick={next}
            className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-7 text-sm font-medium text-paper transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Siguiente
            <span aria-hidden="true" className="transition-transform duration-200 ease-(--ease-out-strong) group-hover:translate-x-1">
              →
            </span>
          </button>
        ) : (
          <SubmitButton sending={status === 'sending'} />
        )}
      </div>
    </form>
  )
}
