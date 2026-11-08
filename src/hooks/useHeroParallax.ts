import { useEffect, useRef } from 'react'

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

/** Parte del alto de pantalla que dura el despiece (coincide con el espaciador de HomePage: 75svh). */
export const EXPLODE_SCREENS = 0.75

const clamp = (value: number) => Math.min(Math.max(value, 0), 1)
const EMPTY: HeroLayers = { section: null, room: null, name: null, group: null, cabinet: null, tv: null, footer: null, shade: null }

/**
 * "Desmontaje" del hero con el scroll, como un plano de montaje que se abre:
 *   1) Despiece en 2 piezas (primer 75 % de pantalla, con el hero fijo y a la vista):
 *      el mueble entero (con la chimenea) se aleja: se encoge un poco y se aparta a la derecha y
 *      arriba; la tele sale con fuerza hacia delante y a la izquierda, dejando su hueco. El nombre
 *      se encoge y se apaga: sensación de alejarse del título.
 *   2) Cortina: el contenido claro sube por encima mientras el hero se oscurece.
 * Una vez que la cortina tapa el hero ENTERO, el mueble se vuelve a montar por detrás (sin que se
 * vea): al subir de nuevo, el hero aparece montado, sin el efecto al revés. Al llegar arriba del
 * todo se "rearma" y, si se vuelve a bajar, se desmonta otra vez.
 * Solo transform y opacity, escritos directamente en el DOM (sin re-renders).
 * Con prefers-reduced-motion: sin desplazamientos (el espaciador también desaparece).
 * Cuando el hero queda tapado, pausa sus animaciones (brasas) con data-covered.
 */
export function useHeroParallax() {
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

    const set = (element: HTMLElement | null, transform: string, opacity?: number) => {
      if (!element) return
      element.style.transform = transform
      if (opacity !== undefined) element.style.opacity = String(opacity)
    }

    const update = () => {
      frame = 0
      const l = layers.current
      const vh = window.innerHeight
      const vw = window.innerWidth
      const scroll = window.scrollY

      if (reduced.matches) {
        for (const key of ['room', 'name', 'group', 'cabinet', 'tv'] as const) set(l[key], '')
        if (l.footer) l.footer.style.opacity = String(clamp(1 - (scroll / vh) * 2.5))
        if (l.shade) l.shade.style.opacity = String(clamp((scroll / vh) * 0.9))
        if (l.section) l.section.dataset.covered = scroll >= vh ? 'true' : 'false'
        return
      }

      const cover = clamp((scroll - vh * EXPLODE_SCREENS) / vh) // cortina 0 → 1
      if (cover >= 0.99) assembled = true // hero tapado del todo: se monta sin que se vea
      else if (scroll < 4) assembled = false // arriba del todo: se rearma el efecto

      // Montado: todo en reposo (e = 0, p = 0); la cortina sigue oscureciendo con "shade".
      const e = assembled ? 0 : clamp(scroll / (vh * EXPLODE_SCREENS)) // despiece 0 → 1
      const ease = 1 - (1 - e) * (1 - e) // ease-out: arranca rápido, se asienta al final
      // Mientras sube la cortina el despiece NO se congela: sigue abriéndose, a ~1/4 de velocidad.
      const p = assembled ? 0 : ease + cover * 0.25
      const narrow = vw < 768

      // Se encoge desde su borde superior (origin-top): se aleja sin meterse bajo la barra.
      set(l.name, `scale(${(1 - p * 0.16).toFixed(4)})`, assembled ? 1 : 1 - ease * 0.65 - cover * 0.35)
      const group = `scale(${(1 + p * 0.03).toFixed(4)})`
      set(l.group, group)
      // Mueble entero: se aleja (más pequeño), a la derecha y arriba. En móvil se desplaza menos:
      // está alineado al borde derecho y al encogerse ya gana el margen que pierde al moverse.
      const cabinet = `translate3d(${(p * (narrow ? 0.015 : 0.04) * vw).toFixed(1)}px, ${(-p * 0.03 * vh).toFixed(1)}px, 0) scale(${(1 - p * 0.06).toFixed(4)})`
      set(l.cabinet, cabinet)
      // La sala (solo se ve su mitad inferior: el suelo) va pegada al mueble: mismo lienzo y mismo
      // movimiento (el del grupo y el del mueble, en ese orden), para que el suelo no se despegue
      // de la chimenea. Se va oscureciendo.
      set(l.room, `${group} ${cabinet}`, 1 - ease * 0.6)
      // Tele: sale hacia delante (más grande) y a la izquierda, con más fuerza que antes al ser la única pieza.
      // Sube un poco para no tapar la chimenea al crecer.
      set(l.tv, `translate3d(${(-p * (narrow ? 0.1 : 0.08) * vw).toFixed(1)}px, ${(-p * 0.02 * vh).toFixed(1)}px, 0) scale(${(1 + p * 0.18).toFixed(4)})`)
      if (l.footer) {
        l.footer.style.opacity = String(clamp(1 - e * 2.5))
        // Baja hacia el borde de la pantalla mientras se apaga (opacidad 0 en e = 0,4 → ~40 px abajo).
        l.footer.style.transform = `translate3d(0, ${(e * 100).toFixed(1)}px, 0)`
      }
      if (l.shade) l.shade.style.opacity = String(clamp(cover * 0.9))
      if (l.section) l.section.dataset.covered = cover >= 0.99 ? 'true' : 'false'
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
  }, [])

  return bind
}
