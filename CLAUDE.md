# La Tasquita de Sara — guía para Claude

Web pública + panel privado de un bar de tapas en Valdemoro. La dueña (no técnica) lo gestiona casi siempre desde el **móvil**: toda la interfaz es mobile-first y en español de España (tuteo). Ver `README.md` para comandos y despliegue.

## Arquitectura

- **Next.js 16 App Router.** `proxy.ts` (sustituye a middleware) solo hace una comprobación optimista de cookie en `/admin/*`; la autorización real está en servidor.
- **Web pública** `app/(site)/` — páginas estáticas con ISR (`revalidate = 3600`). Leen con `lib/data/public.ts` (React `cache`, tolerante a fallos). Sin fetch en cliente. Componentes en `components/site/`.
- **Panel** `app/admin/(panel)/` — protegido con `requireAdmin()` en el layout **y** en cada página/server action. Escrituras con Server Actions en `lib/actions/` (zod + `revalidatePath("/", "layout")`). Lecturas en `lib/data/admin.ts`. Componentes en `components/admin/` y primitivas en `components/ui/`.
- **Auth** — Better Auth (`lib/auth.ts`), cliente en `lib/auth-client.ts`, helpers en `lib/session.ts`. Registro público desactivado. 2FA TOTP obligatorio: sin él, `requireAdmin()` redirige a `/admin/activar-2fa`. Contraseñas con bcrypt (compatibles con el panel antiguo). Login en `app/admin/login`, seguridad en `app/admin/(panel)/seguridad`.
- **Base de datos** — Neon + Drizzle (`lib/db/`), driver HTTP: no hay transacciones interactivas, usa `db.batch([...])` para escrituras atómicas. Migraciones en `drizzle/` (`npm run db:generate` / `db:migrate`). Local → rama Neon `dev`; Vercel → rama `production`.
- **Ajustes/textos** — documento JSON en `site_settings.data`, esquema y defaults en `lib/settings.ts`. Un campo nuevo con default no requiere migración.
- **Imágenes** — Cloudinary. Subida en `app/api/admin/upload` (comprimida antes en el navegador). En la web, `components/site/SmartImage.tsx` usa `cloudinaryLoader` para URLs de Cloudinary.

## Convenciones

- Precios en céntimos (`priceCents`), formateo con `lib/format.ts`. Fechas de evento `YYYY-MM-DD` + hora `HH:MM`, interpretadas en Europe/Madrid (`lib/schedule.ts`, `todayInMadrid`).
- Horario estructurado `openingHours {mon..sun: [{open, close}]}`; `close <= open` = cierra al día siguiente.
- Tokens de diseño en `app/globals.css` (`@theme`): usa `bg-cream`, `text-primary`, `font-serif`… nunca colores hex sueltos. Sistema de diseño en `DESIGN.md`.
- Server Components por defecto; `"use client"` solo en piezas interactivas.
- Comentarios breves en español. TypeScript estricto, sin `any`.
- Antes de usar APIs de Next 16, Better Auth 1.7, zod 4, motion o Drizzle, verifica en `node_modules` (son versiones recientes).

## Comprobaciones antes de entregar

`npm run typecheck && npm run lint && npm run build`
