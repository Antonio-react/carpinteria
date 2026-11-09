# Carpintería y Decoración — Web corporativa

Web informativa para una carpintería familiar (autónomo), con galería de trabajos y formulario de contacto. Proyecto personal de portafolio de Antonio.

## Alcance

Construye la web entera, de principio a fin: incluye el formulario de contacto (validación, envío, estados de éxito/error) y la optimización de las fotos reales que haya en `src/assets/` (recortes, conversión a WEBP, compresión). No dejes nada para que yo lo haga después, salvo lo que se indique explícitamente en "Pendiente" al final de este documento.

## Stack técnico (obligatorio)

* **React + Vite + TypeScript.** TypeScript siempre, en todo el proyecto.
* **Prohibido usar `any`.** Si no se conoce el tipo, se define uno explícito (interface, type, union), nunca `any` para salir del paso.
* **Tailwind CSS siempre.** Nunca CSS Modules, styled-components ni CSS plano aparte. `@tailwindcss/vite` ya está instalado.
* **Componentes reutilizables obligatorios.** Cualquier bloque de UI que se use más de una vez (botón, tarjeta, sección con título, etc.) se extrae a un componente propio en `src/components/ui/`, que recibe los datos por props. Nunca copiar y pegar el mismo JSX en dos sitios.
* **Un componente, un archivo, un propósito.** Nada de componentes gigantes que hagan de todo.
* **Nombres de código en inglés** (`ContactForm`, `GalleryCard`, `useCarousel`...). **Textos que ve el usuario, en español.**
* **Accesibilidad mínima:** todo botón, enlace e imagen necesita su texto alternativo (`alt`) o `aria-label` cuando el propósito no sea evidente por el texto visible.
* **Mobile-first, pero cuidando igual de bien el escritorio.** La gente que busca una carpintería suele hacerlo desde el ordenador, no solo desde el móvil. El `Navbar` y el resto de componentes deben tener un diseño propio para cada tamaño, no solo "que no se rompa" en desktop.
* **Si reescribes algo que yo ya había hecho, explícame qué estaba mal y por qué**, antes de sustituirlo. El objetivo es que aprenda, no solo que quede terminado.
* **Para fotos de galería que aún no existen:** un boceto a lápiz del tipo de trabajo sobre papel de plano, con el nombre de la categoría al pie (`PhotoPlaceholder` + `src/data/sketches.ts`; antes era un hueco gris, cambiado con permiso del usuario). **Nunca** fotos de stock (Unsplash o similar): riesgo de que se queden puestas en la web publicada mostrando trabajos que no son de la empresa.

## Alias de rutas

Ya configurado en `vite.config.ts` y `tsconfig.app.json`: `@/` apunta a `./src/`. Úsalo en todos los imports (`@/config/site`, `@/components/ui/Button`) en vez de rutas relativas largas (`../../`).

## Estructura de archivos

```
/docs/referencias/        ← SOLO inspiración visual, en .gitignore, nunca se publica
/src/assets/               ← imágenes reales de la web (procesadas por Vite)
/src/config/site.ts        ← datos del negocio, en .gitignore (contiene el NIF)
/src/components/ui/        ← componentes reutilizables sin datos del negocio dentro (reciben todo por props)
/public/                   ← favicon y lo que necesite index.html directamente
```

### `/docs/referencias/` (solo inspiración, no copiar literal)

* `umbral.png` — web de arquitectos: palabra gigante en serif cursiva detrás de la casa, ficha de proyecto en tarjeta translúcida, botón principal + botón secundario.
* `shipX.png`, `egypt.png`, `expectional.png` — más referencias para el hero (coge de cada una lo que veas útil: posible inspiración tipo palabra gigante detrás del sujeto, navegación en píldora, botón con flecha, tarjeta con contador).
* `carpetas-galeria.png` — galería con botones de categoría en forma de píldora y un carrusel con la foto central destacada.
* `nombre-portada-galeria.png` — carrusel tipo *coverflow* 3D (web de viajes): tarjeta central grande con título y subtítulo, tarjetas laterales inclinadas en perspectiva, flechas a los lados.
* `Logo.jpg` — logo original de la empresa, en JPG (no vectorial). Ya vectorizado con Potrace (`scripts/images/logo.mjs`): `src/assets/brand/logo.svg`, `saw.svg` (sierra del spinner), `public/favicon.svg` y `public/apple-touch-icon.png`.

