#!/bin/bash
# Script para configurar variables de entorno en Vercel
# Ejecuta: bash vercel-env-setup.sh
# IMPORTANTE: Configura estas variables antes de ejecutar el script

echo "⚠️  IMPORTANTE: Edita este script con tus valores reales antes de ejecutarlo"
echo ""
echo "Configurando variables de entorno en Vercel..."

# DATABASE_URL - Obtén esto de Neon Console
read -p "DATABASE_URL (de Neon): " DATABASE_URL
echo "$DATABASE_URL" | vercel env add DATABASE_URL production preview development

# NEXTAUTH_URL
echo "https://tasquita.vercel.app" | vercel env add NEXTAUTH_URL production

# NEXTAUTH_SECRET - Genera con: openssl rand -base64 32
read -p "NEXTAUTH_SECRET (genera con 'openssl rand -base64 32'): " NEXTAUTH_SECRET
echo "$NEXTAUTH_SECRET" | vercel env add NEXTAUTH_SECRET production preview development

# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME - Obtén de Cloudinary Dashboard
read -p "CLOUDINARY_CLOUD_NAME: " CLOUDINARY_CLOUD_NAME
echo "$CLOUDINARY_CLOUD_NAME" | vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME production preview development

# NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET - Obtén de Cloudinary Dashboard
read -p "CLOUDINARY_UPLOAD_PRESET: " CLOUDINARY_UPLOAD_PRESET
echo "$CLOUDINARY_UPLOAD_PRESET" | vercel env add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET production preview development

echo "✅ Variables configuradas. Ejecuta: vercel --prod"
