/**
 * PLANTILLA de `site.ts` (este sí se sube a GitHub).
 *
 * El `site.ts` real está en .gitignore. En Netlify se genera en cada build con
 * `scripts/generate-site-config.mjs` a partir de variables de entorno (ver ese script).
 * Para trabajar en local sin el archivo real: copia este archivo como `site.ts` y rellénalo.
 */
export const siteConfig = {
  nombre: "Carpintería y Decoración",
  titular: "Nombre Apellido Apellido",
  lema: "Espacios de ensueño",
  email: "correo@ejemplo.com",
  telefonos: {
    principal: "600 00 00 00",
    secundario: "600 00 00 01",
  },
  direccion: {
    calle: "Calle Ejemplo 1",
    poligono: "Polígono Industrial Ejemplo",
    codigoPostal: "00000",
    localidad: "Localidad",
    provincia: "Provincia",
  },
  horario: {
    manana: "8:30 - 14:00",
    tarde: "15:30 - 18:30",
    dias: "Lunes a viernes",
  },
  dominio: {
    com: "ejemplo.com",
  },
  nif: "00000000X",
} as const;
