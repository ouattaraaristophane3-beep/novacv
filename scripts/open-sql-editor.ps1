# Ouvre le SQL Editor Supabase (migration manuelle)
$envFile = Join-Path $PSScriptRoot "..\.env"
if (-not (Test-Path $envFile)) {
  Write-Host ".env introuvable." -ForegroundColor Red
  exit 1
}
$url = (Get-Content $envFile | Where-Object { $_ -match '^VITE_SUPABASE_URL=' }) -replace '^VITE_SUPABASE_URL=', '' -replace '"', '' -replace "'", ''
if ($url -match 'https://([a-z0-9]+)\.supabase\.co') {
  $ref = $Matches[1]
  $sqlUrl = "https://supabase.com/dashboard/project/$ref/sql/new"
  Write-Host "Ouverture du SQL Editor : $sqlUrl" -ForegroundColor Cyan
  Write-Host "Collez le fichier : supabase\apply-all-migrations.sql" -ForegroundColor Yellow
  Start-Process $sqlUrl
} else {
  Write-Host "VITE_SUPABASE_URL invalide dans .env" -ForegroundColor Red
}
