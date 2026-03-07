# La Tasquita de Sara - Web Oficial

Web moderna y minimalista para el restaurante La Tasquita de Sara ubicado en Valdemoro, Madrid.

## Características

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **Tailwind CSS** con paleta de colores personalizada
- **Framer Motion** para animaciones suaves
- **React Hook Form** para validación de formularios
- Diseño **responsive** (mobile-first)
- **SEO optimizado** con metadata
- Imágenes optimizadas con next/image
- Scroll suave entre secciones

## Paleta de Colores

- Verde azulado (Primary): `#53A699`
- Dorado/Tostado (Gold): `#C7AF65`
- Blanco: `#FFFFFF`

## Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Ejecutar el servidor de desarrollo

```bash
npm run dev
```

### 3. Abrir en el navegador

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

## Estructura del Proyecto

```
la-tasquita-de-sara/
├── app/
│   ├── layout.tsx          # Layout principal con fuentes y metadata
│   ├── page.tsx            # Página principal
│   └── globals.css         # Estilos globales
├── components/
│   ├── Navbar.tsx          # Barra de navegación con scroll effect
│   ├── Hero.tsx            # Sección hero con imagen y CTAs
│   ├── MenuSection.tsx     # Menú con tabs interactivos
│   ├── AboutSection.tsx    # Sección sobre el restaurante
│   ├── ReservationSection.tsx  # Formulario de reservas
│   ├── ContactSection.tsx  # Información de contacto y mapa
│   └── Footer.tsx          # Footer
├── data/
│   └── menu.ts             # Datos del menú
├── hooks/
│   └── useScrollPosition.ts  # Hook para detectar scroll
└── public/                 # Archivos estáticos
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Funcionalidades

### Navegación
- Navbar fija que cambia de transparente a sólida al hacer scroll
- Menú hamburguesa responsive en móvil
- Navegación suave entre secciones

### Hero
- Imagen de fondo optimizada con next/image
- Overlay con gradiente personalizado
- Animaciones de entrada con Framer Motion
- Botones CTA para menú y reservas

### Menú
- Sistema de tabs para categorías
- Tarjetas minimalistas para cada plato
- Indicador de platos más pedidos
- Animaciones al cambiar de categoría

### Reservas
- Formulario validado con react-hook-form
- Validación de campos en tiempo real
- Mensaje de confirmación simulado
- Campos: nombre, teléfono, fecha, hora, comensales, mensaje

### Contacto
- Dirección completa
- Horarios formateados por días
- Enlace a Instagram
- Mapa de Google Maps integrado

## Tecnologías

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)

## Información del Restaurante

**Nombre:** La Tasquita de Sara
**Dirección:** C. Lili Álvarez, 66, Valdemoro, Madrid 28342
**Instagram:** [@latasquitadesara](https://instagram.com/latasquitadesara)
**Tipo:** Bar de tapas moderno con hamburguesas gourmet, raciones y cocina de mercado

### Horarios
- Lunes: Cerrado
- Martes y Miércoles: 9:00 - 15:45
- Jueves: 9:00 - 15:45 y 20:00 - 23:00
- Viernes: 9:00 - 15:45 y 20:00 - 23:20
- Sábado: 10:00 - 15:45 y 20:00 - 23:20
- Domingo: 10:00 - 15:45

## Personalización

Para modificar la información del restaurante:

1. **Menú:** Edita `data/menu.ts`
2. **Horarios:** Edita el array `schedule` en `components/ContactSection.tsx`
3. **Colores:** Edita `tailwind.config.ts`
4. **Metadata SEO:** Edita `app/layout.tsx`

## Deploy

Esta aplicación puede ser desplegada fácilmente en [Vercel](https://vercel.com):

```bash
npm run build
```

## Licencia

© 2024 La Tasquita de Sara. Todos los derechos reservados.
