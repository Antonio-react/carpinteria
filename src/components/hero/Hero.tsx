import { useRef, type ReactNode } from 'react'
import pieceLarge from '@/assets/hero/piece-1400.webp'
import pieceFull from '@/assets/hero/piece-2000.webp'
import pieceSmall from '@/assets/hero/piece-800.webp'
import roomLarge from '@/assets/hero/room-1400.webp'
import roomSmall from '@/assets/hero/room-800.webp'
import oakFrameTop from '@/assets/hero/oak-frame-top.webp'
import { FireGlow } from '@/components/hero/FireGlow'
import { GiantName } from '@/components/hero/GiantName'
import { HeroDoors, type HeroDoorsHandle } from '@/components/hero/HeroDoors'
import { HeroPeek } from '@/components/hero/HeroPeek'
import { PIECE_CLIPS } from '@/components/hero/heroPieces'
import { Button } from '@/components/ui/Button'
import { DropIn } from '@/components/ui/DropIn'
import { siteConfig } from '@/config/site'
import { QUOTE_PATH } from '@/data/navigation'
import { useHeroParallax } from '@/hooks/useHeroParallax'

/**
 * Hero de inicio. Capas con el MISMO lienzo (misma caja, imágenes recortadas igual):
 *   1. la sala completa, oscurecida (z-0)
 *   2. el nombre gigante (z-10)
 *   3. el mueble (z-20): en reposo, la foto tal cual. Con el scroll se queda quieto, se abren tres
 *      puertas y la estantería de roble sale como un cajón (HeroDoors), y la tele, recortada aparte,
 *      sale hacia delante (useHeroParallax)
 * Abajo: el botón principal y el lema.
 *
 * Variables (en la <section>):
 *   --name-top / --name-size  posición y tamaño del nombre
 *   --pt     distancia del lienzo al borde superior (solapa con la 2.ª línea del nombre)
 *   --gap    hueco bajo el mueble (en móvil deja sitio al botón y al lema)
 *   --vis    parte visible del lienzo: 0.98 = mueble entero; en escritorio 0.92 = cortado justo
 *            bajo la chimenea, para poder mostrarlo más grande
 *   --ch     alto del lienzo · --pw ancho (proporción 1656:1925; en móvil hasta 115 % de la pantalla)
 *   --shift  desplazamiento horizontal (móvil: alineado a la derecha; en escritorio la estantería monta un poco sobre la "Ó")
 */
const SCENE_VARS = [
  '[--name-top:max(5rem,calc(50svh-17rem))] md:[--name-top:6rem] xl:[--name-top:5.5rem] [--name-size:min(10.6vw,17svh)]',
  '[--pt:calc(var(--name-top)+var(--name-size)*1.4)] md:[--pt:calc(var(--name-top)+var(--name-size)*1)] xl:[--pt:calc(var(--name-top)+var(--name-size)*0.35)]',
  '[--gap:10rem] md:[--gap:7rem] xl:[--gap:0px]',
  '[--vis:0.98] xl:[--vis:0.92]',
  '[--ch:calc((100svh-var(--pt)-var(--gap))/var(--vis))]',
  // Móvil: el lienzo puede pasar del ancho (hasta 115 %). Si cabe, va centrado; si es más ancho, se desplaza
  // a la izquierda para que la estantería (termina al 99 % del lienzo) quede a 6px del borde derecho y lo que
  // se recorte sea el extremo izquierdo, el más lejano en la perspectiva.
  '[--pw:min(calc(var(--ch)*0.8603),115%)] md:[--pw:min(calc(var(--ch)*0.8603),100%)]',
  // Escritorio (xl): la estantería tapa SIEMPRE un poco (~15 % de su recuadro) del lado izquierdo de la "Ó", en
  // cualquier pantalla. La "Ó" empieza a 2,32 × tamaño de letra del centro (medido) y la estantería
  // acaba al 99 % del lienzo: shift = 2,49 × letra − 0,49 × ancho del lienzo (ajustado a ojo sobre capturas).
  // (Antes era 2vw fijo: en pantallas anchas tapaba cada vez más, hasta un cuarto de la "Ó".)
  '[--shift:min(0px,calc(50%-var(--pw)*0.49-6px))] md:[--shift:0px] xl:[--shift:calc(var(--name-size)*2.49_-_var(--pw)*0.49)]',
  // Móvil en horizontal (~390px de alto): dos columnas. Nombre, lema y botón a la izquierda; el mueble a
  // la derecha, a toda la altura bajo la barra, montando sobre el final del nombre (sigue "detrás").
  'phone-land:[--name-top:5rem]! phone-land:[--name-size:min(6.6vw,15svh)]!',
  'phone-land:[--pt:3.5rem]! phone-land:[--gap:0px]! phone-land:[--vis:0.98]!',
  'phone-land:[--pw:calc(var(--ch)*0.8603)]! phone-land:[--shift:min(15%,calc(50%-var(--pw)/2-1rem))]!',
].join(' ')

const CANVAS =
  'pointer-events-none absolute top-(--pt) left-[calc(50%-var(--pw)/2+var(--shift))] aspect-[1656/1925] w-(--pw) max-w-none select-none'

// Ancho real que ocupa el lienzo: ~50 % en escritorio, ~85 % en tableta, todo el ancho en móvil.
const SIZES = '(min-width: 1280px) 50vw, (min-width: 768px) 85vw, 100vw'
const PIECE_SRCSET = `${pieceSmall} 800w, ${pieceLarge} 1400w, ${pieceFull} 2000w`

const ALT =
  'Mueble de salón a medida hecho por la empresa: puertas lacadas en blanco con pantalla empotrada, estantería de roble y zócalo negro con chimenea'

