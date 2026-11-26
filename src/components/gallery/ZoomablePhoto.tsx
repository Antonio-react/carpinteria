import { useImperativeHandle, useRef, useState, type MouseEvent, type PointerEvent, type Ref, type WheelEvent } from 'react'
import type { GalleryPhoto } from '@/data/categories'

/** Zoom máximo con la versión de detalle (NN-zoom.webp, 3200 px) y sin ella (solo la de 1600 px, que más allá se ve pixelada). */
const MAX_ZOOM_DETAIL = 3
const MAX_ZOOM_BASIC = 2.5
const DOUBLE_TAP_MS = 300
const DOUBLE_TAP_DISTANCE = 30
const WHEEL_STEP = 0.0015

export interface ZoomablePhotoHandle {
  /** Amplía al máximo (centrado) o vuelve al tamaño normal. Para el botón de la lupa. */
  toggle: () => void
}

interface ZoomablePhotoProps {
  photo: GalleryPhoto
  /** Avisa al visor de si la foto está ampliada (para el botón de la lupa). */
  onZoomChange: (zoomed: boolean) => void
  /** Empieza un gesto de zoom con dos dedos: el visor cancela su deslizamiento de "pasar foto". */
  onGestureStart: () => void
  ref?: Ref<ZoomablePhotoHandle>
}

interface View {
  scale: number
  x: number
  y: number
}

const NORMAL: View = { scale: 1, x: 0, y: 0 }

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Foto del visor que se puede ampliar (hasta ×3) sin salirse de su marco:
 * - Ratón: clic para ampliar justo donde se pincha (otro clic, tamaño normal); ampliada, la foto sigue
 *   al ratón para recorrerla. La rueda amplía y reduce poco a poco (dentro del visor la página no se mueve).
 * - Dedos: pellizco para ampliar, arrastrar para moverse, doble toque para ampliar o volver.
 *   Mientras está ampliada, los gestos de un dedo mueven la foto y no pasan de foto.
 * Al ampliar por primera vez se descarga la versión de detalle (srcZoom) y, ya decodificada, sustituye a
 * la de 1600 px sin salto: si nadie amplía, no se descarga nunca.
 * Al cambiar de foto el visor crea este componente de nuevo (key), así que el zoom vuelve a ×1 solo.
 */
