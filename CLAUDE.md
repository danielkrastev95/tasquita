# Documentación Claude - La Tasquita de Sara

Documentación del trabajo realizado en la sesión de desarrollo.

---

## Panel de Administración

### Acceso

- **URL:** http://localhost:3000/admin/login
- **Email:** admin@latasquitadesara.com
- **Contraseña:** admin123

### Funcionalidades Implementadas

#### 1. Gestión de Menú
- **Ubicación:** `/admin/menu`
- Crear, editar y eliminar categorías de menú
- Crear, editar y eliminar platos
- Reordenar categorías y platos
- Activar/desactivar categorías y platos
- Soporte para imágenes (local y URLs externas)
- Indicador de "Más pedido"
- Control de precios y descripciones

#### 2. Gestión de Eventos
- **Ubicación:** `/admin/events`
- Crear, editar y eliminar eventos
- Marcar evento como destacado (aparece en Hero)
- Activar/desactivar eventos
- Gestión de fechas y horarios
- Descripciones completas
- Soporte para imágenes de eventos

#### 3. Configuración General
- **Ubicación:** `/admin/settings`
- **Toggle Hero Eventos:** Mostrar/ocultar banner de evento destacado en Hero
- **Toggle Sección Eventos:** Mostrar/ocultar sección completa de eventos
- Información del restaurante (título, descripción, dirección)
- Redes sociales (Instagram, Facebook)
- Horarios de apertura por día
- Teléfono y email de contacto

---

## Sistema de Base de Datos

### Tecnología
- **ORM:** Prisma
- **Base de datos:** SQLite (local) - Migrable a PostgreSQL para producción
- **Ubicación:** `prisma/dev.db`

### Modelos

```prisma
- User (Usuarios del admin)
- Session (Sesiones de autenticación)
- MenuCategory (Categorías del menú)
- MenuItem (Platos del menú)
- Event (Eventos)
- SiteSettings (Configuración del sitio)
- Reservation (Reservas - estructura preparada)
```

### Comandos Útiles

```bash
# Ver/editar base de datos
npx prisma studio

# Aplicar cambios al schema
npx prisma db push

# Resetear base de datos (elimina todo)
npx prisma db push --force-reset

# Poblar con datos iniciales
npm run db:seed
```

---

## Autenticación

### NextAuth.js v5
- Configuración en `lib/auth.ts`
- Estrategia: JWT con credentials provider
- Contraseñas hasheadas con bcryptjs
- Middleware protege rutas `/admin/*` (excepto `/admin/login`)
- Sesiones persistentes

---

## Implementaciones Destacadas

### 1. Sistema Dual de Toggles para Eventos

Dos controles independientes en `/admin/settings`:

- **Toggle Hero:** Controla el banner del evento destacado en la parte superior (Hero)
- **Toggle Sección Eventos:** Controla la sección completa de eventos más abajo en la página

Ambos pueden estar activos/inactivos independientemente.

### 2. Botones de Delivery Apps en Hero

Ubicación: Parte inferior del Hero (`components/Hero.tsx:173-212`)

**Características:**
- Centrados horizontalmente
- Texto "Pide a domicilio" encima de los botones
- Sin iconos, solo texto con colores de marca
- Mismo tamaño (w-28) para ambos botones
- Animaciones hover con scale y movimiento vertical
- Enlaces abren en nueva pestaña (_blank)

**Apps integradas:**
- **Glovo:** Color #FFC244 (amarillo)
  - URL: https://glovoapp.com/es/es/valdemoro-ciempozuelos/stores/la-tasquita-de-sara-valdemoro
- **Uber Eats:** Color #06C167 (verde)
  - URL: https://www.ubereats.com/es/store/la-tasquita-de-sara/tWST6whgU2iUdY71PWw9jw

### 3. Configuración de Imágenes

Documentación completa en `GUIA_IMAGENES.md`

**Opciones disponibles:**

1. **Carpeta local:** `/public/images/menu/`
   - Usar rutas como: `/images/menu/nombre-plato.jpg`

2. **URLs externas:**
   - Unsplash: `https://images.unsplash.com/...`
   - Imgur: `https://i.imgur.com/...`
   - YouTube thumbnails: `https://i.ytimg.com/...`

**Dominios configurados en next.config.js:**
- images.unsplash.com
- i.ytimg.com
- i.imgur.com
- res.cloudinary.com
- localhost

---

## Carta Completa

33 platos distribuidos en 8 categorías:

1. **Para Compartir** (12 platos)
   - Destacado: Tortilla de Patata Clásica (Premio al mejor pincho de tortilla 2024)

2. **Ensaladas** (2 platos)

3. **Hamburguesas** (4 platos)
   - Destacado: Hamburguesa Angus & Trufa

4. **Bocadillos** (4 platos)

5. **De Carne Va La Cosa** (2 platos)

6. **Un Poco de Mar** (2 platos)

7. **Postres** (2 platos)

8. **Desayunos** (5 platos)

---

## Problemas Resueltos

### 1. Redirect Loop en Admin Login
**Problema:** Layout de admin protegía la ruta `/admin/login` causando loop infinito

**Solución:**
- Creado `app/admin/login/layout.tsx` que devuelve children directamente
- Middleware detecta ruta login y no redirige
- Admin layout detecta pathname y no aplica sidebar en login