### `/src/config/site.ts`

Datos del negocio (nombre, titular, teléfonos, dirección, horario, dominio, email, NIF). Archivo en `.gitignore`: nunca se sube al repositorio porque contiene el NIF. **No dupliques el NIF ni ningún otro dato de este archivo directamente en este `CLAUDE.md` ni en ningún otro archivo que sí se vaya a subir a Git.**

En GitHub va `src/config/site.example.ts` (plantilla con datos de ejemplo). En Netlify, `scripts/generate-site-config.mjs` crea `site.ts` antes de cada build a partir de variables de entorno (`SITE_TITULAR`, `SITE_NIF`, `SITE_EMAIL`, `SITE_TELEFONO_PRINCIPAL`, `SITE_TELEFONO_SECUNDARIO`, `SITE_CALLE`, `SITE_POLIGONO`, `SITE_CODIGO_POSTAL`, `SITE_LOCALIDAD`, `SITE_PROVINCIA`, `SITE_DOMINIO`); el comando está en `netlify.toml`.

### `/src/assets/`

* `hero-original.jpeg` — foto real del hero, en `src/assets/`, tal cual (con el reflejo de la pantalla/cuadro ya suavizado a mano). **No sobrescribas este archivo original**, pero sí tienes libertad total para recortarla, corregirla y editarla como creas necesario para que el resultado final quede como se busca en la sección "Hero" de este documento.
* A partir de ella (ampliada con IA a 4240 × 5656 por el usuario; esa copia NO está en el proyecto, la guarda él) se generan las capas del hero en `src/assets/hero/`: `piece-{800,1400,2000}.webp` (mueble recortado) y `room-{800,1400}.webp` (sala, mismo lienzo). Script: `scripts/images/hero-layers.mjs`. Se mantiene la **perspectiva original** (el usuario rechazó enderezarla).

## Datos de la empresa

* **Nombre comercial:** Carpintería y Decoración (el logo añade "Fernández").
* **Titular:** autónomo (no sociedad). Nombre y NIF viven solo en `src/config/site.ts`.
* **Lema:** "Espacios de ensueño".
* **Experiencia:** más de 40 años.
* **Descripción base** (para redactar textos propios, no copiar literal): empresa familiar de ebanistería y carpintería, con más de 40 años de experiencia, que realiza todo tipo de trabajos en madera y convierte la idea del cliente en realidad. No hay un listado de "servicios": trabajan todo lo que sea madera; miden, diseñan y montan ellos mismos, sin intermediarios. Esto se puede comunicar bien con una sección corta tipo "Cómo trabajamos" (medimos → diseñamos → montamos).
* **Email:** infocarpinteriadecoracion@gmail.com (correo nuevo del negocio; no usar nunca el antiguo `contacta@` del dominio `.es`).
* **Teléfonos:** principal 675 81 66 09 (padre), secundario 655 86 22 53 (hijo). Tienen WhatsApp, pero el contacto debe sentirse centrado en email/formulario, no promocionar WhatsApp como vía de contacto (para que no les molesten fuera de horario y quede más profesional).
* **Dirección:** Calle Mecánicos 16, Polígono Industrial La Ermita, El Viso de San Juan.
* **Horario:** lunes a viernes, 8:30–14:00 y 15:30–18:30.
* **Zona de servicio:** toda España (transportan la pieza y la montan ellos mismos).
* **Dominio:** carpinteriaydecoracion.com (confirmado disponible, pendiente de que lo compren).
* **Presupuestos:** gratuitos.
* **No prometer plazos fijos** (nada de "presupuesto o diseño en 2 semanas"): no siempre se puede cumplir.
* **Respuesta a consultas:** se dirá que responden "lo antes posible", sin comprometerse a un plazo concreto.
* **Todas las fotos que lleguen del cliente ya tienen permiso de uso** de las personas que aparecen/cuyas casas aparecen.

## Hero

