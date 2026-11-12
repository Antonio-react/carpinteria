import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { AttachmentFields } from '@/components/contact/AttachmentFields'
import { CheckboxField } from '@/components/contact/CheckboxField'
import { FormProgress } from '@/components/contact/FormProgress'
import { FORM_STEPS, LAST_STEP } from '@/components/contact/formSteps'
import { FormStatusMessage } from '@/components/contact/FormStatusMessage'
import { SubmitButton } from '@/components/contact/SubmitButton'
import { TextField } from '@/components/contact/TextField'
import { FORM_NAME, useContactForm } from '@/components/contact/useContactForm'
import { WorkTypeChoice, type WorkTypeOption } from '@/components/contact/WorkTypeChoice'
import { siteConfig } from '@/config/site'
import { EmailText } from '@/components/ui/EmailText'
import { CATEGORIES } from '@/data/categories'
import { sketchFor } from '@/data/sketches'

/** Opciones del paso 1: las categorías de la galería (sin "Otros trabajos") y "Otro". */
const WORK_TYPES: readonly WorkTypeOption[] = [
  ...CATEGORIES.filter((category) => category.slug !== 'otros-trabajos').map((category) => ({ value: category.name, hint: category.tagline, sketch: sketchFor(category.slug) })),
  { value: 'Otro', hint: 'Cualquier otro trabajo en madera', sketch: sketchFor('otros-trabajos') },
]
/** Por debajo de lg, el formulario va debajo del texto de la sección (no al lado). */
const STACKED_LAYOUT = '(max-width: 1023px)'
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
  const successRef = useRef<HTMLDivElement>(null)

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

  // Al enviar, el formulario (alto) se cambia por el aviso (bajo) y la página encoge: en móvil y
  // tableta, donde el formulario va debajo del texto, la pantalla se quedaba vacía por debajo del
  // aviso. Se lleva el aviso al centro de la pantalla. En escritorio ya se ve junto al título.
  // El foco también pasa al aviso (el botón de enviar ha desaparecido).
  useEffect(() => {
    if (status !== 'sent') return
    const message = successRef.current
    if (!message) return
    message.focus({ preventScroll: true })
    if (window.matchMedia(STACKED_LAYOUT).matches) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      message.scrollIntoView({ block: 'center', behavior: reduced ? 'instant' : 'smooth' })
    }
  }, [status])

  if (status === 'sent') {
    return (
      <div ref={successRef} tabIndex={-1} className="space-y-6 outline-none">
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
    <>
    <div className="rounded-xl bg-bone p-2.5 shadow-[0_24px_48px_-28px_rgb(28_25_22/0.45)]">
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
      // Hoja de encargo (como el boceto aprobado): raya oscura recta en el mismo borde, pintada como fondo para
      // que el redondeo de la hoja la recorte en las esquinas (los dos trazos no llegan a juntarse); 5px más
      // adentro, raya más suave cerrada y de esquinas rectas (outline hacia dentro). Alrededor, una tarjeta
      // clara con un pequeño margen (el <div> que envuelve el formulario).
      // Escritorio: misma altura en los 3 pasos (la del más largo) y botones fijos abajo: centrado
      // junto al texto de la izquierda sin saltar al cambiar de paso.
      className="rounded-md [background:linear-gradient(rgb(28_25_22/0.55),rgb(28_25_22/0.55))_top/100%_1px_no-repeat,linear-gradient(rgb(28_25_22/0.55),rgb(28_25_22/0.55))_bottom/100%_1px_no-repeat,linear-gradient(rgb(28_25_22/0.55),rgb(28_25_22/0.55))_left/1px_100%_no-repeat,linear-gradient(rgb(28_25_22/0.55),rgb(28_25_22/0.55))_right/1px_100%_no-repeat,var(--color-paper)] outline-1 -outline-offset-6 outline-ink/35 p-6 sm:p-9 lg:flex lg:min-h-[40rem] lg:flex-col lg:compact:min-h-[38.5rem] lg:compact:p-6"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label>
          No rellenes este campo: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <FormProgress current={step} steps={FORM_STEPS.map((item) => item.title)} />

      <div className="mt-8 lg:flex-1 lg:compact:mt-6">
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
            <AttachmentFields error={errors['adjunto-1']} />
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
      <div className="mt-8 flex flex-wrap-reverse items-center justify-between gap-4 border-t border-ink/10 pt-6 lg:compact:mt-6 lg:compact:pt-5">
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
    </div>
    {/* Alternativa discreta: quien no quiera rellenar nada puede escribir directamente. */}
    <p className="mt-4 px-1 text-left text-sm text-muted">
      ¿Prefieres no rellenar nada? Escríbenos directamente a{' '}
      {/* Móvil: el correo en su propia línea y sin cortarse; desde sm, seguido en la frase. */}
      <a href={`mailto:${siteConfig.email}`} className="mt-1 block w-fit whitespace-nowrap text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink sm:mt-0 sm:inline sm:whitespace-normal">
        <EmailText email={siteConfig.email} />
      </a>
      <span className="hidden sm:inline">.</span>
    </p>
    </>
  )
}
