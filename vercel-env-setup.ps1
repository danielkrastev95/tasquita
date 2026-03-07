# Script PowerShell para configurar variables de entorno en Vercel
# Ejecuta: .\vercel-env-setup.ps1

Write-Host "Configurando variables de entorno en Vercel..." -ForegroundColor Green

# DATABASE_URL
Write-Host "`nConfigurando DATABASE_URL..." -ForegroundColor Yellow
"postgresql://neondb_owner:npg_CSAbBnZMV28a@ep-gentle-violet-aki4hqth.c-3.us-west-2.aws.neon.tech/neondb?sslmode=require" | vercel env add DATABASE_URL production preview development

# NEXTAUTH_URL
Write-Host "`nConfigurando NEXTAUTH_URL..." -ForegroundColor Yellow
"https://tasquita.vercel.app" | vercel env add NEXTAUTH_URL production

# NEXTAUTH_SECRET
Write-Host "`nConfigurando NEXTAUTH_SECRET..." -ForegroundColor Yellow
"2JtwwPhh3JeOlJO+YUOPoAufV3yp2pRtdyNcBWGtQiI=" | vercel env add NEXTAUTH_SECRET production preview development

# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
Write-Host "`nConfigurando NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME..." -ForegroundColor Yellow
"djfbyhzaw" | vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME production preview development

# NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
Write-Host "`nConfigurando NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET..." -ForegroundColor Yellow
"tasquita_uploads" | vercel env add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET production preview development

Write-Host "`n✅ Variables configuradas. Ejecuta: vercel --prod" -ForegroundColor Green
