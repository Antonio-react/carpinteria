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
| `logo.mjs` | Logo vectorizado, sierra del spinner, favicon e icono de iPhone | `docs/referencias/Logo.jpg` |

```bash
node scripts/images/hero-layers.mjs <foto-ampliada.png> src/assets/hero
node scripts/images/logo.mjs
```

Notas del hero:
- El recorte sigue el borde real del mueble (medido sobre la foto original de 1792 × 2390; el
  script escala las medidas a la resolución de la foto que reciba).
- La base del zócalo no es recta: tiene un entrante a la derecha de la chimenea.
- El canto derecho de la estantería está inclinado (x ≈ 1650 arriba, ≈ 1635 abajo).
- El cristal de la chimenea conserva marco y cerco; solo se sustituye el reflejo. Las brasas
  son un efecto CSS (`src/components/hero/FireGlow.tsx`).
