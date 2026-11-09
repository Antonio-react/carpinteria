import { useEffect, useRef, type RefObject } from 'react'
import type { HeroDoorsHandle } from '@/components/hero/HeroDoors'
import { OPEN_COMPLETE, OVER_TV_RIGHT_OPEN } from '@/components/hero/heroDoorsChoreography'

/** Capas del hero que se mueven con el scroll. */
export interface HeroLayers {
  section: HTMLElement | null
  room: HTMLElement | null
  name: HTMLElement | null
  group: HTMLElement | null
  cabinet: HTMLElement | null
  tv: HTMLElement | null
  footer: HTMLElement | null
  shade: HTMLElement | null
}

/** Alto de pantalla de scroll que dura la apertura del mueble (progreso 0 → 1 de las puertas). */
export const OPEN_SCREENS = 0.75

/** Pausa (en progreso) con el mueble ya abierto, para verlo entero antes de que suba la cortina. */
const OPEN_PAUSE = 0.12

/**
 * Scroll (en pantallas) a partir del cual el contenido de Inicio sube por encima del hero (es el alto
 * del espaciador de HomePage):
 *   - escritorio: con el mueble abierto del todo, más una pequeña pausa (≈ 0,88), para que se vea entero;
 *   - móvil (vertical, o apaisado bajo): cuando la puerta derecha de encima de la tele termina de abrirse
 *     (≈ 0,69). Antes subía con esa puerta a medio abrir (≈ 0,5) y, con un tirón rápido del dedo, la
 *     página tapaba el mueble antes de verlo. Lo que quede de apertura se ve mientras sube.
 */
export const CURTAIN_SCREENS = (OPEN_COMPLETE + OPEN_PAUSE) * OPEN_SCREENS
export const CURTAIN_SCREENS_MOBILE = OVER_TV_RIGHT_OPEN * OPEN_SCREENS

/**
 * Tiempo mínimo (s) que tarda la apertura completa del mueble. Con un scroll normal se va más
 * despacio que esto y la animación sigue al dedo/rueda sin retraso; con un golpe rápido de rueda o un
 * tirón en el móvil, la apertura no salta de golpe: va por detrás del scroll a esta velocidad máxima y
 * se pone al día sola. (No frena la página: el scroll del usuario nunca se toca.)
 */
const MIN_OPEN_SECONDS = 0.7

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
const EMPTY: HeroLayers = { section: null, room: null, name: null, group: null, cabinet: null, tv: null, footer: null, shade: null }

/**
 * "Desmontaje" del hero con el scroll, como un plano de montaje que se abre:
 *   1) Apertura (0,75 pantallas de scroll, con el hero fijo): el mueble se queda
 *      quieto y se abren algunas de sus puertas, la estantería de roble sale como un cajón (ver
 *      HeroDoors). La tele se queda en su sitio. El nombre se encoge y se apaga: sensación de
 *      alejarse del título.
 *   2) Cortina: con el mueble ya abierto del todo (y una pequeña pausa), el contenido claro sube por
 *      encima mientras el hero se oscurece.
 * Una vez que la cortina tapa el hero ENTERO, el mueble se vuelve a montar por detrás (sin que se
 * vea): al subir de nuevo, el hero aparece montado. Al llegar arriba del todo se "rearma" y, si se
 * vuelve a bajar, la secuencia empieza otra vez. "Tapado" se mide por la posición REAL de la cortina:
 * con una fórmula aparte no coincidía en móvil (la barra del navegador cambia el alto de la pantalla)
 * y allí no llegaba a rearmarse.
 * Solo transform y opacity, escritos directamente en el DOM (sin re-renders).
 * Con prefers-reduced-motion: sin desplazamientos (el espaciador también desaparece).
 * Cuando el hero queda tapado, pausa sus animaciones (brasas) con data-covered.
 */
