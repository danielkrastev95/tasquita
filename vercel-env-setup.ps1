# Script PowerShell para configurar variables de entorno en Vercel
# Ejecuta: .\vercel-env-setup.ps1
# IMPORTANTE: Configura estas variables antes de ejecutar el script

Write-Host "⚠️  IMPORTANTE: Edita este script con tus valores reales antes de ejecutarlo" -ForegroundColor Red
Write-Host ""
Write-Host "Configurando variables de entorno en Vercel..." -ForegroundColor Green

# DATABASE_URL - Obtén esto de Neon Console
Write-Host "`nConfigurando DATABASE_URL..." -ForegroundColor Yellow
$DATABASE_URL = Read-Host "DATABASE_URL (de Neon)"
$DATABASE_URL | vercel env add DATABASE_URL production preview development

# NEXTAUTH_URL
Write-Host "`nConfigurando NEXTAUTH_URL..." -ForegroundColor Yellow
"https://tasquita.vercel.app" | vercel env add NEXTAUTH_URL production

# NEXTAUTH_SECRET - Genera con: openssl rand -base64 32
Write-Host "`nConfigurando NEXTAUTH_SECRET..." -ForegroundColor Yellow
$NEXTAUTH_SECRET = Read-Host "NEXTAUTH_SECRET (genera con 'openssl rand -base64 32')"
$NEXTAUTH_SECRET | vercel env add NEXTAUTH_SECRET production preview development

# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME - Obtén de Cloudinary Dashboard
Write-Host "`nConfigurando NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME..." -ForegroundColor Yellow
$CLOUDINARY_CLOUD_NAME = Read-Host "CLOUDINARY_CLOUD_NAME"
$CLOUDINARY_CLOUD_NAME | vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME production preview development

# NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET - Obtén de Cloudinary Dashboard
Write-Host "`nConfigurando NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET..." -ForegroundColor Yellow
$CLOUDINARY_UPLOAD_PRESET = Read-Host "CLOUDINARY_UPLOAD_PRESET"
$CLOUDINARY_UPLOAD_PRESET | vercel env add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET production preview development

Write-Host "`n✅ Variables configuradas. Ejecuta: vercel --prod" -ForegroundColor Green
