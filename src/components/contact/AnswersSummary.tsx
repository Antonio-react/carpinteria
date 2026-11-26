interface AnswersSummaryProps {
  /** Tipo de trabajo elegido en el paso 1. */
  tipo: string
  /** Localidad del paso 2 (solo existe a partir del paso 3). */
  ubicacion?: string
  className?: string
}

/**
 * Lo que el usuario ha contestado en los pasos anteriores, en píldoras: así ve si lo ha elegido bien
 * antes de seguir (y si no, vuelve con "Atrás"). Se usa en los pasos 2 y 3. Recuadro de raya fina en rojo
 * lápiz y rótulo a máquina, como los de la ficha de contacto, para que no pase desapercibido.
 */
export function AnswersSummary({ tipo, ubicacion, className = '' }: AnswersSummaryProps) {
  if (!tipo) return null
  return (
    <p className={`flex w-fit flex-wrap items-center gap-2 rounded-sm border border-pencil/70 px-3 py-2 text-sm ${className}`}>
      <span className="pr-1 font-type text-xs text-pencil">tu consulta</span>
      <span className="rounded-full bg-ink px-3 py-1 text-paper">{tipo}</span>
      {ubicacion && <span className="rounded-full border border-ink/20 px-3 py-1">{ubicacion}</span>}
    </p>
  )
}
