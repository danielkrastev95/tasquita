# Guía para Añadir Imágenes al Menú

## 🖼️ Opción 1: Carpeta Public (Recomendado para empezar)

### Pasos:

1. **Guarda tus imágenes en:**
   ```
   C:\Users\legen\Desktop\tasquita claude\public\images\menu\
   ```

2. **Formato recomendado:**
   - JPG o WebP
   - Tamaño: 800x600px o 1200x900px
   - Peso: menos de 500KB por imagen

3. **Nombra los archivos sin espacios:**
   - ✅ `hamburguesa-angus.jpg`
   - ✅ `langostinos-kataifi.jpg`
   - ❌ `Hamburguesa de Angus.jpg` (evita espacios y acentos)

4. **En el panel admin (http://localhost:3000/admin/menu):**
   - Edita el plato
   - En el campo "URL de Imagen" pon:
     ```
     /images/menu/hamburguesa-angus.jpg
     ```
   - Guarda

5. **¡Listo!** La imagen aparecerá en el menú

### Estructura de carpetas:
```
public/
  └── images/
      └── menu/
          ├── hamburguesa-angus.jpg
          ├── langostinos-kataifi.jpg
          ├── tortilla-patata.jpg
          ├── pulpo-batata.jpg
          └── tarta-queso.jpg
```

---

## 🌐 Opción 2: URLs Externas (Más rápido)

### Unsplash (Fotos profesionales gratis):
1. Ve a https://unsplash.com
2. Busca tu comida (ej: "burger", "tapas", "spanish food")
3. Click derecho en la imagen → Copiar dirección de imagen
4. Pega la URL en el campo de imagen del admin

**Ejemplo:**
```
https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80
```

### Imgur (Sube tus propias fotos):
1. Ve a https://imgur.com
2. Click en "New post"
3. Sube tu imagen
4. Click derecho → Copiar URL de la imagen
5. Pega en el admin

**Ejemplo:**
```
https://i.imgur.com/abc123.jpg
```

---

## ☁️ Opción 3: Cloudinary (Profesional)

Para cuando tengas muchas imágenes o necesites optimización automática.

### Configuración:

1. **Crear cuenta gratis en Cloudinary:**
   - Ve a https://cloudinary.com/users/register/free
   - Te dan 25GB de almacenamiento y 25GB de ancho de banda GRATIS

2. **Instalar dependencias:**
   ```bash
   npm install cloudinary next-cloudinary
   ```

3. **Añadir variables de entorno (.env):**
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="tu-cloud-name"
   CLOUDINARY_API_KEY="tu-api-key"
   CLOUDINARY_API_SECRET="tu-api-secret"
   ```

4. **Usar el widget de subida:**
   - Añadir un botón "Subir Imagen" en el formulario del admin
   - Las imágenes se suben directamente a Cloudinary
   - Se optimizan automáticamente (WebP, responsive)

---

## 📏 Tamaños Recomendados

Para que se vean bien en el sitio:

| Tipo de imagen | Tamaño recomendado | Peso máximo |
|----------------|-------------------|-------------|
| Platos del menú | 800x600px | 200KB |
| Eventos | 1200x800px | 300KB |
| Hero | 1920x1080px | 500KB |

---

## 🛠️ Herramientas para Optimizar Imágenes

Antes de subirlas, optimízalas:

1. **TinyPNG** (https://tinypng.com)
   - Reduce el peso sin perder calidad
   - Gratis, arrastra y suelta

2. **Squoosh** (https://squoosh.app)
   - De Google, convierte a WebP
   - Muy buena compresión

3. **ImageOptim** (Mac) o **FileOptimizer** (Windows)
   - Apps de escritorio para optimizar en lote

---

## 🎯 Recomendación Final

**Para empezar:** Usa la Opción 1 (carpeta public) o Opción 2 (URLs externas de Unsplash)

**Para producción:** Cambia a Cloudinary cuando tengas muchas imágenes

---

## ✅ Checklist Rápido

- [ ] Crear carpeta `public/images/menu/`
- [ ] Optimizar imágenes (TinyPNG)
- [ ] Guardar con nombres sin espacios
- [ ] Añadir URLs en el panel admin
- [ ] Verificar que se ven en el sitio público

---

## 💡 Tips

- Las imágenes hacen que los platos se vean más apetitosos ¡úsalas!
- No todas las categorías necesitan imágenes, céntrate en:
  - ⭐ Hamburguesas
  - ⭐ Platos destacados
  - ⭐ Postres
- Usa fotos con buena iluminación
- Evita fondos muy cargados
- Las fotos desde arriba (top-down) funcionan bien para comida
