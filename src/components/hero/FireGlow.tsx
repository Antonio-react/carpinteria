/**
 * Detalle cálido dentro de la chimenea: brasas encendidas al fondo del hogar, sin llamas dibujadas.
 * La chimenea (marco, cerco y cristal) es la de la foto original; esto solo añade luz por dentro.
 *
 * El contenedor usa el mismo lienzo que la foto (1656 × 1925 px), así que se coloca en %:
 *   interior del cristal: (17.63 %, 72.21 %) – (26.99 %, 73.25 %) – (26.99 %, 85.45 %) – (17.63 %, 83.12 %)
 * Una sola capa de brasas con un parpadeo suave (solo brillo, sin formas que se muevan: así no parece
 * artificial), pero intenso, para que se note también en el móvil. Fuera, un resplandor cálido suave
 * pegado a la chimenea, que "respira" (más grande parecía que la chimenea sobresalía del cerco).
 * Con prefers-reduced-motion queda quieto, pero encendido (las capas se ven igual, sin animar).
 */
export function FireGlow() {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {/* Luz cálida que sale del cristal y se refleja en el zócalo: pegada a la chimenea, para que no
          parezca que la luz (o la chimenea) sobresale del cerco. */}
      <div className="absolute top-[74%] left-[12%] h-[20%] w-[22%] bg-[radial-gradient(closest-side,rgb(255_140_60/0.16),transparent)] mix-blend-screen motion-safe:animate-ember-breathe" />

      {/* Interior del cristal DENTRO del cerco negro (el "core" de hero-layers.mjs: (299,1418) (440,1438)
          (440,1657) (299,1613) en la foto original). Con el cristal entero, las brasas tapaban el cerco. */}
      <div className="absolute top-[72.623%] left-[18.056%] h-[12.416%] w-[8.514%] [clip-path:polygon(0_0,100%_8.37%,100%_100%,0_81.59%)]">
        {/* Resplandor de las brasas: ilumina las paredes y el fondo del hogar entero (no solo la base). */}
        <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_55%_92%,rgb(255_135_50/0.8),rgb(210_75_20/0.38)_45%,transparent_80%),radial-gradient(120%_100%_at_50%_75%,rgb(255_120_45/0.28),rgb(180_60_20/0.12)_60%,transparent)] mix-blend-screen motion-safe:animate-ember-breathe" />
        {/* Lecho de brasas: una franja baja, más viva, siguiendo la inclinación del fondo. */}
        <div className="absolute inset-x-[10%] bottom-[8%] h-[16%] origin-center rotate-[16deg] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_205_120/0.95),rgb(255_95_25/0.65)_45%,transparent)] blur-[1.5px] mix-blend-screen motion-safe:animate-ember-flicker" />
      </div>
    </div>
  )
}