export function Hero() {
  const doors = useRef<HeroDoorsHandle>(null)
  const bind = useHeroParallax(doors)

  /** Una pieza del mueble: la misma foto recortada por su junta. */
  const piece = (key: keyof typeof PIECE_CLIPS, extra?: ReactNode) => (
    <div ref={bind(key)} className="absolute inset-0 will-change-transform" style={{ clipPath: PIECE_CLIPS[key] }}>
      <img
        src={pieceFull}
        srcSet={PIECE_SRCSET}
        sizes={SIZES}
        width={1400}
        height={1627}
        alt={key === 'cabinet' ? ALT : ''}
        aria-hidden={key === 'cabinet' ? undefined : true}
        fetchPriority={key === 'cabinet' ? 'high' : undefined}
        draggable={false}
        className="size-full"
      />
      {extra}
    </div>
  )

  return (
    <section
      ref={bind('section')}
      aria-label="Presentación"
      className={`sticky top-0 isolate h-svh overflow-hidden bg-night text-white data-[covered=true]:**:[animation-play-state:paused] ${SCENE_VARS}`}
    >
      {/* 1. Sala oscurecida: solo en la mitad inferior, para que detrás del nombre quede negro limpio. */}
      <div ref={bind('room')} className={`${CANVAS} z-0 will-change-transform`}>
        <img
          src={roomLarge}
          srcSet={`${roomSmall} 800w, ${roomLarge} 1400w`}
          sizes={SIZES}
          alt=""
          aria-hidden="true"
          width={1400}
          height={1627}
          fetchPriority="low"
          className="size-full brightness-[0.32] saturate-[0.75] sepia-[0.2] [mask-image:radial-gradient(closest-side,#000_60%,transparent),linear-gradient(to_bottom,transparent_50%,#000_85%)] [mask-composite:intersect]"
        />
        {/* Bajo los enchufes, el recorte del mueble corta el zócalo algo más arriba de donde acaba en la foto, y
            ese trozo de zócalo (oscurecido aquí) quedaba como una franja negra recta entre el mueble y el suelo
            (12 px junto a la chimenea, 47 px al final; lienzo). La misma foto, subida justo esa altura (sube y se
            inclina: 12 px en x=800 → 47 px en x=1500), pone el suelo pegado al zócalo. Mismo tono y fundido. */}
        <div className="absolute inset-0 [clip-path:polygon(42.271%_85.091%,96.618%_96.416%,99.336%_96.935%,99.336%_100%,42.271%_100%)] [mask-image:linear-gradient(to_right,transparent_43%,#000_52%)]">
          <img
            src={roomLarge}
            srcSet={`${roomSmall} 800w, ${roomLarge} 1400w`}
            sizes={SIZES}
            alt=""
            aria-hidden="true"
            width={1400}
            height={1627}
            fetchPriority="low"
            className="size-full origin-top-left transform-[translateY(1.4545%)_skewY(-2.862deg)] brightness-[0.32] saturate-[0.75] sepia-[0.2] [mask-image:radial-gradient(closest-side,#000_60%,transparent),linear-gradient(to_bottom,transparent_50%,#000_85%)] [mask-composite:intersect]"
          />
        </div>
      </div>

      {/* 2. Nombre gigante. */}
      <div ref={bind('name')} className="absolute inset-x-0 top-(--name-top) z-10 origin-top px-4 text-center will-change-transform md:px-10 phone-land:origin-top-left! phone-land:px-6! phone-land:text-left!">
        <GiantName
          lineClassName="text-(length:--name-size) font-semibold leading-[0.88] tracking-[-0.02em] whitespace-nowrap text-name/55 [font-stretch:110%]"
          connectorClassName="font-serif font-normal italic text-name/68 [font-stretch:100%]"
        />
      </div>

      {/* 3. Mueble en piezas (de atrás a delante). */}
      <div ref={bind('group')} className={`${CANVAS} z-20 will-change-transform`}>
        {piece(
          'cabinet',
          <>
            <FireGlow />
            {/* Borde de arriba del mueble junto a su esquina derecha, que el recorte de la foto dejaba bajo
                (scripts/images/hero-oak-frame.mjs). Lienzo: x 1340–1655, y 0–200. */}
            <img
              src={oakFrameTop}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="absolute top-0 left-[80.918%] h-[10.39%] w-[19.022%] max-w-none"
            />
          </>,
        )}
        <HeroDoors ref={doors} photoSrc={pieceFull} photoSrcSet={PIECE_SRCSET} sizes={SIZES} />
        {piece('tv')}
      </div>

      {/* En escritorio el zócalo sigue por debajo del borde de la pantalla: fundido corto. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden h-16 bg-linear-to-t from-night to-transparent xl:block" />

      {/* Oscurecimiento mientras la página sube por encima. */}
      <div ref={bind('shade')} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 bg-night opacity-0" />

      {/* Hay más abajo: la hoja de Inicio asoma de vez en cuando (por debajo del botón y el lema). */}
      <HeroPeek />

      {/* Botón principal y lema. */}
      <div
        ref={bind('footer')}
        className="absolute inset-x-0 bottom-0 z-40 flex flex-col-reverse items-start gap-3 px-4 pb-8 sm:flex-row sm:items-end sm:justify-between sm:px-6 md:pb-10 lg:px-10 phone-land:right-auto! phone-land:flex-col-reverse! phone-land:items-start! phone-land:px-6! phone-land:pb-6!"
      >
        <DropIn order={3}>
          <Button to={QUOTE_PATH} tone="light" withArrow>
            Pedir presupuesto
          </Button>
        </DropIn>
        <DropIn as="p" order={4} className="font-serif text-3xl text-name/85 italic sm:text-4xl phone-land:text-3xl!">
          {siteConfig.lema}
        </DropIn>
      </div>
    </section>
  )
}
