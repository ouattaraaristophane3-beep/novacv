#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo ""
echo "=== NovaCV — Configuration ==="
echo ""

if [ ! -d node_modules ]; then
  echo "Installation des dépendances npm..."
  npm install
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Fichier .env créé depuis .env.example"
fi

if ! grep -qE '^(SUPABASE_DB_PASSWORD|DATABASE_URL)=' .env 2>/dev/null; then
  echo ""
  echo "Mot de passe base : Supabase Dashboard → Project Settings → Database"
  read -rsp "Mot de passe base de données Supabase : " DB_PASS
  echo ""
  echo "SUPABASE_DB_PASSWORD=$DB_PASS" >> .env
fi

echo ""
echo "Application des migrations SQL..."
npm run db:migrate

echo ""
echo "Démarrage du serveur (Ctrl+C pour arrêter)..."
npm run dev
