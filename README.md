# La Tasquita de Sara - Web Oficial

Web moderna y minimalista para el restaurante La Tasquita de Sara ubicado en Valdemoro, Madrid.

**🌐 En producción:** https://tasquita.vercel.app

---

## ✨ Características

### Frontend
- **Next.js 16** con App Router y React 19
- **TypeScript** para type safety completo
- **Tailwind CSS** con diseño glass morphism
- **Framer Motion** para animaciones suaves
- **React Hook Form** con validación Zod
- Diseño **responsive** mobile-first
- **SEO optimizado** con metadata
- Imágenes optimizadas con next/image y Cloudinary

### Backend & Admin
- **Panel de administración completo** (`/admin`)
- **NextAuth v5** con JWT y bcrypt
- **Prisma ORM** con Neon PostgreSQL
- **API Routes** con validación Zod
- **Cloudinary** para gestión de imágenes
- Autenticación protegida con NextAuth proxy

---

## 🎨 Paleta de Colores

- **Verde azulado (Primary):** `#53A699`
- **Dorado/Tostado (Gold):** `#C7AF65`
- **Blanco:** `#FFFFFF`

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/danielkrastev95/tasquita.git
cd tasquita
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Database - Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_CSAbBnZMV28a@ep-gentle-violet-aki4hqth.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="2JtwwPhh3JeOlJO+YUOPoAufV3yp2pRtdyNcBWGtQiI="

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="djfbyhzaw"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="tasquita_uploads"
```

### 4. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Acceder al panel de administración

- **URL:** http://localhost:3000/admin/login
- **Email:** admin@latasquitadesara.com
- **Contraseña:** admin123

---

## 📁 Estructura del Proyecto

```
la-tasquita-de-sara/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Página home
│   ├── globals.css             # Estilos globales
│   ├── admin/                  # Panel de administración
│   │   ├── layout.tsx          # Layout con sidebar
│   │   ├── page.tsx            # Dashboard
│   │   ├── login/              # Login page
│   │   ├── menu/               # Gestión de menú
│   │   ├── events/             # Gestión de eventos
│   │   └── settings/           # Configuración
│   └── api/                    # API Routes
│       ├── auth/               # NextAuth endpoints
│       └── admin/              # CRUD APIs
├── components/
│   ├── Navbar.tsx              # Navegación principal
│   ├── Hero.tsx                # Hero section
│   ├── MenuSection.tsx         # Menú con categorías
│   ├── AboutSection.tsx        # Sobre el restaurante
│   ├── EventsSection.tsx       # Eventos destacados
│   ├── ContactSection.tsx      # Contacto y mapa
│   ├── Footer.tsx              # Footer
│   ├── MobileMenu.tsx          # Menú móvil
│   └── admin/                  # Componentes admin
│       ├── AdminSidebar.tsx
│       ├── ImageUpload.tsx     # Upload Cloudinary
│       └── ...
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── prisma.ts               # Prisma client
│   └── validations/            # Schemas Zod
│       ├── settings.ts
│       ├── events.ts
│       └── menu.ts
├── types/
│   └── next-auth.d.ts          # Type definitions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
├── proxy.ts                    # NextAuth proxy
├── CLAUDE.md                   # Documentación técnica
├── DEPLOYMENT.md               # Guía de deployment
└── CHANGELOG_2026-03-07.md     # Changelog detallado
```

---

## 📝 Scripts Disponibles

### Desarrollo

```bash
npm run dev          # Servidor desarrollo (puerto 3000)
npm run build        # Build para producción
npm start            # Servidor producción
npm run lint         # Ejecutar linter
```

### Base de Datos

```bash
npm run db:push      # Aplicar cambios schema
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Poblar base de datos
```

---

## 🎯 Funcionalidades

### Frontend Público

#### Navegación
- Navbar fija con efecto glass morphism
- Menú móvil con Portal pattern
- Navegación suave entre secciones
- Scroll to top button

#### Hero
- Imagen de fondo optimizada
- Banner de evento destacado (toggle)
- Botones delivery: Glovo y Uber Eats
- CTA a contacto

#### Menú
- 8 categorías con 33 platos
- Indicador "Más pedido"
- Indicador "Casero"
- Premios destacados
- Imágenes optimizadas

#### Eventos
- Sistema de categorías (Música, Gastronomía, Especial)
- Evento destacado en Hero
- Toggle para mostrar/ocultar sección
- Imágenes y descripciones

#### Contacto
- Dirección con Google Maps integrado
- Horarios responsive
- Enlaces a redes sociales
- Teléfono y email

### Panel de Administración

#### Dashboard
- Resumen de estadísticas
- Acceso rápido a secciones
- Sidebar navigation

#### Gestión de Menú
- CRUD completo de categorías
- CRUD completo de platos
- Upload de imágenes a Cloudinary
- Reordenamiento drag & drop
- Activar/desactivar items

#### Gestión de Eventos
- CRUD completo de eventos
- Marcar como destacado (Hero)
- Categorías: Música, Gastronomía, Especial
- Upload de imágenes a Cloudinary
- Activar/desactivar eventos

#### Configuración General
- Toggle Hero eventos
- Toggle sección eventos
- Información del restaurante
- Editor de horarios dinámico
- Redes sociales
- Hero title & subtitle

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework:** Next.js 16.1.6
- **UI Library:** React 19.2.4
- **Language:** TypeScript 5.6.3
- **Styling:** Tailwind CSS 3.4.15
- **Animations:** Framer Motion 11.11.11
- **Forms:** React Hook Form 7.53.2
- **Validation:** Zod 3.25.76

### Backend
- **API:** Next.js API Routes
- **Auth:** NextAuth.js v5.0.0-beta.25
- **ORM:** Prisma 6.1.0
- **Database:** Neon PostgreSQL (Serverless)
- **Password:** bcryptjs 2.4.3

### Images & CDN
- **CDN:** Cloudinary
- **Optimization:** next/image
- **Upload:** Cloudinary Widget

### Deployment
- **Hosting:** Vercel
- **Database:** Neon (AWS us-west-2)
- **Version Control:** GitHub

---

## 🔒 Autenticación

### Flujo de Autenticación

1. **Proxy (`proxy.ts`):**
   - NextAuth wrapper integrado
   - Primera capa de protección
   - Pathname headers para layout

2. **NextAuth (`lib/auth.ts`):**
   - Callback `authorized()` para redirects
   - Callback `jwt()` para tokens
   - Callback `session()` para sesión
   - Provider: Credentials con bcrypt

3. **Rutas Protegidas:**
   - ✅ `/admin/*` (excepto `/admin/login`)
   - ✅ `/api/admin/*`
   - ❌ `/` (público)
   - ❌ `/api/auth/*` (NextAuth)

---

## 📦 Deploy a Producción

### Deployment Automático (Vercel + GitHub)

```bash
# Push a develop
git push origin develop

# Mergear a main para deploy automático
git checkout main
git merge develop
git push origin main
```

Vercel detecta el push a `main` y deploya automáticamente.

### Variables de Entorno en Vercel

Ver guía completa en [DEPLOYMENT.md](DEPLOYMENT.md)

**Variables requeridas:**
1. `DATABASE_URL`
2. `NEXTAUTH_URL`
3. `NEXTAUTH_SECRET`
4. `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
5. `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

**Scripts automáticos:**
- `vercel-env-setup.ps1` (Windows)
- `vercel-env-setup.sh` (Linux/Mac)

---

## 📚 Documentación

- **[CLAUDE.md](CLAUDE.md)** - Documentación técnica completa
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía de deployment
- **[CHANGELOG_2026-03-07.md](CHANGELOG_2026-03-07.md)** - Changelog detallado
- **[GUIA_IMAGENES.md](GUIA_IMAGENES.md)** - Guía de imágenes
- **[CLOUDINARY_INTEGRATION.md](CLOUDINARY_INTEGRATION.md)** - Integración Cloudinary

---

## 🏪 Información del Restaurante

**Nombre:** La Tasquita de Sara
**Dirección:** C. Lili Álvarez, 66, Valdemoro, Madrid 28342
**Coordenadas:** 40.201998253991874, -3.6892787099523385
**Instagram:** [@latasquitadesara](https://instagram.com/latasquitadesara)
**Tipo:** Bar de tapas moderno con hamburguesas gourmet, raciones y cocina de mercado

### Horarios

- **Lunes:** Cerrado
- **Martes y Miércoles:** 9:00 - 15:45
- **Jueves:** 9:00 - 15:45 y 20:00 - 23:00
- **Viernes:** 9:00 - 15:45 y 20:00 - 23:20
- **Sábado:** 10:00 - 15:45 y 20:00 - 23:20
- **Domingo:** 10:00 - 15:45

---

## 🔧 Troubleshooting

### Error: Admin accesible sin login

**Solución:** Verificar variables en Vercel:
- `NEXTAUTH_URL` = `https://tasquita.vercel.app`
- `NEXTAUTH_SECRET` configurado correctamente

### Error: Imágenes no cargan

**Solución:** Verificar variables de Cloudinary en Vercel.

### Error: Database connection

**Solución:** Verificar `DATABASE_URL` y que Neon database esté activo.

Ver más en [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🤝 Contribuir

Este proyecto es privado y propiedad de La Tasquita de Sara.

---

## 📄 Licencia

© 2026 La Tasquita de Sara. Todos los derechos reservados.

---

## 🔗 Links Útiles

- **Producción:** https://tasquita.vercel.app
- **Admin:** https://tasquita.vercel.app/admin/login
- **GitHub:** https://github.com/danielkrastev95/tasquita
- **Vercel Dashboard:** https://vercel.com/dashboard

---

**Última actualización:** 7 de Marzo 2026
**Versión:** 1.0.0 (Producción)
**Estado:** ✅ En producción
