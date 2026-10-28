# Sistema de diseño — La Tasquita de Sara

**Brutalismo editorial de barrio.** Una carta impresa de vanguardia: crema + teal + oro, titulares
Newsreader enormes, etiquetas Space Grotesk en mayúsculas, esquinas a 0 px y rejillas con líneas
de 1 px. Comida siempre **a color**. Móvil primero.

La web pública vive en `app/(site)/` y `components/site/`; el panel (`/admin`) comparte tokens
pero usa sus propios componentes (`components/ui`, `components/admin`).

---

## 1. Tokens (`app/globals.css`, bloque `@theme`)

| Token | Valor | Uso |
|---|---|---|
| `cream` | `#fcf9f3` | Fondo de página. Nunca blanco puro. |
| `cream-100…400` | `#f6f3ed` → `#e5e2dc` | Placeholders de imagen (`cream-300`), rellenos, hovers. |
| `primary` | `#2f7780` | Teal de marca: titulares, botones, líneas de rejilla. |
| `primary-dark` | `#1f5f67` | Hover, etiquetas de precio, barra de aviso. |
| `primary-light` | `#e3efef` | Fondos suaves (panel). |
| `gold` | `#c7af65` | **Solo decorativo o sobre oscuro**: reglas, puntos, números en el pie. |
| `sport` | `#a8381e` | Solo para la categoría "Deporte en directo". |
| `gold-deep` | `#8a6f22` | Oro **legible sobre crema** (AA) para texto pequeño: numeración, "N.º", contadores. |
| `ink` | `#1c1c18` | Texto principal y secciones oscuras (pie). |
| `ink-muted` | `#58413b` | Texto secundario sobre crema. |
| `danger` / `success` | `#b42318` / `#1f7a4d` | Cerrado / abierto. |

Contraste: nada de oro claro en texto pequeño sobre crema; sobre teal, texto blanco o crema.
Glovo `#ffc244` y Uber Eats `#06c167` llevan texto oscuro (blanco no pasa AA).

Variables de layout (también en `globals.css`): `--header-h` (60 px móvil, 72 px desde `lg`) y
`--chips-h` (barra de categorías de la carta). `html:has([data-site])` aplica `scroll-padding-top`
para que los anclajes no queden bajo la cabecera.

## 2. Tipografía

- **Newsreader** (`font-serif`, 400–800, con cursiva): titulares, nombres de plato, precios grandes,
  cifras. Siempre `uppercase`, `font-extrabold`, tracking negativo (`-0.025em` a `-0.045em`).
  - Display (hero, "Carta", "Eventos"): `text-[clamp(…vw…)]`, `leading-[0.78–0.86]`.
  - Secciones oscuras ("Cocina de barrio", "Visítanos"): cursiva, blanco.
  - Si el titular puede llevar tildes en la 2.ª línea, `leading ≥ 0.92` para que no choquen.
- **Space Grotesk** (`font-sans`, por defecto): texto, datos y etiquetas.
  - Etiqueta: `text-xs font-bold uppercase tracking-[0.16em–0.2em]`. **Mínimo 12 px** (11 px solo
    en micro-etiquetas sobre fondo sólido de alto contraste).
  - Cuerpo: 15–18 px, `leading-relaxed`, `text-pretty`.
- Titulares largos: `text-balance`; tamaños con `clamp()` probados a 320/390/768/1440
  (p. ej. "DE CARNE VA LA COSA", "HAMBURGUESAS").

## 3. Composición

- **Contenedor**: `mx-auto max-w-[100rem] px-5 md:px-10 lg:px-14`.
- **Rejillas con líneas**: contenedor `grid gap-px border border-primary bg-primary` y celdas
  `bg-cream`. Para no dejar un bloque teal en la última fila usa `<GridFillers count cols />`
  (celdas rayadas `bg-hatch`). No animes la opacidad de celdas sueltas dentro de estas rejillas
  (se vería el teal): anima la rejilla entera.
- **Numeración** 01/02/03 en `gold-deep`; números decorativos grandes con `glyph-outline`
  (contorno). Ojo: no uses clases `text-*` para utilidades propias, `tailwind-merge` las borra.
- **Reglas**: borde superior oro de 6–8 px para abrir secciones; 3 px bajo cabeceras de página.
- **Bandas oscuras**: `bg-ink` + foto al 35–50 % de opacidad + degradado + `bg-grain`, titular
  gigante en cursiva abajo a la izquierda.
- **Esquinas**: 0 px siempre. Sombras solo en elementos flotantes (cabecera al hacer scroll,
  etiqueta de evento).

## 4. Componentes de la web (`components/site`)

