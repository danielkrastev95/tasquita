# Configuración de Bases de Datos

Este proyecto utiliza **Neon PostgreSQL** con dos ramas separadas para desarrollo y producción.

## Arquitectura de Base de Datos

### Desarrollo (Rama `develop`)
- **Base de datos:** Neon PostgreSQL - Rama `develop`
- **Endpoint:** Ver Neon Console
- **Archivo de configuración:** `.env.develop`

### Producción (Rama `main`)
- **Base de datos:** Neon PostgreSQL - Rama `main`
- **Endpoint:** Ver Neon Console
- **Archivo de configuración:** `.env.production`

## Configuración Inicial

### 1. Archivos de Entorno

Crea los archivos `.env.develop` y `.env.production` basándote en `.env.example`:

```bash
# .env.develop (para rama develop)
DATABASE_URL="postgresql://user:password@host-develop/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

```bash
# .env.production (para rama main)
DATABASE_URL="postgresql://user:password@host-production/database?sslmode=require"
NEXTAUTH_URL="https://tu-dominio-produccion.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### 2. Cambiar entre Entornos

**Para desarrollo (rama develop):**
```bash
git checkout develop
cp .env.develop .env
npm run dev
```

**Para producción (rama main):**
```bash
git checkout main
cp .env.production .env
npm run build
npm start
```

## Comandos Útiles

### Desarrollo

```bash
# Cambiar a desarrollo
cp .env.develop .env

# Aplicar cambios del schema
npx prisma db push

# Ver base de datos en el navegador
npx prisma studio

# Poblar con datos iniciales
npm run db:seed
```

### Producción

```bash
# Cambiar a producción
cp .env.production .env

# Aplicar cambios del schema
npx prisma db push

# Poblar con datos iniciales (solo primera vez)
npm run db:seed
```

### Gestión con Neon CLI

```bash
# Listar proyectos
npx neonctl projects list

# Ver ramas del proyecto
npx neonctl branches list --project-id jolly-glitter-32281018

# Crear nueva rama
npx neonctl branches create --project-id jolly-glitter-32281018 --name nueva-rama

# Ver información de conexión
npx neonctl connection-string --project-id jolly-glitter-32281018 --branch develop
```

## Estructura de Datos

El proyecto incluye los siguientes modelos:

- **User** - Usuarios administradores
- **Session** - Sesiones de autenticación
- **MenuCategory** - Categorías del menú
- **MenuItem** - Platos del menú
- **Event** - Eventos del restaurante
- **SiteSettings** - Configuración general
- **Reservation** - Reservas (preparado para futuro)

## Credenciales de Admin

Ver script de seed (`prisma/seed.ts`) para credenciales iniciales.

⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login en producción.

## Migraciones vs Push

Este proyecto usa `prisma db push` en lugar de migraciones porque:
- Es más rápido para desarrollo
- Neon maneja el versionado de ramas automáticamente
- Ideal para prototipos y cambios rápidos

Para producción seria, considera usar:
```bash
npx prisma migrate dev --name descripcion-cambio
npx prisma migrate deploy
```

## Backups

Neon realiza backups automáticos. Para restaurar:

1. Ve a [Neon Console](https://console.neon.tech)
2. Selecciona el proyecto "La Tasquita de Sara"
3. Ve a la sección "Backups"
4. Selecciona el punto de restauración

## Solución de Problemas

### Error: "Can't reach database server"
```bash
# Verifica que la URL de conexión sea correcta
npx prisma db pull

# Si falla, regenera el cliente
npx prisma generate
```

### Error: "Table does not exist"
```bash
# Aplica el schema nuevamente
npx prisma db push
```

### Error: "Permission denied"
```bash
# Detén el servidor de desarrollo
# Elimina y regenera el cliente de Prisma
rm -rf node_modules/.prisma
npx prisma generate
```

## Más Información

- [Neon Documentation](https://neon.tech/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js Database Guide](https://nextjs.org/docs/app/building-your-application/data-fetching)
