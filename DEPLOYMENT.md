# Guía de Deployment - La Tasquita de Sara

Guía rápida para deployar y mantener el proyecto en producción.

---

## 🌐 URLs

- **Producción:** https://tasquita.vercel.app
- **Admin:** https://tasquita.vercel.app/admin/login
- **Dashboard Vercel:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/danielkrastev95/tasquita.git

---

## 🔑 Credenciales

### Admin Panel
- **Credenciales:** Configuradas en la base de datos

### Base de Datos (Neon)
- **URL:** Ver variables de entorno
- **Branch:** develop (local) / main (producción)

---

## 📦 Variables de Entorno en Vercel

### Configuración Manual

1. Ve a: https://vercel.com/dashboard
2. Selecciona proyecto "tasquita"
3. Settings → Environment Variables
4. Añade estas 5 variables:

#### 1. DATABASE_URL
```
postgresql://user:password@host/database?sslmode=require
```
**Entornos:** Production, Preview, Development
**Obtener de:** Neon Console

#### 2. NEXTAUTH_URL
```
https://tasquita.vercel.app
```
**Entornos:** Production

#### 3. NEXTAUTH_SECRET
```
Generar con: openssl rand -base64 32
```
**Entornos:** Production, Preview, Development

#### 4. NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
```
Tu cloud name de Cloudinary
```
**Entornos:** Production, Preview, Development
**Obtener de:** Cloudinary Dashboard

#### 5. NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```
Tu upload preset de Cloudinary
```
**Entornos:** Production, Preview, Development
**Obtener de:** Cloudinary Dashboard

5. **Redeploy:** Deployments → "..." → Redeploy

### Configuración Automática (Scripts)

**Windows PowerShell:**
```powershell
.\vercel-env-setup.ps1
```

**Linux/Mac:**
```bash
bash vercel-env-setup.sh
```

---

## 🚀 Deploy a Producción

### Deploy Automático (Recomendado)

Vercel está conectado a GitHub y hace deploy automático cuando pusheas a `main`:

```bash
# Asegúrate de estar en develop
git checkout develop

# Hacer tus cambios y commit
git add .
git commit -m "Descripción del cambio"
git push origin develop

# Mergear a main para deploy automático
git checkout main
git merge develop
git push origin main

# Vercel detecta el push y deploya automáticamente
```

### Deploy Manual (CLI)

Si necesitas deploy manual o forzar redeploy:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login (primera vez)
vercel login

# Deploy a producción
vercel --prod
```

---

## 🔄 Workflow de Desarrollo

### Branches

- **develop** → Desarrollo activo
- **main** → Producción (auto-deploy en Vercel)

### Flujo Normal

1. Trabaja en `develop`
2. Haz commit y push regularmente
3. Cuando estés listo para producción:
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```
4. Vercel deploya automáticamente
5. Verifica en https://tasquita.vercel.app

---

## 🛠️ Comandos Útiles

### Local Development

```bash
# Instalar dependencias
npm install

# Servidor desarrollo
npm run dev

# Build local
npm run build

# Ver build localmente
npm start

# Ver base de datos
npx prisma studio

# Aplicar cambios schema
npx prisma db push
```

### Git

```bash
# Ver status
git status

# Ver ramas
git branch -a

# Cambiar rama
git checkout main

# Actualizar desde remoto
git pull origin main

# Ver último commit
git log -1
```

### Vercel CLI

```bash
# Ver variables de entorno
vercel env ls

# Añadir variable
vercel env add VARIABLE_NAME production

# Remover variable
vercel env rm VARIABLE_NAME production

# Ver deployments
vercel ls

# Ver logs
vercel logs
```

---

## 🐛 Troubleshooting

### Admin no pide login

**Problema:** Dashboard visible sin autenticación

**Solución:**
1. Verificar que `NEXTAUTH_URL` = `https://tasquita.vercel.app`
2. Verificar que `NEXTAUTH_SECRET` esté configurado
3. Limpiar caché: Deployments → "..." → Redeploy → Clear build cache

### Imágenes no cargan

**Problema:** Error 400 en imágenes de Cloudinary

**Solución:**
1. Verificar `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` está configurado correctamente
2. Verificar `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` está configurado correctamente
3. Redeploy el proyecto

### Error de Base de Datos

**Problema:** Cannot connect to database

**Solución:**
1. Verificar `DATABASE_URL` está correcta
2. Verificar que Neon database está activo
3. Verificar que la IP de Vercel no está bloqueada

### Build falla

**Problema:** TypeScript errors o build errors

**Solución:**
1. Hacer build local: `npm run build`
2. Solucionar errores localmente
3. Commit y push
4. Redeploy en Vercel

### Edge Function Size Limit

**Problema:** Error "size is X MB and your plan size limit is 1 MB"

**Solución:**
- ✅ Ya resuelto: `proxy.ts` es 26.5 KB
- Si vuelve a pasar: No importar Prisma/bcrypt en proxy.ts
- Mantener proxy ligero, solo headers y redirects

---

## 📊 Monitoring

### Vercel Dashboard

1. Ve a: https://vercel.com/dashboard
2. Selecciona proyecto "tasquita"
3. Tabs importantes:
   - **Deployments:** Ver historial de deploys
   - **Analytics:** Métricas de tráfico (si está activado)
   - **Logs:** Ver errores en tiempo real
   - **Settings → Domains:** Configurar dominio custom

### Logs en Tiempo Real

```bash
# Ver logs del deployment actual
vercel logs

# Ver logs de un deployment específico
vercel logs [deployment-url]
```

### Check de Salud

Testea estas URLs después de cada deploy:

- ✅ https://tasquita.vercel.app (Home)
- ✅ https://tasquita.vercel.app/admin (Debe redirigir a login)
- ✅ https://tasquita.vercel.app/admin/login (Formulario de login)

---

## 🔒 Seguridad

### Protección de Rutas

**Rutas protegidas:**
- `/admin/*` (excepto `/admin/login`)
- `/api/admin/*`

**Implementación:**
- `proxy.ts` → NextAuth wrapper
- `lib/auth.ts` → Callback `authorized()`

### Secrets

**Nunca commitear:**
- `.env` (ya en .gitignore)
- Contraseñas de base de datos
- API keys privadas

**Seguro commitear:**
- `.env.example` (plantilla sin valores reales)
- Código fuente
- Configuración pública

---

## 📈 Mejoras Futuras

### Corto Plazo

- [ ] Configurar dominio personalizado (latasquitadesara.com)
- [ ] Configurar Vercel Analytics
- [ ] Añadir Vercel Speed Insights

### Medio Plazo

- [ ] Configurar alertas de errores (Sentry)
- [ ] Implementar rate limiting
- [ ] Añadir backups automáticos de BD
- [ ] Configurar staging environment

### Largo Plazo

- [ ] Multi-region deployment
- [ ] CDN para assets estáticos
- [ ] Server-side caching (Redis)
- [ ] Automated testing pipeline

---

## 📞 Soporte

### Recursos

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **Neon Docs:** https://neon.tech/docs
- **NextAuth Docs:** https://next-auth.js.org/

### Contacto

- **GitHub Issues:** https://github.com/danielkrastev95/tasquita/issues
- **Vercel Support:** https://vercel.com/support

---

**Última actualización:** 7 de Marzo 2026
**Versión:** 1.0.0 (Producción)
