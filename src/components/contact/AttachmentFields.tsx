import { useState } from 'react'
import { FileField } from '@/components/contact/FileField'
import { ACCEPTED_FILES, MAX_UPLOAD_MB } from '@/components/contact/validation'

const HINT_ID = 'adjuntos-ayuda'
const SECOND_ID = 'campo-adjunto-2'

interface AttachmentFieldsProps {
  error?: string
}

/**
 * Adjuntos del paso 2: se ve un solo selector y, a su lado, un cuadrado "+" para añadir el segundo
 * (Netlify admite un archivo por campo, así que siguen siendo dos campos). El segundo campo está
 * siempre en el formulario, solo oculto, para que coincida con el gemelo de index.html.
 * Se reinicia solo al enviar: el formulario entero se desmonta y vuelve a montarse.
 */
export function AttachmentFields({ error }: AttachmentFieldsProps) {
  const [showSecond, setShowSecond] = useState(false)

  const addSecond = () => {
    setShowSecond(true)
    // El "+" desaparece: el foco pasa al nuevo selector (en el siguiente fotograma ya se ve).
    requestAnimationFrame(() => document.getElementById(SECOND_ID)?.focus())
  }

  return (
    <fieldset>
      <legend className="text-sm font-medium">
        Planos o fotos de referencia <span className="font-normal text-muted">(opcional)</span>
      </legend>
      <p id={HINT_ID} className="mt-1 text-xs text-muted">
        Hasta dos archivos (imágenes, PDF o DWG), {MAX_UPLOAD_MB} MB entre los dos.
      </p>
      <div className={`mt-3 grid gap-3 ${showSecond ? 'sm:grid-cols-2' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <FileField name="adjunto-1" label="Adjuntar archivo" accept={ACCEPTED_FILES} error={error} hintId={HINT_ID} />
          </div>
          {/* "Otra hoja": hoja en blanco con la esquina doblada y un "+" rojo a máquina, del mismo
              alto que el selector (60px fijos: si sale un error bajo el selector, no se estira). */}
          {!showSecond && (
            <button
              type="button"
              onClick={addSecond}
              aria-label="Añadir otro archivo"
              title="Añadir otro archivo"
              className="group relative grid size-15 shrink-0 place-items-center transition-transform duration-150 ease-out active:scale-[0.96]"
            >
              <svg aria-hidden="true" viewBox="0 0 60 60" fill="none" className="absolute inset-0 size-full">
                <path
                  d="M5 .5H45.5L59.5 14.5V55a4.5 4.5 0 0 1-4.5 4.5H5A4.5 4.5 0 0 1 .5 55V5A4.5 4.5 0 0 1 5 .5Z"
                  strokeDasharray="3 3"
                  className="fill-paper stroke-ink/30 transition-colors group-hover:stroke-ink/60"
                />
                <path d="M45.5 .5V10a4.5 4.5 0 0 0 4.5 4.5h9.5" className="fill-ink/[0.07] stroke-ink/30 transition-colors group-hover:stroke-ink/60" />
              </svg>
              <span aria-hidden="true" className="relative pt-1 font-type text-[28px] leading-none text-pencil">
                +
              </span>
            </button>
          )}
        </div>
        <div hidden={!showSecond}>
          <FileField name="adjunto-2" label="Adjuntar otro" accept={ACCEPTED_FILES} hintId={HINT_ID} />
        </div>
      </div>
    </fieldset>
  )
}
