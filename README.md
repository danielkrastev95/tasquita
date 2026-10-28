# La Tasquita de Sara

Web y panel privado de **La Tasquita de Sara**, bar de tapas en Valdemoro (Madrid).

- **Web:** https://tasquita.vercel.app — portada, carta (`/carta`) y eventos (`/eventos`).
- **Panel:** https://tasquita.vercel.app/admin — carta, eventos, textos, fotos y horario. Acceso con contraseña + app de autenticación (2FA obligatorio).

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions), React 19, TypeScript |
| Estilos | Tailwind CSS 4 (tokens en `app/globals.css`), motion |
| Base de datos | Neon Postgres + Drizzle ORM (driver HTTP serverless) |
| Autenticación | Better Auth (email + contraseña, TOTP obligatorio, códigos de respaldo, rate limiting) |
| Imágenes | Cloudinary (subida desde el panel, optimización `f_auto,q_auto` en su CDN) |
| Hosting | Vercel (deploy automático al hacer push a `main`) |

## Puesta en marcha local

```bash
npm install
cp .env.example .env.local   # rellena DATABASE_URL con la rama "dev" de Neon
npm run db:migrate           # aplica las migraciones de drizzle/
npm run dev                  # http://localhost:3000
```

> ⚠️ En local usa **siempre** la rama `dev` de Neon (copia aislada de producción). La rama `production` solo la usa Vercel.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run typecheck` / `lint` | Comprobaciones de TypeScript y ESLint |
| `npm run db:generate` | Genera una migración SQL a partir de `lib/db/schema.ts` |
| `npm run db:migrate` | Aplica las migraciones pendientes a la base de `DATABASE_URL` |
| `npm run db:studio` | Drizzle Studio para ver/editar datos |
| `npm run db:import-legacy` | Importa los datos del panel antiguo (Prisma). Idempotente |
| `npm run admin:reset-password -- <email> "<contraseña>"` | Cambia (o crea) la contraseña del panel y cierra sus sesiones |
| `npm run admin:reset-2fa -- <email>` | Quita el 2FA de una cuenta (móvil perdido); se pedirá configurarlo al entrar |

## Base de datos (Neon)

Proyecto Neon `jolly-glitter-32281018`:

- `production` → la usa Vercel (Production).
- `dev` → hija de `production`, para desarrollo local. Para refrescarla con datos reales: *Reset from parent* en la consola de Neon.
- `archive-2026-03` → copia antigua de marzo de 2026 (solo histórico).

Cambiar el esquema: edita `lib/db/schema.ts` → `npm run db:generate` → revisa el SQL en `drizzle/` → `npm run db:migrate` en `dev` → pruébalo → aplica la migración en `production` antes de desplegar.

Los textos editables de la web (`site_settings.data`) son un documento JSON validado con zod (`lib/settings.ts`): añadir un campo nuevo con valor por defecto **no** necesita migración.

## Variables de entorno

| Variable | Dónde | Descripción |
| --- | --- | --- |
| `DATABASE_URL` | Local, Vercel | Conexión a Neon |
| `BETTER_AUTH_SECRET` | Local, Vercel | Secreto para firmar sesiones (32+ bytes aleatorios) |
| `BETTER_AUTH_URL` | Local, Vercel (Production) | URL pública (`https://tasquita.vercel.app`) |
| `NEXT_PUBLIC_SITE_URL` | Vercel (Production) | URL canónica para SEO/Open Graph |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Local, Vercel | Cloud de Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Local, Vercel | Preset de subida sin firmar (solo se usa desde el servidor) |

## Despliegue

`git push origin main` → Vercel construye y publica. Si el build falla, producción sigue en la versión anterior.
Antes de desplegar un cambio de esquema, aplica la migración a la rama `production` de Neon.