### 2. Estilos no Cargando
**Problema:** CSS no aparecía en la página

**Solución:**
- Conflicto de puertos (3000, 3001, 3002)
- Limpieza de procesos en los puertos
- Eliminación de carpeta `.next`
- Reinicio del servidor en puerto 3000

### 3. Rutas de Imágenes Incorrectas
**Problema:** Error "must start with a leading slash"

**Solución:**
- Imágenes locales deben empezar con `/`
- Imágenes externas deben tener protocolo completo (https://)

### 4. Dominios de Imágenes no Configurados
**Problema:** Error "hostname is not configured"

**Solución:**
- Actualizado `next.config.js` con remotePatterns para todos los dominios externos

### 5. Toggle de Hero Eventos no Funcionaba
**Problema:** Banner aparecía aunque toggle estaba desactivado

**Solución:**
- Añadido campo `heroEventEnabled` en SiteSettings
- Modificada lógica en `app/page.tsx` para usar campo específico
- Script para activar valor por defecto en base de datos

---

## Estructura de Archivos Admin

```
app/
├── admin/
│   ├── layout.tsx              # Layout con sidebar
│   ├── page.tsx                # Dashboard principal
│   ├── login/
│   │   ├── layout.tsx          # Layout sin protección
│   │   └── page.tsx            # Formulario login
│   ├── menu/
│   │   ├── page.tsx            # Lista categorías
│   │   └── items/
│   │       ├── page.tsx        # Lista platos
│   │       ├── new/
│   │       │   └── page.tsx    # Crear plato
│   │       └── [id]/
│   │           └── page.tsx    # Editar plato
│   ├── events/
│   │   ├── page.tsx            # Lista eventos
│   │   ├── new/
│   │   │   └── page.tsx        # Crear evento
│   │   └── [id]/
│   │       └── page.tsx        # Editar evento
│   └── settings/
│       └── page.tsx            # Configuración general
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts        # Endpoints NextAuth
│   └── admin/
│       ├── menu/
│       │   ├── categories/
│       │   │   └── route.ts    # CRUD categorías
│       │   └── items/
│       │       ├── route.ts    # CRUD platos
│       │       └── [id]/
│       │           └── route.ts
│       ├── events/
│       │   ├── route.ts        # CRUD eventos
│       │   └── [id]/
│       │       └── route.ts
│       └── settings/
│           └── route.ts        # GET/PUT settings
```

---

## Componentes Admin

```
components/admin/
├── AdminSidebar.tsx            # Navegación lateral
├── CategoryForm.tsx            # Formulario categorías
├── MenuItemForm.tsx            # Formulario platos
├── EventForm.tsx               # Formulario eventos
└── SettingsForm.tsx            # Formulario configuración
```

---

## Variables de Entorno (.env)

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-key-aqui"
```

---

## Scripts Disponibles

```bash
# Desarrollo
npm run dev                      # Servidor desarrollo (puerto 3000)

# Base de datos
npm run db:seed                  # Poblar BD con datos iniciales
npx prisma studio                # Interfaz visual de BD
npx prisma db push               # Aplicar cambios schema

# Producción
npm run build                    # Build para producción
npm start                        # Servidor producción
```

---

## Próximos Pasos Sugeridos

### Corto Plazo
- [ ] Añadir imágenes reales a los platos del menú
- [ ] Probar sistema completo en diferentes dispositivos
- [ ] Configurar dominio de imagen adicional si se necesita
- [ ] Revisar y ajustar textos del sitio

### Medio Plazo
- [ ] Implementar gestión de reservas (modelo ya creado)
- [ ] Sistema de subida de imágenes directa en admin (sin URLs)
- [ ] Integración con Cloudinary para gestión profesional de imágenes
- [ ] Añadir más estadísticas al dashboard admin
- [ ] Sistema de notificaciones para nuevas reservas

### Largo Plazo (Producción)
- [ ] Migrar a PostgreSQL en Vercel/Railway
- [ ] Configurar dominio personalizado
- [ ] Añadir Google Analytics
- [ ] Implementar sistema de emails (reservas, contacto)
- [ ] Configurar backups automáticos de BD
- [ ] Añadir más usuarios admin con roles

---

## Contacto y Soporte

Para retomar el trabajo o resolver dudas:

1. **Servidor:** `npm run dev` → http://localhost:3000
2. **Admin:** http://localhost:3000/admin/login
3. **Base de datos:** `npx prisma studio`
4. **Documentación imágenes:** Ver `GUIA_IMAGENES.md`

---

## Notas Técnicas

### Performance
- Server Components para SEO y velocidad
- Imágenes optimizadas con next/image
- Lazy loading automático
- Dynamic rendering en páginas admin

### Seguridad
- Contraseñas hasheadas (bcryptjs)
- Rutas admin protegidas (middleware)
- CSRF protection (NextAuth)
- SQL injection protected (Prisma)

### Mobile First
- Diseño responsive en todos los componentes
- Sidebar colapsable en admin
- Formularios adaptados a móvil
- Touch-friendly controls

---

**Última actualización:** 28 de febrero de 2026
**Estado del proyecto:** ✅ Funcional y listo para desarrollo continuo
