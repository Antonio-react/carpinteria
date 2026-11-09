# Scripts de imagen

Generan los recursos gráficos a partir de los originales. **No forman parte de la web**: solo se
ejecutan cuando hay que rehacer una imagen. Necesitan `sharp` (y `potrace` para el logo), que no
son dependencias del proyecto:

```bash
npm i --no-save sharp potrace
```

| Script | Qué genera | Origen |
|---|---|---|
| `hero-layers.mjs` | Capas del hero en `src/assets/hero/` (mueble recortado + sala) | Foto del hero ampliada con IA (4240 × 5656) |
| `hero-doors.mjs` | Interiores del mueble y roble para las puertas que se abren (`inside-column`, `inside-top`, `oak-side`) | `docs/referencias/mueble-abierto.png` (foto del mueble abierto, de frente) |
| `hero-oak-frame.mjs` | `oak-frame-top.webp`: el cerco de arriba de la estantería de roble, que el recorte del mueble cortaba (se superpone; no toca piece-*.webp) | `src/assets/hero-original.jpeg` |
| `logo.mjs` | Logo vectorizado, sierra del spinner, favicon e icono de iPhone | `docs/referencias/Logo.jpg` |

```bash
node scripts/images/hero-layers.mjs <foto-ampliada.png> src/assets/hero
node scripts/images/hero-doors.mjs docs/referencias/mueble-abierto.png src/assets/hero-original.jpeg src/assets/hero
node scripts/images/hero-oak-frame.mjs
node scripts/images/logo.mjs
```

Notas del hero:
- El recorte sigue el borde real del mueble (medido sobre la foto original de 1792 × 2390; el
  script escala las medidas a la resolución de la foto que reciba).
- La base del zócalo no es recta: tiene un entrante a la derecha de la chimenea.
- El canto derecho de la estantería está inclinado (x ≈ 1650 arriba, ≈ 1635 abajo).
- El cristal de la chimenea conserva marco y cerco; solo se sustituye el reflejo. Las brasas
  son un efecto CSS (`src/components/hero/FireGlow.tsx`).
- Las puertas que se abren (`src/components/hero/HeroDoors.tsx`) usan la cámara reconstruida
  de la foto (`doorGeometry.ts`): si se cambia la foto del hero o su recorte, hay que volver a medir
  los puntos de fuga y las juntas de las puertas.
