/**
 * Detalle cálido dentro de la chimenea: brasas encendidas al fondo del hogar, sin llamas dibujadas.
 * La chimenea (marco, cerco y cristal) es la de la foto original; esto solo añade luz por dentro.
 *
 * El contenedor usa el mismo lienzo que la foto (1656 × 1925 px), así que se coloca en %:
 *   interior del cristal: (17.63 %, 72.21 %) – (26.99 %, 73.25 %) – (26.99 %, 85.45 %) – (17.63 %, 83.12 %)
 * El resplandor "respira" despacio; con prefers-reduced-motion queda quieto.
 */
export function FireGlow() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {/* Luz cálida que sale del cristal y se refleja en el zócalo. */}
      <div className="absolute top-[74%] left-[12%] h-[20%] w-[22%] bg-[radial-gradient(closest-side,rgb(255_140_60/0.16),transparent)] mix-blend-screen motion-safe:animate-ember-breathe" />

      {/* Interior del cristal, recortado a su forma en perspectiva. */}
      <div className="absolute top-[72.21%] left-[17.63%] h-[13.24%] w-[9.36%] [clip-path:polygon(0_0,100%_7.9%,100%_100%,0_82.4%)]">
        {/* Resplandor de las brasas en las paredes del hogar. */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_55%_at_55%_92%,rgb(255_120_40/0.42),rgb(180_60_15/0.18)_45%,transparent_75%)] mix-blend-screen motion-safe:animate-ember-breathe" />
        {/* Lecho de brasas: una franja baja, más viva, siguiendo la inclinación del fondo. */}
        <div className="absolute inset-x-[12%] bottom-[9%] h-[14%] origin-center rotate-[16deg] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_190_100/0.85),rgb(255_90_20/0.55)_45%,transparent)] blur-[1.5px] mix-blend-screen motion-safe:animate-ember-flicker" />
      </div>
    </div>
  )
}
