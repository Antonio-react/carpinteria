/**
 * Animación del botón mientras se envía: un serrucho que va y viene cortando una tabla,
 * con el corte avanzando. Con prefers-reduced-motion queda quieta (el texto ya dice "Enviando…").
 */
export function SawingPlank() {
  return (
    <svg viewBox="0 0 72 28" aria-hidden="true" className="h-7 w-[72px] overflow-visible">
      {/* Tabla */}
      <rect x="2" y="16" width="68" height="9" rx="1.5" className="fill-oak" />
      <path d="M 6 19.5 H 30 M 40 22 H 64" className="stroke-oak-dark [stroke-width:0.8]" />
      {/* Corte que avanza */}
      <rect x="2" y="15" width="68" height="2" className="origin-left fill-night [transform-box:fill-box] motion-safe:animate-cut" />
      {/* Serrucho */}
      <g className="[transform-box:fill-box] motion-safe:animate-saw-stroke">
        <path d="M 22 15 L 58 15 L 58 6 L 26 11 Z" className="fill-[#c9ccd1]" />
        <path d="M 22 15 l 2 1.6 l 2 -1.6 l 2 1.6 l 2 -1.6 l 2 1.6 l 2 -1.6 l 2 1.6 l 2 -1.6 l 2 1.6 l 2 -1.6 l 2 1.6 l 2 -1.6 l 2 1.6 l 2 -1.6 l 2 1.6 l 2 -1.6 l 2 1.6 l 2 -1.6" className="fill-none stroke-[#9aa0a8] [stroke-width:0.8]" />
        <rect x="56" y="3" width="13" height="10" rx="3" className="fill-oak-dark" />
      </g>
    </svg>
  )
}
