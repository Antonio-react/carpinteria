export type ProcessStage = 'measure' | 'design' | 'build'

interface ProcessDrawingProps {
  stage: ProcessStage
}

/*
 * Plano dibujado a lápiz de cada paso, siempre sobre el mismo hueco de pared:
 *   measure → el hueco con sus cotas en rojo · design → el mueble dibujado dentro · build → el mueble terminado.
 * Las líneas usan pathLength=1 para poder "trazarse" con stroke-dashoffset (ver ProcessSection).
 * Las cotas no llevan cifras: no inventamos medidas.
 */
const LINE = 'fill-none stroke-ink [stroke-width:1.4] [stroke-dasharray:1] [stroke-dashoffset:var(--draw)] transition-[stroke-dashoffset] duration-[1400ms] ease-(--ease-in-out-strong)'
const COTA = 'fill-none stroke-pencil [stroke-width:1.2] [stroke-dasharray:1] [stroke-dashoffset:var(--draw)] transition-[stroke-dashoffset] delay-300 duration-[1400ms] ease-(--ease-in-out-strong)'
const FILL = 'opacity-(--fill) transition-opacity delay-[900ms] duration-700'

function WallHole() {
  return (
    <>
      {/* Suelo y hueco de pared */}
      <path pathLength={1} className={LINE} d="M 10 160 H 230" />
      <path pathLength={1} className={LINE} d="M 40 160 V 30 H 200 V 160" />
    </>
  )
}

function Cotas() {
  return (
    <>
      {/* Cota horizontal (ancho del hueco) con sus marcas */}
      <path pathLength={1} className={COTA} d="M 40 18 H 200 M 40 13 V 23 M 200 13 V 23" />
      {/* Cota vertical (alto) */}
      <path pathLength={1} className={COTA} d="M 214 30 V 160 M 209 30 H 219 M 209 160 H 219" />
    </>
  )
}

function Cabinet({ filled }: { filled: boolean }) {
  return (
    <>
      {filled && (
        <>
          <rect x="48" y="40" width="118" height="92" className={`fill-paper ${FILL}`} />
          <rect x="166" y="40" width="26" height="92" className={`fill-oak/80 ${FILL}`} />
          <rect x="48" y="132" width="144" height="22" className={`fill-ink ${FILL}`} />
          <rect x="84" y="62" width="58" height="34" className={`fill-[#2c6f6a] ${FILL}`} />
        </>
      )}
      {/* Paneles, hueco de la tele, estantería y zócalo */}
      <path pathLength={1} className={LINE} d="M 48 40 H 192 V 154 H 48 Z" />
      <path pathLength={1} className={LINE} d="M 48 132 H 192 M 166 40 V 132 M 166 72 H 192 M 166 102 H 192" />
      <path pathLength={1} className={LINE} d="M 84 62 H 142 V 96 H 84 Z" />
      <path pathLength={1} className={LINE} d="M 66 40 V 132 M 48 86 H 84 M 142 86 H 166 M 120 40 V 62 M 120 96 V 132" />
    </>
  )
}

export function ProcessDrawing({ stage }: ProcessDrawingProps) {
  return (
    <svg viewBox="0 0 240 180" aria-hidden="true" className="h-auto w-full">
      <WallHole />
      {stage !== 'build' && <Cotas />}
      {stage !== 'measure' && <Cabinet filled={stage === 'build'} />}
    </svg>
  )
}