| Pieza | Notas |
|---|---|
| `SiteHeader` + `MobileMenu` | Cabecera sticky. Menú móvil a pantalla completa: Esc, foco atrapado y devuelto, scroll bloqueado, horario real y estado abierto/cerrado. |
| `OpenStatus`, `OpeningHoursList` | Calculados **en cliente** (la página es estática) con `useMinute()`; refresco cada minuto. Resaltan HOY. |
| `home/Hero` | Móvil: titular → fotos → acciones en la primera pantalla. Escritorio: 2 columnas. Marquesina de fondo, rejilla `bg-grid` y `HeroGrid` (canvas solo con ratón y sin "reducir movimiento"). |
| `carta/CategoryNav` | Chips sticky bajo la cabecera, scrollspy con IntersectionObserver. Sin JS son anclas normales. |
| `carta/MenuItemCard` | Con foto: etiqueta de precio sobre la imagen. Sin foto: tarjeta tipográfica (N.º, precio grande, número en contorno); en secciones con fotos, "cartel" teal del tamaño de la foto para cuadrar filas. Insignias: premio (oro), Más pedido (teal), Hecho en casa (tinta). Alérgenos con abreviatura + nombre accesible. |
| `events/EventCard` | Fecha tipo entrada (día gigante + mes/día/hora), categoría como etiqueta, foto o bloque tipográfico. |
| `daily-menu/DailyMenuBoard` | "La pizarra": bloque teal oscuro con grano y doble marco, precio grande en oro, pases numerados 01/02/03 y "Hoy sí/no se sirve" calculado en cliente. Portada (tras el hero) y arriba de `/carta` (chip ◆ sin número). |
| `reservations/ReservationForm` | Reserva por WhatsApp sin servidor: nombre, personas (stepper hasta el máximo; más → "llámanos"), día (chips de 14 días con cerrados tachados + selector de otra fecha), hora (franjas de 30 min dentro de los tramos; madrugada marcada), comentarios. Abre `wa.me` con el mensaje formateado. Franjas en `reservations/slots.ts`. |
| `MobileActionBar` | Barra fija en móvil (Llamar · Reservar · Cómo llegar) que aparece al pasar el hero (`[data-hero]`), respeta `safe-area` y se oculta (inert) con el menú abierto. El pie reserva su altura. |
| `events/EventActions` + `events/ics.ts` | Reservar para el evento (WhatsApp prellenado), añadir al calendario (`/eventos/[id]/evento.ics`, RFC 5545, `TZID=Europe/Madrid`, 2 h, aviso 2 h antes) y compartir (`navigator.share` → WhatsApp). |
| `legal/LegalPage` | Plantilla de `/aviso-legal`, `/privacidad`, `/cookies`: índice lateral, ficha del titular sin filas vacías, `prose-legal`. |
| `home/MapFacade` | Fachada del mapa (plano abstracto + dirección): no se pide nada a Google hasta pulsar "Ver mapa interactivo"; el iframe se monta en el mismo hueco. |
| `DeliveryLinks` / `DeliveryInline` | Botones de marca o versión discreta en línea. |
| `SmartImage` | `getImageProps` en servidor (sin JS): Cloudinary → su loader; Unsplash/Uber → optimizador; otros dominios → `unoptimized`. Fondo `cream-300` como placeholder. |

Fotos: primero las reales (ajustes y carta, ver `photos.ts`); Unsplash solo como último recurso.

### Recorrido de la portada

Hero → Menú del día (si está activo) → Nosotros → Eventos (si hay) → Reservar (si WhatsApp y reservas están activos) → Contacto.
Todo lo que depende de "ahora" (abierto/cerrado, hoy, menú de hoy, días reservables) se calcula en el cliente con
`useMinute()` y respeta los cierres puntuales (`specialClosures`).

## 5. Movimiento

- Entrada del hero con CSS (`animate-rise`, `animate-settle`); el titular **no** depende de
  ninguna animación.
- Aparición al hacer scroll con `.reveal` (scroll-driven animations, sin JS). Si el navegador no
  lo soporta o el usuario pide menos movimiento, el contenido simplemente está.
- `motion/react` solo para piezas con estado (menú móvil), con `LazyMotion` + `MotionConfig
  reducedMotion="user"` en `MotionProvider`.
- Curva de marca: `ease-out-expo`. Hovers: 200–300 ms; imágenes: zoom 1.03–1.04.

## 6. Móvil (prioridad)

- **Sin scroll lateral**: `html, body { overflow-x: clip }` es solo un cinturón; cada desborde se arregla en su
  origen (texto fluido con `clamp()` + `min-w-0`, nada de márgenes negativos que salgan del contenedor, rejillas
  `grid-cols-1`/`minmax(0,1fr)` cuando un titular largo puede ensanchar la pista). Barrido de comprobación:
  `scratchpad/site-tools/sweep-mobile.mjs` (320–440 px, horizontal, con interacciones).
- **Cabecera**: wordmark `clamp(1.05rem,5.6vw,1.3rem)`; por debajo de 384 px el botón de menú es solo icono
  (44×44). En móvil/tablet se esconde al bajar y reaparece al subir (`html[data-header-hidden]`); lo que va
  pegado debajo lleva `data-follow-header` y sube con ella (chips de la carta).
- **Fijo en pantalla**: cabecera 60 px, chips 56 px (60 desde `md`), barra inferior 64 px (56 si la pantalla
  mide menos de 704 px de alto). Respetan `env(safe-area-inset-*)` (`viewport-fit=cover` en la web pública).
- **Texto**: cuerpo ≥ 16 px en móvil (15 px solo desde `sm`/`lg` en tarjetas densas); etiquetas ≥ 11 px.
  Titulares de portada y menú limitados también por la altura (`min(14.2vw,13svh)`) para el modo horizontal.
- **Táctil**: `hover:` de Tailwind v4 ya solo aplica con `(hover: hover)`; estados `active:` en chips y botones;
  `touch-action: manipulation`; `overscroll-x-contain` en tiras horizontales; inputs a 16 px (sin zoom en iOS).
- **Carta en móvil**: fotos 16/9 (4/3 desde `sm`) para ver más platos por pantalla; el CTA de domicilio solo al
  final; la página salta a cada sección con `window.scrollTo` (nunca mueve la página en horizontal).

## 7. Accesibilidad (mínimos)

Skip-link, landmarks, `aria-current`, objetivos táctiles ≥ 44 px, foco visible teal, contraste AA,
`alt` real en fotos de contenido y `alt=""` en fondos decorativos, enlaces externos anunciados.
