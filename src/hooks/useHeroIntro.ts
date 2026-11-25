import { useCallback, useEffect, useState } from 'react'

/** La escena (sala + mueble) no aparece antes de esto: primero empieza a caer el nombre. */
const SCENE_MIN_MS = 450
/** El botón y el lema aparecen un poco después de la escena… */
const FOOTER_AFTER_SCENE_MS = 350
/** …o, como muy tarde, a este tiempo de abrir (con mala conexión, "Pedir presupuesto" no espera a la foto). */
const FOOTER_MAX_WAIT_MS = 1500
/** El fuego "se enciende" (empieza a moverse) un momento después de verse la escena. */
const FIRE_AFTER_SCENE_MS = 700

/** La entrada solo se ve la primera vez que se abre la web; al volver a Inicio el hero ya está montado. */
let introPlayed = false

/**
 * Orden de entrada del hero (solo la primera vez que se abre la web):
 *   1. cae el nombre (DropIn);
 *   2. aparece la escena entera, sala y mueble a la vez, cuando están sus dos fotos (antes salía primero
 *      el suelo, que pesa poco, y luego el mueble);
 *   3. aparecen suavemente el botón y el lema;
 *   4. el fuego, que estaba quieto, se enciende.
 * Al volver a Inicio desde otra página, todo aparece directamente (sin caídas ni esperas).
 */
export function useHeroIntro() {
  const [intro] = useState(() => !introPlayed)
  const [pieceReady, setPieceReady] = useState(false)
  const [roomReady, setRoomReady] = useState(false)
  const [minTimePassed, setMinTimePassed] = useState(!intro)
  const [footerTimedOut, setFooterTimedOut] = useState(!intro)
  const [footerAfterScene, setFooterAfterScene] = useState(!intro)
  const [fireLit, setFireLit] = useState(!intro)

  useEffect(() => {
    introPlayed = true
  }, [])

  useEffect(() => {
    if (!intro) return
    const scene = window.setTimeout(() => setMinTimePassed(true), SCENE_MIN_MS)
    const footer = window.setTimeout(() => setFooterTimedOut(true), FOOTER_MAX_WAIT_MS)
    return () => {
      window.clearTimeout(scene)
      window.clearTimeout(footer)
    }
  }, [intro])

  const sceneShown = pieceReady && roomReady && minTimePassed

  useEffect(() => {
    if (!intro || !sceneShown) return
    const footer = window.setTimeout(() => setFooterAfterScene(true), FOOTER_AFTER_SCENE_MS)
    const fire = window.setTimeout(() => setFireLit(true), FIRE_AFTER_SCENE_MS)
    return () => {
      window.clearTimeout(footer)
      window.clearTimeout(fire)
    }
  }, [intro, sceneShown])

  const markPieceReady = useCallback(() => setPieceReady(true), [])
  const markRoomReady = useCallback(() => setRoomReady(true), [])
  // Si la foto ya estaba en caché, onLoad puede no llegar: se mira al montarla.
  const pieceRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setPieceReady(true)
  }, [])
  const roomRef = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setRoomReady(true)
  }, [])

  return {
    /** true = primera vez: con caídas y fundidos; false = al volver a Inicio, todo directo. */
    intro,
    sceneShown,
    footerShown: footerAfterScene || footerTimedOut,
    fireLit,
    /** Para la foto del mueble: ref (por si ya estaba en caché) y onLoad/onError. */
    pieceRef,
    markPieceReady,
    /** Igual para la foto de la sala. */
    roomRef,
    markRoomReady,
  }
}
