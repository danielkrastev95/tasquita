# Panel de Administración - La Tasquita de Sara

## 🎉 ¡Todo listo!

Tu panel de administración está completamente configurado y funcional. Ahora puedes gestionar todo el contenido de tu sitio web desde una interfaz fácil de usar.

## 🚀 Acceso al Panel

**URL:** http://localhost:3000/admin/login


⚠️ **IMPORTANTE:** Cambia la contraseña después del primer login (esta funcionalidad la puedes añadir después).

## 📋 ¿Qué puedes hacer en el panel?

### 1. **Dashboard** (`/admin`)
- Vista general con estadísticas
- Accesos rápidos a las funciones más usadas

### 2. **Gestión del Menú** (`/admin/menu`)
- Ver todas las categorías del menú
- Añadir nuevos platos
- Editar platos existentes (precio, descripción, imagen)
- Marcar platos como "Popular" o "Casero"
- Eliminar platos
- Los cambios se reflejan inmediatamente en el sitio público

### 3. **Gestión de Eventos** (`/admin/events`)
- Crear nuevos eventos
- Editar eventos existentes
- Marcar un evento como "Destacado" (aparecerá en el banner del Hero)
- Eliminar eventos
- Los eventos tienen categorías: Música, Gastronomía, Especial

### 4. **Configuración del Sitio** (`/admin/settings`)
- **Toggle de eventos:** Activa/desactiva toda la sección de eventos
- **Sección Hero:** Edita el título y subtítulo principal
- **Sección Sobre Nosotros:** Modifica los textos e historia del restaurante
- **Información de Contacto:** Actualiza dirección, código postal, Instagram

## 🔄 Cómo funciona

### Base de Datos
- Usamos **SQLite** para desarrollo local (archivo `prisma/dev.db`)
- Para producción, puedes cambiar fácilmente a **PostgreSQL** editando `prisma/schema.prisma`

### Flujo de Datos
1. Editas algo en el panel admin → Se guarda en la base de datos
2. La página pública lee de la base de datos → Muestra los cambios automáticamente
3. No necesitas reiniciar el servidor

### Archivos Importantes
- `prisma/schema.prisma` - Esquema de la base de datos
- `prisma/seed.ts` - Datos iniciales (ya ejecutado)
- `.env` - Variables de entorno (DATABASE_URL, NEXTAUTH_SECRET)
- `lib/prisma.ts` - Cliente de Prisma
- `lib/auth.ts` - Configuración de autenticación

## 🛠️ Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Ver la base de datos visualmente
npm run db:studio
# Abre http://localhost:5555

# Resetear base de datos y recargar datos iniciales
npm run db:push
npm run db:seed

# Compilar para producción
npm run build
npm start
```

## 📝 Migrar a Producción

### Opción 1: Vercel (Recomendado)

1. **Crear cuenta en Vercel** (gratis): https://vercel.com
2. **Crear base de datos PostgreSQL:**
   - Ve a https://vercel.com/storage
   - Crea un nuevo "Postgres Database"
   - Copia el `DATABASE_URL`

3. **Deploy del proyecto:**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

4. **Configurar variables de entorno en Vercel:**
   - Ve a tu proyecto en Vercel → Settings → Environment Variables
   - Añade:
     - `DATABASE_URL` - La URL de tu Postgres de Vercel
     - `NEXTAUTH_SECRET` - Genera uno nuevo con `openssl rand -base64 32`
     - `NEXTAUTH_URL` - Tu URL de producción (ej: https://latasquitadesara.com)

5. **Migrar base de datos:**
   ```bash
   # En tu computadora, con DATABASE_URL de producción en .env
   npx prisma db push
   npm run db:seed
   ```

### Opción 2: Servidor Propio (VPS)

Si tienes un servidor propio:

1. **Instalar PostgreSQL** en el servidor
2. **Crear base de datos:**
   ```sql
   CREATE DATABASE tasquita;
   CREATE USER tasquita_user WITH PASSWORD 'tu-password-seguro';
   GRANT ALL PRIVILEGES ON DATABASE tasquita TO tasquita_user;
   ```

3. **Actualizar `.env` con la URL de producción:**
   ```
   DATABASE_URL="postgresql://tasquita_user:tu-password-seguro@localhost:5432/tasquita"
   ```

4. **Deploy:**
   ```bash
   npm run build
   npm start
   ```

## 🔐 Seguridad

### Cambios recomendados para producción:

1. **Cambiar contraseña del admin:**
   - Accede a la base de datos (Prisma Studio o SQL directo)
   - Genera un hash: `bcrypt.hash("tu-nueva-contraseña", 12)`
   - Actualiza el campo `passwordHash` del usuario admin

2. **Variables de entorno seguras:**
   - Genera nuevo `NEXTAUTH_SECRET`: `openssl rand -base64 32`
   - No compartas el `.env` en Git (ya está en `.gitignore`)

3. **HTTPS en producción:**
   - Vercel lo hace automáticamente
   - En servidor propio: configura certificado SSL con Let's Encrypt

## 🎨 Personalización

### Colores del Panel
El panel usa los colores de tu marca:
- **Primary (Verde azulado):** `#53A699`
- **Gold (Dorado):** `#C7AF65`

Para cambiarlos, edita `tailwind.config.ts`.

### Añadir nuevos campos
Si quieres añadir más campos (ej: teléfono, email):

1. Edita `prisma/schema.prisma`
2. Ejecuta `npx prisma db push`
3. Actualiza los formularios en `/app/admin/settings/page.tsx`
4. Actualiza los componentes públicos para mostrar los nuevos datos

## 🐛 Solución de Problemas

### El sitio no muestra los datos de la base de datos
- Verifica que `npm run db:seed` se ejecutó correctamente
- Abre Prisma Studio: `npm run db:studio` y verifica que hay datos

### Error "Unauthorized" en el panel
- Cierra sesión y vuelve a iniciar
- Verifica que `NEXTAUTH_SECRET` está en `.env`

### Cambios en el panel no se reflejan en el sitio
- Refresca la página con `Ctrl+F5` (fuerza recarga)
- En producción, verifica que `dynamic = "force-dynamic"` está en `app/page.tsx`

### Base de datos bloqueada (SQLite)
- Cierra Prisma Studio si está abierto
- Reinicia el servidor de desarrollo

## 📚 Recursos

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **NextAuth.js:** https://authjs.dev
- **Tailwind CSS:** https://tailwindcss.com/docs

## 💡 Próximos Pasos Opcionales

1. **Gestión de usuarios:**
   - Añadir página para crear/editar usuarios admin
   - Diferentes roles (Admin, Editor, etc.)

2. **Reservas en el panel:**
   - Ver reservas recibidas
   - Marcar como confirmadas/canceladas

3. **Subida de imágenes:**
   - Integrar Cloudinary o AWS S3
   - Permitir subir imágenes desde el panel

4. **Analytics:**
   - Ver estadísticas de visitas
   - Platos más populares

5. **Notificaciones:**
   - Email cuando hay nueva reserva
   - Notificaciones push

---

¿Necesitas ayuda? Contacta al desarrollador que te ayudó a configurar esto.