**Lo único fijo de esta sección es la palabra/frase gigante detrás de la pieza** (ver abajo). Todo lo demás —composición exacta, cómo usar las referencias, el efecto de "desmontaje", recortes, edición de la foto— queda a tu criterio de diseño.

* **Foto real** en `src/assets/hero-original.jpeg` (ver arriba). Mueble de salón a medida (hueco para TV/cuadro empotrado, estantería de madera, zócalo negro), foto en ángulo con la escalera y el techo de fondo. El cuadro/pantalla que muestra un paisaje de playa con olas se deja tal cual, da el único color de la composición.
* **Concepto de partida:** un efecto 3D en el que la foto "se desmonta" (basado en las referencias de `/docs/referencias/`, coge de cada una lo que encaje; no es necesario replicarlas literalmente).
* **Pista técnica:** esto se puede lograr con *parallax por mapa de profundidad* — generar un mapa de profundidad de la foto y separarla en 2-4 capas que se mueven a distinta velocidad con el scroll, dando sensación de volumen. Es una posible vía, no una instrucción cerrada: si encuentras una forma mejor de conseguir el mismo efecto visual, adelante.
* **Palabra gigante (esto sí es fijo):** detrás de la pieza, el nombre de la empresa, "Carpintería y Decoración", con efecto de capas (las dos palabras, no una sola como en las referencias originales).
* **Disparo del efecto:** con el scroll, tanto en móvil como en escritorio (no con el ratón al pasar por encima). Antes de que el usuario haga scroll se muestra una foto estática normal.
* **Animación de entrada:** al cargar la página, los textos caen desde arriba. Al hacer scroll hacia abajo, esos textos se van difuminando a la vez que aparece el resto de la página (inspirado en un reel de Instagram).
* **Carga diferida:** el carrusel y el resto de secciones pesadas se cargan solo cuando el usuario llega a ellas con el scroll, no todas de golpe al abrir la página.

## Galería y carrusel de categorías

* **Categorías:** armarios, puertas, suelo, cocina, salón y más. Las que tengan muy pocas fotos se agrupan en "Otros trabajos".
* **Máximo 10 fotos por categoría**, bien optimizadas en peso.
* **Cada categoría tiene su propia página** (ruta propia), más fácil de mantener.
* **Carrusel de categorías:** sirve solo para elegir categoría. Una foto de portada por categoría (la mejor y de más calidad), limpia, sin adornos de carpeta (ni pestaña con número ni hojas asomando), con el nombre y la descripción abajo; la invitación a entrar la da el texto "Abrir carpeta". En móvil se ven 3 tarjetas a la vez.
* **Navegación del carrusel:** flechas a los lados de la tarjeta central (como en la referencia `nombre-portada-galeria.png`), más deslizamiento táctil en móvil. **No** implementar scroll con la rueda del ratón en escritorio (riesgo de "scroll jacking": el usuario se queda atrapado moviendo fotos en vez de poder bajar la página).
* **Efecto 3D en la tarjeta central:** al pasar el ratón por encima, la foto se inclina hacia el lado donde está el cursor. Solo afecta a la tarjeta central; las laterales no se mueven hasta que se cambia de categoría con las flechas.
* **Diseño combinado:** mezclar lo mejor de las dos referencias de galería (píldoras de categoría + foto central destacada, y el *coverflow* 3D con título sobre la tarjeta).
* **Dentro de cada categoría:** las fotos se ven de forma normal (galería simple), con una descripción general por categoría (no una por cada foto individual).
* **Spinner de carga de la galería:** el logo de la sierra circular girando, animado.
* **Fotos aún no disponibles:** boceto a lápiz del tipo de trabajo con su nombre (nunca stock, ver regla en "Stack técnico").

## Formulario de contacto

