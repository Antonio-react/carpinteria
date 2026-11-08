import { SawingPlank } from '@/components/contact/SawingPlank'

interface SubmitButtonProps {
  sending: boolean
}

/** Botón de enviar: mientras se procesa, muestra el serrucho cortando la tabla. */
export function SubmitButton({ sending }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={sending}
      aria-busy={sending}
      className="group relative inline-flex min-h-14 w-full items-center justify-center gap-4 overflow-hidden rounded-full bg-ink px-8 text-base font-medium text-paper transition-transform duration-150 ease-out active:scale-[0.98] disabled:cursor-progress sm:w-auto"
    >
      {sending ? (
        <>
          <SawingPlank />
          <span>Enviando…</span>
        </>
      ) : (
        <>
          <span>Enviar mi idea</span>
          <span aria-hidden="true" className="transition-transform duration-200 ease-(--ease-out-strong) group-hover:translate-x-1">
            →
          </span>
        </>
      )}
    </button>
  )
}
