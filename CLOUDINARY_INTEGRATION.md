# Integración de Cloudinary para Subida de Imágenes

Este proyecto usa **Cloudinary** para gestionar las imágenes del menú y eventos de forma profesional.

## ✅ ¿Qué se ha Implementado?

### 1. Componente ImageUpload Reutilizable

Un componente React personalizado que proporciona:

- ✨ **Drag & Drop**: Arrastra imágenes directamente
- 📷 **Widget profesional**: Interfaz de Cloudinary lista para usar
- 🖼️ **Preview en tiempo real**: Ve la imagen antes de guardar
- 🔄 **Cambiar/Eliminar**: Botones para gestionar la imagen
- 🌍 **Multi-fuente**: Sube desde tu computadora, URL o cámara
- 🇪🇸 **En español**: Todo el texto traducido
- ⚡ **Optimización automática**: Cloudinary optimiza las imágenes

### 2. Integración en Formularios

El componente ImageUpload está integrado en:

- ✅ Crear plato del menú (`/admin/menu/items/new`)
- ✅ Editar plato del menú (`/admin/menu/items/[id]`)
- ✅ Crear evento (`/admin/events/new`)
- ✅ Editar evento (`/admin/events/[id]`)

## 🎯 Cómo Usar

### En el Panel de Administración

1. Ve a **Menú → Añadir Plato** o **Eventos → Crear Evento**

2. En la sección **"Imagen"**, verás un área de subida:
   - Haz clic para abrir el widget de Cloudinary
   - O arrastra y suelta una imagen directamente

3. En el widget de Cloudinary puedes:
   - **Archivos**: Subir desde tu computadora
   - **Web**: Subir desde una URL
   - **Cámara**: Tomar una foto directamente

4. Una vez subida:
   - Verás el preview de la imagen
   - Pasa el mouse sobre la imagen para ver los botones **Cambiar** y **Eliminar**

5. Guarda el plato/evento normalmente

## 🔧 Configuración Técnica

### Variables de Entorno

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="djfbyhzaw"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="tasquita_uploads"
```

Estas variables están configuradas en:
- `.env` (desarrollo actual)
- `.env.develop` (rama develop)
- `.env.production` (rama main)

### Upload Preset de Cloudinary

**Nombre**: `tasquita_uploads`  
**Tipo**: Unsigned (permite subidas desde el cliente)  
**Carpeta**: `tasquita`  
**Configuración**:
- Formatos permitidos: JPG, JPEG, PNG, WEBP, GIF
- Tamaño máximo: 5MB
- Dimensiones máximas: 2000x2000px
- Optimización automática de calidad y formato

### Configuración Next.js

El dominio `res.cloudinary.com` ya está configurado en `next.config.js` para permitir la carga de imágenes de Cloudinary.

## 📂 Estructura de Archivos

```
components/admin/
└── ImageUpload.tsx              # Componente reutilizable

app/admin/
├── menu/items/
│   ├── new/page.tsx             # ✅ Integrado
│   └── [id]/page.tsx            # ✅ Integrado
└── events/
    ├── new/page.tsx             # ✅ Integrado
    └── [id]/page.tsx            # ✅ Integrado
```

## 🖼️ URLs de Imágenes

Las imágenes subidas a Cloudinary tendrán URLs como:

```
https://res.cloudinary.com/djfbyhzaw/image/upload/v1234567890/tasquita/nombre-imagen.jpg
```

Estas URLs son:
- **Permanentes**: No se eliminan automáticamente
- **Optimizadas**: Cloudinary sirve el formato y calidad óptimos
- **CDN global**: Rápidas en cualquier parte del mundo

## 🎨 Transformaciones de Cloudinary

Puedes añadir transformaciones a las URLs para:

- Cambiar tamaño: `/w_400,h_300/`
- Recortar: `/c_fill,g_face/`
- Aplicar efectos: `/e_blur:300/`
- Optimizar: `/q_auto,f_auto/`

Ejemplo:
```
https://res.cloudinary.com/djfbyhzaw/image/upload/w_400,h_300,c_fill,q_auto/tasquita/imagen.jpg
```

## 🔒 Seguridad

- **No se exponen API secrets**: El upload preset es "unsigned"
- **Restricciones del preset**: Solo permite imágenes hasta 5MB
- **Validación en el servidor**: Cloudinary valida formatos y tamaños
- **HTTPS**: Todas las conexiones son seguras

## 📊 Gestión de Imágenes

### Dashboard de Cloudinary

Accede a: https://console.cloudinary.com

Aquí puedes:
- Ver todas las imágenes subidas
- Organizar en carpetas
- Ver estadísticas de uso
- Eliminar imágenes antiguas
- Configurar transformaciones

### Cuota Gratuita

Cloudinary Free Tier incluye:
- 25 GB de almacenamiento
- 25 GB de ancho de banda/mes
- Transformaciones ilimitadas

Suficiente para un sitio de restaurante pequeño-mediano.

## 🚀 Migración de Imágenes Antiguas

Si tienes imágenes que usaban URLs externas (Unsplash, Imgur, etc.):

1. Ve al panel de admin
2. Edita el plato/evento
3. La imagen actual se mostrará en el preview
4. Haz clic en "Cambiar" para subir a Cloudinary
5. Guarda los cambios

Las imágenes antiguas seguirán funcionando, pero es recomendable migrarlas a Cloudinary para:
- Mayor control
- Mejor rendimiento
- Evitar enlaces rotos

## 🐛 Troubleshooting

### "Cloudinary script not loaded"

**Problema**: El widget no se carga

**Solución**:
1. Verifica que tengas conexión a internet
2. Refresca la página (F5)
3. Revisa la consola del navegador para errores

### "Upload failed"

**Problema**: La imagen no se sube

**Soluciones**:
- Verifica que la imagen sea menor a 5MB
- Asegúrate de que sea un formato válido (JPG, PNG, WEBP, GIF)
- Revisa que el upload preset esté activo en Cloudinary

### Las imágenes no se cargan

**Problema**: Aparece error 404 en las imágenes

**Solución**:
- Verifica que `res.cloudinary.com` esté en `next.config.js`
- Reinicia el servidor de desarrollo
- Verifica que la URL de la imagen sea correcta

## 📖 Recursos

- [Cloudinary Upload Widget Docs](https://cloudinary.com/documentation/upload_widget)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Cloudinary Transformations](https://cloudinary.com/documentation/image_transformations)

---

**Última actualización**: 7 de marzo de 2026  
**Estado**: ✅ Integración completada y funcional
