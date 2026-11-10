import { useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react'
import oakSide from '@/assets/hero/oak-side.webp'
import {
  CABINET,
  CANVAS_WIDTH,
  doorPose,
  homography,
  project,
  projectQuad,
  quadClipPath,
  rectQuad,
  toMatrix3d,
  type Hinge,
  type Panel,
  type Point,
  type Quad,
} from '@/components/hero/doorGeometry'
import { DOORS, OAK_SPAN, OAK_START, OAK_TRAVEL, OAK_WIDE_MEDIA, RAIL, type Door } from '@/components/hero/heroDoorsChoreography'

export interface HeroDoorsHandle {
  /** progress: 0 = mueble cerrado; 1 = todo abierto y la estantería fuera. */
  update: (progress: number) => void
}

interface HeroDoorsProps {
  ref: Ref<HeroDoorsHandle>
  /** La foto del mueble (misma que la capa de debajo): las puertas son recortes de ella. */
  photoSrc: string
  photoSrcSet: string
  sizes: string
}

const OAK_TEXTURE = { width: 110, height: 380 }
/** Se consulta en cada fotograma (.matches): sigue al instante si se gira o redimensiona la pantalla. */
const wideScreen = window.matchMedia(OAK_WIDE_MEDIA)

/** Cara interior lacada de una hoja: en sombra, con las cazoletas de las bisagras junto al canto de giro. */
const BACK_FACE: Record<Hinge, string> = {
  left: 'bg-[radial-gradient(circle_at_6%_9%,#a19e99_0_1.3%,transparent_1.7%),radial-gradient(circle_at_6%_37%,#a19e99_0_1.3%,transparent_1.7%),radial-gradient(circle_at_6%_64%,#a19e99_0_1.3%,transparent_1.7%),radial-gradient(circle_at_6%_91%,#a19e99_0_1.3%,transparent_1.7%),linear-gradient(to_right,#a9a8a4,#c4c3bf)]',
  right: 'bg-[radial-gradient(circle_at_94%_15%,#a19e99_0_1.3%,transparent_1.7%),radial-gradient(circle_at_94%_85%,#a19e99_0_1.3%,transparent_1.7%),linear-gradient(to_left,#a9a8a4,#c4c3bf)]',
  bottom: 'bg-[linear-gradient(to_top,#8f8d89,#aaa8a4)]', // abatibles (ahora no se usa ninguna)
}
const BACK_WIDTH = 400

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
/** Suave todo el rato: arranca y frena despacio, sin tirones (curva seno). */
const easeSmooth = (t: number) => (1 - Math.cos(Math.PI * t)) / 2
/**
 * Mover + escalar (igual en los dos ejes) que mejor lleva los puntos `from` a `to` (mínimos cuadrados).
 * Nunca deforma: conserva ángulos y proporciones.
 */
function similarity(from: readonly Point[], to: readonly Point[]) {
  const n = from.length
  const mean = (pts: readonly Point[]) => pts.reduce(([sx, sy], [x, y]) => [sx + x / n, sy + y / n], [0, 0])
  const [fx, fy] = mean(from)
  const [ox, oy] = mean(to)
  let dot = 0
  let norm = 0
  from.forEach(([x, y], i) => {
    dot += (x - fx) * (to[i][0] - ox) + (y - fy) * (to[i][1] - oy)
    norm += (x - fx) ** 2 + (y - fy) ** 2
  })
  const scale = dot / norm
  return { scale, tx: ox - scale * fx, ty: oy - scale * fy }
}
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const scaleQuad = (quad: Quad, k: number): Quad => quad.map(([x, y]) => [x * k, y * k] as const) as unknown as Quad
const backHeight = ({ left, right, top, bottom }: Panel) => Math.round((BACK_WIDTH * (bottom - top)) / (right - left))
/** Hoja de la puerta: el hueco menos el recorte (trim) de cada lado. */
const leaf = ({ panel, trim = {} }: Door): Panel => ({
  left: panel.left + (trim.left ?? 0),
  right: panel.right - (trim.right ?? 0),
  top: panel.top + (trim.top ?? 0),
  bottom: panel.bottom - (trim.bottom ?? 0),
})
/** Canto de detrás de la estantería de roble (lienzo): 8 px de ancho junto al cerco blanco. */
const OAK_BACK_EDGE: Quad = [
  [CABINET.oak.image[1][0] - 8, CABINET.oak.image[1][1]],
  CABINET.oak.image[1],
  CABINET.oak.image[2],
  [CABINET.oak.image[2][0] - 8, CABINET.oak.image[2][1]],
]
const restQuad = (door: Door) => projectQuad(doorPose(leaf(door), door.hinge, 0).front)
/** Hueco del interior: el de la puerta, alargado `bleed` por el lado del canto libre. */
const insideQuad = ({ panel, hinge, inside }: Door) => {
  const bleed = inside.bleed ?? 0
  const sides = hinge === 'left' ? { ...panel, right: panel.right + bleed } : hinge === 'right' ? { ...panel, left: panel.left - bleed } : panel
  // Y por abajo, por detrás de la tele (que se pinta encima): así no queda a la vista la junta oscura
  // entre la puerta y el marco de la tele de la foto, que al levantarse la puerta asomaba como una raya.
  const grown = { ...sides, bottom: sides.bottom + bleed }
  return projectQuad(doorPose(grown, hinge, 0).front)
}

/**
 * Puertas que se abren y estantería de roble que sale, encima de la foto del mueble.
 * No usa rotateY + perspective de CSS: cada cara es un elemento plano con una homografía (matrix3d)
 * calculada con la cámara reconstruida de la foto (doorGeometry), así la perspectiva coincide con la
 * de la imagen. Todo se escribe en el DOM en update(), sin re-renders. Decorativo: aria-hidden.
 */
export function HeroDoors({ ref, photoSrc, photoSrcSet, sizes }: HeroDoorsProps) {
  const root = useRef<HTMLDivElement>(null)
  // Mapa estable (se crea una vez) con los nodos de cada cara; no es estado de render.
  const [nodes] = useState(() => new Map<string, HTMLElement>())
  const bind = (key: string) => (node: HTMLElement | null) => {
    if (node) nodes.set(key, node)
    else nodes.delete(key)
  }

  useImperativeHandle(ref, () => ({
    update(progress: number) {
      const width = root.current?.offsetWidth
      if (!width) return
      const k = width / CANVAS_WIDTH
      const show = (key: string, visible: boolean) => {
        const node = nodes.get(key)
        if (node) node.style.visibility = visible ? 'visible' : 'hidden'
      }
      /** Coloca un elemento (su rectángulo `from`, en px) sobre un cuadrilátero del lienzo. */
      const place = (key: string, from: Quad, to: Quad) => {
        const node = nodes.get(key)
        if (node) node.style.transform = toMatrix3d(homography(from, scaleQuad(to, k)))
      }

      DOORS.forEach((door, i) => {
        const t = easeInOut(clamp((progress - door.start) / door.span))
        const open = t > 0.002
        const degrees = door.angle * t
        const pose = doorPose(leaf(door), door.hinge, degrees)
        const rest = restQuad(door)

        show(`inside-${i}`, open)
        show(`rail-top-${i}`, open && door.rails.top)
        show(`rail-bottom-${i}`, open && door.rails.bottom)
        show(`front-${i}`, open && pose.frontVisible)
        show(`back-${i}`, open && !pose.frontVisible)
        show(`edge-${i}`, open && pose.edgeVisible)
        if (!open) return

        place(`inside-${i}`, rectQuad(door.inside.width, door.inside.height), insideQuad(door))
        const { left, right, top, bottom } = door.panel
        const strip = (y0: number, y1: number) => projectQuad([[left, y0, 0], [right, y0, 0], [right, y1, 0], [left, y1, 0]])
        if (door.rails.top) place(`rail-top-${i}`, rectQuad(100, 10), strip(top, top + RAIL))
        if (door.rails.bottom) place(`rail-bottom-${i}`, rectQuad(100, 10), strip(bottom - RAIL, bottom))
        if (pose.frontVisible) {
          place(`front-${i}`, scaleQuad(rest, k), projectQuad(pose.front))
          // Al girar, la cara deja de mirar a la luz de la ventana: se oscurece un poco.
          const shade = nodes.get(`front-shade-${i}`)
          if (shade) shade.style.opacity = String(0.28 * Math.sin((degrees * Math.PI) / 180))
        } else {
          place(`back-${i}`, rectQuad(BACK_WIDTH, backHeight(door.panel)), projectQuad(pose.back))
        }
        if (pose.edgeVisible) place(`edge-${i}`, rectQuad(10, 100), projectQuad(pose.edge))
      })

      // Estantería de roble: sale por el extremo del mueble como un cajón del que tira alguien, con un
      // movimiento suave de principio a fin. El cerco blanco es del mueble y no se toca.
      // Sin deformarla: la estantería no es plana (fondo, baldas y suelo a distintas profundidades) y
      // moverla con la perspectiva de un plano la deformaba. Se usa la transformación "rígida" (mover +
      // escalar por igual en alto y ancho) que mejor sigue a sus 4 esquinas al salir d metros: así se
      // acerca a quien tira (crece un poco) sin estirarse.
      const travel = wideScreen.matches ? OAK_TRAVEL.wide : OAK_TRAVEL.mobile
      const d = travel * easeSmooth(clamp((progress - OAK_START) / OAK_SPAN))
      const out = d > 0.0005
      show('oak-hole', out)
      show('oak-side', out)
      show('oak-face', out)
      if (!out) return
      const from = CABINET.oak.face.map(project)
      const to = CABINET.oak.face.map(([x, y, z]) => project([x + d, y, z]))
      const { scale, tx, ty } = similarity(from, to)
      const move = ([x, y]: Point): Point => [x * scale + tx, y * scale + ty]
      const [frontTop, , , frontBottom] = CABINET.oak.image
      // 1) Hueco que deja, oscuro; 2) costado de roble entre donde estaba y donde está; 3) la estantería.
      place('oak-hole', rectQuad(100, 100), CABINET.oak.image)
      place('oak-side', rectQuad(OAK_TEXTURE.width, OAK_TEXTURE.height), [frontTop, move(frontTop), move(frontBottom), frontBottom])
      const face = nodes.get('oak-face')
      if (face) face.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${(tx * k).toFixed(2)}, ${(ty * k).toFixed(2)})`
    },
  }))

  const hidden = { visibility: 'hidden' as const, transformOrigin: '0 0' }

  /** Recorte de la foto (mismo lienzo), que luego se deforma a su nueva posición. */
  const photoCut = (key: string, quad: Quad, overlay?: ReactNode) => (
    <div key={key} ref={bind(key)} className="absolute inset-0 will-change-transform" style={{ ...hidden, clipPath: quadClipPath(quad) }}>
      <img src={photoSrc} srcSet={photoSrcSet} sizes={sizes} alt="" draggable={false} className="size-full" />
      {overlay}
    </div>
  )

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* 1. Interiores (detrás de todo lo que se mueve). */}
      {DOORS.map((door, i) => (
        <div
          key={`inside-${i}`}
          ref={bind(`inside-${i}`)}
          className="absolute top-0 left-0 will-change-transform"
          style={{ ...hidden, width: door.inside.width, height: door.inside.height }}
        >
          <img src={door.inside.src} alt="" draggable={false} className={`size-full ${door.inside.mirror ? "-scale-x-100" : ""}`} />
          {/* Sombra de dentro del mueble: más oscuro arriba (bajo la tapa) y en los bordes. */}
          {/* Sin sombra de borde en los interiores que se solapan (bleed): sumadas, formaban una raya gris. */}
          <div
            className={`absolute inset-0 bg-[linear-gradient(to_bottom,rgb(15_13_11/0.32),rgb(15_13_11/0.08)_30%,rgb(15_13_11/0.12))] ${door.inside.bleed ? "" : "shadow-[inset_0_0_24px_rgb(15_13_11/0.22)]"}`}
          />
        </div>
      ))}

      {/* Cantos de los huecos (encima de los interiores, debajo de las hojas). */}
      {DOORS.map((door, i) => [
        <div
          key={`rail-top-${i}`}
          ref={bind(`rail-top-${i}`)}
          className="absolute top-0 left-0 h-[10px] w-[100px] will-change-transform"
          style={{ ...hidden, background: `linear-gradient(to bottom, ${door.rails.color} 70%, rgb(15 13 11 / 0.35))` }}
        />,
        <div
          key={`rail-bottom-${i}`}
          ref={bind(`rail-bottom-${i}`)}
          className="absolute top-0 left-0 h-[10px] w-[100px] will-change-transform"
          style={{ ...hidden, background: `linear-gradient(to top, ${door.rails.color} 70%, rgb(15 13 11 / 0.25))` }}
        />,
      ])}

      {/* 2. Hojas: frente (recorte de la foto), cara interior y canto. De la más lejana a la más cercana. */}
      {DOORS.map((door, i) => [
        photoCut(`front-${i}`, restQuad(door), <div ref={bind(`front-shade-${i}`)} className="absolute inset-0 bg-night opacity-0" />),
        <div
          key={`back-${i}`}
          ref={bind(`back-${i}`)}
          className={`absolute top-0 left-0 bg-[#b9b8b5] will-change-transform ${BACK_FACE[door.hinge]}`}
          style={{ ...hidden, width: BACK_WIDTH, height: backHeight(door.panel) }}
        />,
        <div key={`edge-${i}`} ref={bind(`edge-${i}`)} className="absolute top-0 left-0 h-[100px] w-[10px] bg-[#c9c6c0] will-change-transform" style={hidden} />,
      ])}

      {/* 3. Estantería de roble: el hueco que deja, el costado que aparece al salir y la estantería. */}
      <div
        ref={bind('oak-hole')}
        className="absolute top-0 left-0 size-[100px] bg-[radial-gradient(120%_90%_at_30%_50%,#2a1d13,#120d09)] will-change-transform"
        style={hidden}
      />
      <div
        ref={bind('oak-side')}
        className="absolute top-0 left-0 will-change-transform"
        style={{ ...hidden, width: OAK_TEXTURE.width, height: OAK_TEXTURE.height }}
      >
        <img src={oakSide} alt="" draggable={false} className="size-full" />
        {/* Luz: más sombra junto al mueble (de donde sale) y hacia abajo, como el resto de la foto. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(15_13_11/0.35),rgb(15_13_11/0.05)_60%,rgb(15_13_11/0.15)),linear-gradient(to_bottom,transparent_40%,rgb(15_13_11/0.25))]" />
      </div>
      {photoCut(
        'oak-face',
        CABINET.oak.image,
        // Canto de roble de detrás: en la foto mide ~8 px abajo, ~4 a media altura y desaparece arriba (por la
        // perspectiva). Al salir, la estantería se ve más de frente: se pinta del mismo grosor en toda la altura
        // (color medido en el canto real de abajo, 129,96,74). Va dentro del recorte: se mueve con ella.
        <div
          className="absolute inset-0 bg-[rgb(129_96_74)]"
          style={{ clipPath: quadClipPath(OAK_BACK_EDGE) }}
        />,
      )}
    </div>
  )
}
