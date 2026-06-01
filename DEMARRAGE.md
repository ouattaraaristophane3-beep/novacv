# Démarrer NovaCV en local

## Méthode rapide (Windows)

1. Ouvrez PowerShell dans ce dossier.
2. Exécutez :

```powershell
.\scripts\setup.ps1
```

Le script installe les dépendances, demande le **mot de passe base Supabase** (une fois), applique les migrations et lance `npm run dev`.

## Méthode manuelle

```bash
npm install
```

Ajoutez dans `.env` (en plus de `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`) :

```env
SUPABASE_DB_PASSWORD=votre_mot_de_passe
```

Mot de passe : [Supabase Dashboard](https://supabase.com/dashboard) → votre projet → **Project Settings** → **Database** → **Database password**.

Puis :

```bash
npm run db:migrate
npm run dev
```

Ouvrez l’URL affichée (souvent http://localhost:5173).

## Si la migration automatique échoue

1. Ouvrez **SQL Editor** dans le dashboard Supabase.
2. Collez le contenu de `supabase/apply-all-migrations.sql`.
3. Cliquez **Run**.

## Commandes utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run db:migrate` | Appliquer les migrations SQL |
| `npm run build` | Build production |
| `npm run typecheck` | Vérification TypeScript |
