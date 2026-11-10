import pieceLarge from '@/assets/hero/piece-1400.webp'
import pieceSmall from '@/assets/hero/piece-800.webp'
import roomLarge from '@/assets/hero/room-1400.webp'
import roomSmall from '@/assets/hero/room-800.webp'
import { CabinetBlueprint } from '@/components/sections/CabinetBlueprint'
import { BeforeAfter } from '@/components/ui/BeforeAfter'
import { PencilUnderline } from '@/components/ui/PencilUnderline'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { useRevealOnce } from '@/hooks/useRevealOnce'

const SIZES = '(min-width: 1024px) 40vw, 100vw'
const LAYER = 'absolute inset-0 size-full'

/**
 * "Del plano a tu casa": comparador entre el plano a lápiz del mueble del hero y la foto real
 * del mueble terminado (mismo lienzo, así cada línea cae sobre su borde). El plano se traza al
 * aparecer en pantalla (--draw / --fill, igual que las láminas de Cómo trabajamos).
 */
export function PlanToRealSection() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.25)

  const plan = (
    <div className="size-full bg-paper bg-[linear-gradient(to_right,rgb(28_25_22/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(28_25_22/0.06)_1px,transparent_1px)] bg-size-[20px_20px]">
      <CabinetBlueprint />
    </div>
  )

  const real = (
    <div className="size-full bg-night">
      <img src={roomLarge} srcSet={`${roomSmall} 800w, ${roomLarge} 1400w`} sizes={SIZES} alt="" width={1400} height={1627} loading="lazy" draggable={false} className={LAYER} />
      <img
        src={pieceLarge}
        srcSet={`${pieceSmall} 800w, ${pieceLarge} 1400w`}
        sizes={SIZES}
        alt="El mueble terminado: puertas lacadas en blanco con la tele empotrada, estantería de roble y zócalo negro con chimenea"
        width={1400}
        height={1627}
        loading="lazy"
        draggable={false}
        className={LAYER}
      />
    </div>
  )

  return (
    <section aria-labelledby="plano-titulo" className="bg-bone py-24 lg:py-36 lg:compact:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <SectionHeading
          id="plano-titulo"
          title={
            <>
              Primero lo dibujamos. Luego lo <PencilUnderline>montamos</PencilUnderline>
            </>
          }
          intro="Cada mueble empieza como un plano a lápiz sobre las medidas reales de tu pared. Arrastra la barra y mira cómo ese plano se convierte en el mueble terminado."
          className="lg:col-span-6"
        />
        <div
          ref={ref}
          data-drawn={revealed}
          className="[--draw:1] [--fill:0] data-[drawn=true]:[--draw:0] data-[drawn=true]:[--fill:1] lg:col-span-6"
        >
          <BeforeAfter
            before={plan}
            after={real}
            beforeLabel="Plano"
            afterLabel="Terminado"
            label="Comparar el plano con el mueble terminado"
            initial={55}
            className="mx-auto aspect-[1656/1925] w-full max-w-xl lg:compact:max-w-[min(36rem,calc((100svh-9rem)*0.86))] phone-land:max-w-[calc((100svh-3rem)*0.86)]! rounded-[20px] border border-ink/10 shadow-[0_30px_80px_-30px_rgb(28_25_22/0.45)]"
          />
        </div>
      </Container>
    </section>
  )
}
