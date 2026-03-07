#!/bin/bash
# Script para configurar variables de entorno en Vercel
# Ejecuta: bash vercel-env-setup.sh

echo "Configurando variables de entorno en Vercel..."

# DATABASE_URL
echo "postgresql://neondb_owner:npg_CSAbBnZMV28a@ep-gentle-violet-aki4hqth.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require" | vercel env add DATABASE_URL production preview development

# NEXTAUTH_URL
echo "https://tasquita.vercel.app" | vercel env add NEXTAUTH_URL production

# NEXTAUTH_SECRET
echo "2JtwwPhh3JeOlJO+YUOPoAufV3yp2pRtdyNcBWGtQiI=" | vercel env add NEXTAUTH_SECRET production preview development

# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
echo "djfbyhzaw" | vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME production preview development

# NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
echo "tasquita_uploads" | vercel env add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET production preview development

echo "✅ Variables configuradas. Ejecuta: vercel --prod"