export function useHeroParallax(doors?: RefObject<HeroDoorsHandle | null>) {
  const layers = useRef<HeroLayers>({ ...EMPTY })

  /** Devuelve el ref de una capa: <div ref={bind('room')}>. */
  const bind = (key: keyof HeroLayers) => (node: HTMLElement | null) => {
    layers.current[key] = node
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    // true desde que la cortina ha tapado el hero entero hasta que se vuelve arriba del todo.
    let assembled = false
    // Scroll "mostrado": persigue a window.scrollY con velocidad limitada (ver MIN_OPEN_SECONDS).
    let shown = window.scrollY
    let lastTime = 0

    const set = (element: HTMLElement | null, transform: string, opacity?: number) => {
      if (!element) return
      element.style.transform = transform
      if (opacity !== undefined) element.style.opacity = String(opacity)
    }

    const update = (time: number = performance.now()) => {
      frame = 0
      const l = layers.current
      const vh = window.innerHeight
      const real = window.scrollY
      // Segundos desde el fotograma anterior (con tope: tras una pestaña en segundo plano no da un salto).
      // Primer fotograma tras estar quieto: se cuenta como uno normal (1/60 s).
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60
      lastTime = time

      if (reduced.matches) {
        const scroll = real
        shown = real
        for (const key of ['room', 'name', 'group', 'cabinet', 'tv'] as const) set(l[key], '')
        doors?.current?.update(0)
        if (l.footer) l.footer.style.opacity = String(clamp(1 - (scroll / vh) * 2.5))
        if (l.shade) l.shade.style.opacity = String(clamp((scroll / vh) * 0.9))
        if (l.section) l.section.dataset.covered = scroll >= vh ? 'true' : 'false'
        return
      }

      // Cortina 0 → 1, medida sobre su posición real (vale para el espaciador de escritorio y el de móvil,
      // y no depende de que svh e innerHeight coincidan).
      const curtain = document.querySelector<HTMLElement>('[data-curtain]')
      const cover = curtain ? clamp(1 - curtain.getBoundingClientRect().top / vh) : 0
      if (cover >= 0.99) assembled = true // hero tapado del todo: se monta sin que se vea
      else if (real < 4) assembled = false // arriba del todo: vuelve a empezar la secuencia

      // Avance limitado del scroll mostrado. Montado (hero tapado o recién rearmado) no hay nada que
      // animar: se iguala al real para que la siguiente apertura empiece desde donde está la página.
      const maxStep = ((vh * OPEN_SCREENS) / MIN_OPEN_SECONDS) * dt
      if (assembled) shown = real
      else shown += Math.max(-maxStep, Math.min(maxStep, real - shown))
      const scroll = shown

      // Montado: todo en reposo (e = 0, p = 0); la cortina sigue oscureciendo con "shade".
      const e = assembled ? 0 : clamp(scroll / (vh * OPEN_SCREENS)) // apertura 0 → 1
      const ease = 1 - (1 - e) * (1 - e) // ease-out: arranca rápido, se asienta al final
      // Mientras sube la cortina el despiece NO se congela: sigue abriéndose, a ~1/4 de velocidad.
      const p = assembled ? 0 : ease + cover * 0.25

      // Se encoge desde su borde superior (origin-top): se aleja sin meterse bajo la barra.
      set(l.name, `scale(${(1 - p * 0.16).toFixed(4)})`, assembled ? 1 : 1 - ease * 0.65 - cover * 0.35)
      const group = `scale(${(1 + p * 0.03).toFixed(4)})`
      set(l.group, group)
      // El mueble (y la tele) se quedan quietos: lo que se mueve son las puertas y la estantería de roble.
      // Avance LINEAL con el scroll (no con la curva "ease" del resto, que arranca muy rápido: con muy
      // poco scroll la primera puerta ya estaba abierta). Cada puerta suaviza su propio movimiento.
      // (Sin tope en 1: las últimas puertas terminan cuando la cortina ya está subiendo.)
      doors?.current?.update(assembled ? 0 : scroll / (vh * OPEN_SCREENS))
      // La sala (solo se ve su mitad inferior: el suelo) va pegada al mueble (mismo lienzo y el mismo
      // acercamiento del grupo). Se va oscureciendo.
      set(l.room, group, 1 - ease * 0.6)
      if (l.footer) {
        l.footer.style.opacity = String(clamp(1 - e * 2.5))
        // Baja hacia el borde de la pantalla mientras se apaga (opacidad 0 en e = 0,4 → ~40 px abajo).
        l.footer.style.transform = `translate3d(0, ${(e * 100).toFixed(1)}px, 0)`
      }
      if (l.shade) l.shade.style.opacity = String(clamp(cover * 0.9))
      if (l.section) l.section.dataset.covered = cover >= 0.99 ? 'true' : 'false'

      // Aún no ha alcanzado al scroll real: sigue animando aunque ya no lleguen eventos de scroll.
      if (Math.abs(real - shown) > 0.5) frame = requestAnimationFrame(update)
      else lastTime = 0
    }

    const request = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    reduced.addEventListener('change', request)
    return () => {
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
      reduced.removeEventListener('change', request)
      cancelAnimationFrame(frame)
    }
  }, [doors])

  return bind
}