export function ZoomablePhoto({ photo, onZoomChange, onGestureStart, ref }: ZoomablePhotoProps) {
  const frame = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>(NORMAL)
  const [dragging, setDragging] = useState(false)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ view: View; distance: number; midX: number; midY: number; x: number; y: number } | null>(null)
  const zoomGesture = useRef(false) // el gesto actual es de zoom/mover: no debe llegar al deslizamiento del visor
  const lastTap = useRef<{ time: number; x: number; y: number } | null>(null)
  const maxZoom = photo.srcZoom ? MAX_ZOOM_DETAIL : MAX_ZOOM_BASIC
  const [detailSrc, setDetailSrc] = useState<string | null>(null)
  const detailRequested = useRef(false)

  /** Descarga la versión de detalle la primera vez que se amplía (y la pone cuando ya está decodificada). */
  const loadDetail = () => {
    const zoomSrc = photo.srcZoom
    if (!zoomSrc || detailRequested.current) return
    detailRequested.current = true
    const image = new Image()
    image.src = zoomSrc
    image
      .decode()
      .then(() => setDetailSrc(zoomSrc))
      .catch(() => undefined) // si falla, se queda la de 1600 px
  }

  /** Medidas del marco (la foto a ×1) y posición de un punto respecto a su centro. */
  const measure = (clientX: number, clientY: number) => {
    const rect = frame.current?.getBoundingClientRect()
    if (!rect) return { w: 0, h: 0, px: 0, py: 0 }
    return { w: rect.width, h: rect.height, px: clientX - (rect.left + rect.width / 2), py: clientY - (rect.top + rect.height / 2) }
  }

  /** Mantiene la foto dentro de su marco: a ×s, el desplazamiento máximo es (s − 1) × medio lado. */
  const bounded = (next: View, w: number, h: number): View => {
    const scale = clamp(next.scale, 1, maxZoom)
    const maxX = ((scale - 1) * w) / 2
    const maxY = ((scale - 1) * h) / 2
    return { scale, x: clamp(next.x, -maxX, maxX), y: clamp(next.y, -maxY, maxY) }
  }

  const apply = (next: View) => {
    if (next.scale > 1) loadDetail()
    setView(next)
    onZoomChange(next.scale > 1)
  }

  /** Ampliada siguiendo un punto: la zona bajo el cursor (o el dedo) se ve en el centro de la ampliación. */
  const zoomAt = (scale: number, clientX: number, clientY: number) => {
    const { w, h, px, py } = measure(clientX, clientY)
    apply(bounded({ scale, x: -px * (scale - 1), y: -py * (scale - 1) }, w, h))
  }

  useImperativeHandle(ref, () => ({
    toggle: () => {
      if (view.scale > 1) apply(NORMAL)
      else apply({ scale: maxZoom, x: 0, y: 0 })
    },
  }))

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return // el ratón va con clic, movimiento y rueda
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    event.currentTarget.setPointerCapture(event.pointerId)

    if (pointers.current.size === 2) {
      // Pellizco: el visor deja de contar esto como "deslizar para pasar de foto".
      onGestureStart()
      zoomGesture.current = true
      const [a, b] = [...pointers.current.values()]
      gesture.current = { view, distance: Math.hypot(b.x - a.x, b.y - a.y), midX: (a.x + b.x) / 2, midY: (a.y + b.y) / 2, x: 0, y: 0 }
    } else if (pointers.current.size === 1 && view.scale > 1) {
      // Ampliada: un dedo mueve la foto.
      zoomGesture.current = true
      gesture.current = { view, distance: 0, midX: 0, midY: 0, x: event.clientX, y: event.clientY }
    } else {
      zoomGesture.current = false
    }
    if (zoomGesture.current) {
      event.stopPropagation()
      setDragging(true)
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') {
      // Ampliada con el ratón: la foto sigue al cursor.
      if (view.scale > 1) zoomAt(view.scale, event.clientX, event.clientY)
      return
    }
    if (!pointers.current.has(event.pointerId)) return
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    const start = gesture.current
    if (!start) return
    const { w, h } = measure(0, 0)

    if (pointers.current.size >= 2 && start.distance > 0) {
      const [a, b] = [...pointers.current.values()]
      const scale = clamp((start.view.scale * Math.hypot(b.x - a.x, b.y - a.y)) / start.distance, 1, maxZoom)
      // El punto entre los dos dedos se queda debajo de ellos mientras se amplía.
      const anchor = measure(start.midX, start.midY)
      const mid = measure((a.x + b.x) / 2, (a.y + b.y) / 2)
      const ratio = scale / start.view.scale
      apply(bounded({ scale, x: mid.px - (anchor.px - start.view.x) * ratio, y: mid.py - (anchor.py - start.view.y) * ratio }, w, h))
    } else if (pointers.current.size === 1 && start.distance === 0) {
      apply(bounded({ ...start.view, x: start.view.x + event.clientX - start.x, y: start.view.y + event.clientY - start.y }, w, h))
    }
  }

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' || !pointers.current.has(event.pointerId)) return
    pointers.current.delete(event.pointerId)
    if (zoomGesture.current) event.stopPropagation()

    if (pointers.current.size === 1) {
      // De dos dedos a uno: se sigue moviendo la foto desde donde está.
      const [rest] = [...pointers.current.values()]
      gesture.current = view.scale > 1 ? { view, distance: 0, midX: 0, midY: 0, x: rest.x, y: rest.y } : null
      return
    }
    if (pointers.current.size > 0) return
    gesture.current = null
    setDragging(false)

    // Doble toque: amplía donde se toca, o vuelve al tamaño normal.
    if (event.type === 'pointerup') {
      const now = performance.now()
      const previous = lastTap.current
      if (previous && now - previous.time < DOUBLE_TAP_MS && Math.hypot(event.clientX - previous.x, event.clientY - previous.y) < DOUBLE_TAP_DISTANCE) {
        lastTap.current = null
        if (view.scale > 1) apply(NORMAL)
        else zoomAt(maxZoom, event.clientX, event.clientY)
      } else {
        lastTap.current = { time: now, x: event.clientX, y: event.clientY }
      }
    }
    zoomGesture.current = false
  }

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    // Solo ratón (en táctil, el zoom es con doble toque y pellizco).
    if (event.nativeEvent instanceof globalThis.PointerEvent && event.nativeEvent.pointerType !== 'mouse') return
    if (view.scale > 1) apply(NORMAL)
    else zoomAt(maxZoom, event.clientX, event.clientY)
  }

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    const scale = clamp(view.scale * (1 - event.deltaY * WHEEL_STEP), 1, maxZoom)
    zoomAt(scale, event.clientX, event.clientY)
  }

  const zoomed = view.scale > 1
  return (
    <div
      ref={frame}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClick={onClick}
      onWheel={onWheel}
      className={`relative max-w-full touch-none overflow-hidden rounded-xl shadow-[0_30px_80px_-20px_rgb(0_0_0/0.7)] motion-safe:animate-rise ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
    >
      <img
        src={detailSrc ?? photo.srcLarge ?? photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        draggable={false}
        style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
        className={`block max-h-[calc(100dvh-8.5rem)] max-w-full object-contain will-change-transform ${dragging ? '' : 'transition-transform duration-200 ease-out motion-reduce:transition-none'}`}
      />
    </div>
  )
}
