# Configuration NovaCV — installation + migration + lancement
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "`n=== NovaCV — Configuration ===`n" -ForegroundColor Cyan

if (-not (Test-Path "node_modules")) {
  Write-Host "Installation des dependances npm..." -ForegroundColor Yellow
  npm install
}

if (-not (Test-Path ".env")) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Write-Host "Fichier .env cree depuis .env.example" -ForegroundColor Green
  } else {
    Write-Host "Erreur: .env manquant. Creez-le avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY." -ForegroundColor Red
    exit 1
  }
}

$envContent = Get-Content ".env" -Raw
if ($envContent -notmatch "SUPABASE_DB_PASSWORD=" -and $envContent -notmatch "DATABASE_URL=") {
  Write-Host @"

Pour appliquer les migrations sur Supabase, le mot de passe base est requis (une seule fois).
Dashboard Supabase → Project Settings → Database → Database password

"@ -ForegroundColor Yellow
  $pwd = Read-Host "Mot de passe base de donnees Supabase" -AsSecureString
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($pwd)
  )
  Add-Content ".env" "`nSUPABASE_DB_PASSWORD=$plain"
  Write-Host "SUPABASE_DB_PASSWORD enregistre dans .env" -ForegroundColor Green
}

Write-Host "`nApplication des migrations SQL..." -ForegroundColor Yellow
npm run db:migrate
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`nDemarrage du serveur de developpement (Ctrl+C pour arreter)...`n" -ForegroundColor Green
npm run dev