* **Frase de cabecera:** "Cuéntanos tu idea y la hacemos realidad."
* **Campos:** incluir un campo de ubicación/zona.
* **Envío:** por correo electrónico mediante **Netlify Forms** (elegido), verificando que llegue a infocarpinteriadecoracion@gmail.com. El aviso por email se activa en el panel de Netlify de la cuenta del cliente; los adjuntos llegan como enlaces.
* **Adjuntar archivos** (planos, fotos de referencia): sí (gratis en Netlify). Límite de Netlify: 8 MB por envío, un archivo por campo → dos campos de adjunto.
* **Presupuesto guiado en 3 pasos** (un solo `<form>`; los pasos no visibles solo se ocultan, así se envían todos los campos): 1) tipo de trabajo con tarjetas (obligatorio, incluye "Otro"), 2) idea + localidad + adjuntos, 3) datos de contacto + privacidad. Pasos en `src/components/contact/formSteps.ts`.
* El formulario de React tiene un "gemelo" oculto en `index.html` para que Netlify lo detecte: si se cambia un campo, hay que cambiarlo en los dos sitios.
* **Al enviar correctamente:** mensaje de confirmación de que se ha enviado y que la empresa contactará pronto. Animación en la barra del botón de enviar: una tabla de madera con un serrucho cortándola, o un martillo golpeando, mientras se procesa el envío.
* **Si falla el envío o falta un dato obligatorio:** aviso de error claro.

## SEO y metadatos

* Todas las páginas necesitan `title` y `description` propios.
* **Favicon:** el logo completo (vectorizado), aunque a tamaño pequeño no se aprecien todos los detalles — es lo que han pedido.
* **Imagen al compartir el enlace (Open Graph):** una sola configuración fija en `index.html`, igual para todas las páginas (no una imagen distinta por página).
* Antes de publicar, pasar la skill Claude-SEO sobre una URL de pruebas con `noindex`, y solo apuntar el dominio definitivo después de revisarlo.

## Página 404 y navegación

* Página 404 personalizada, con un botón para volver al Inicio.
* Al actualizar (F5) cualquier página de la web, no debe dar error (configurar el fallback de rutas del SPA).
* Al abrir o actualizar cualquier página, debe empezar arriba del todo (scroll a 0).

## Legal

* Autónomo (no sociedad). Identificación completa (nombre, NIF) solo en el aviso legal, tomada de `src/config/site.ts`, nunca repetida en otros archivos que se suban a Git.
* No se usa Google Analytics ni ninguna herramienta de analítica o de terceros que use cookies — tenerlo en cuenta al redactar la política de cookies (previsiblemente muy simple, sin cookies de terceros que declarar).
* **El aviso legal, la política de privacidad y la de cookies se redactan nuevos y personalizados para esta empresa.** No reutilices ni adaptes el contenido legal de la web antigua (`carpinteriaydecoracion.es`): no sirve, hay que partir de cero con los datos reales de este negocio.

## Herramientas (nivel de cuenta, no de proyecto)

Las de "desde el principio" ya están instaladas (salvo svg.new, que no hizo falta: el logo se vectorizó con Potrace). Las de auditoría se instalan al final:

**Desde el principio:**

* **Skill Emil Kowalski**
* **Skill Taste Skill**
* **MCP Playwright** — para interactuar con la web mientras se construye.
* **Servidor MCP 21st.dev** — catálogo de componentes (formularios, tarjetas...).
* **Plugin Context7** — catálogo de documentación y código actualizado (ya conectado a nivel de cuenta en claude.ai).
* ~~MCP svg.new~~ — no necesario (logo vectorizado con Potrace).

**Al final del proyecto, como auditoría:**

* **Skill Claude-SEO** — revisión SEO antes de publicar (sobre URL de pruebas con `noindex`).
* **Skill Impeccable** — pulido final de diseño.
* **Plugin Chrome DevTools MCP** — inspección y depuración desde las herramientas de desarrollo de Chrome, para problemas que no se ven en el código.

## Publicación

* El proyecto se subirá a un repositorio propio de GitHub y se compartirá en LinkedIn como proyecto de portafolio (el segundo, tras la web del gimnasio). El README pensado para LinkedIn/GitHub se redacta al final, es un documento aparte de este `CLAUDE.md`.
* No preocupa que los datos del titular (NIF incluido) acaben siendo visibles, porque de todas formas estarán en la web publicada cuyo enlace se va a compartir — pero igualmente el NIF no debe duplicarse fuera de `site.ts` por limpieza del repositorio.

## Pendiente (no bloquea empezar a construir)

* Fotos reales de la galería (portadas de categoría y fotos internas) — mientras tanto, placeholders grises.
* Confirmación de compra del dominio `carpinteriaydecoracion.com` (ya confirmado disponible).

