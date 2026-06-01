/**
 * Applique les migrations SQL sur la base Supabase (locale ou distante).
 * Variables .env : DATABASE_URL ou (VITE_SUPABASE_URL + SUPABASE_DB_PASSWORD)
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const migrationsDir = join(root, 'supabase', 'migrations');

function loadEnv() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!supabaseUrl || !password) return null;

  const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  if (!match) return null;
  const ref = match[1];
  const encoded = encodeURIComponent(password);
  return `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`;
}

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _nova_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz DEFAULT now()
    );
  `);
}

async function isApplied(client, name) {
  const { rows } = await client.query('SELECT 1 FROM _nova_migrations WHERE name = $1', [name]);
  return rows.length > 0;
}

async function applyFile(client, name, sql) {
  console.log(`→ ${name}`);
  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query('INSERT INTO _nova_migrations (name) VALUES ($1) ON CONFLICT DO NOTHING', [name]);
    await client.query('COMMIT');
    console.log(`  ✓ OK`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

async function schemaAlreadyInitialized(client) {
  const { rows } = await client.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'profiles'
    ) AS ok;
  `);
  return rows[0]?.ok === true;
}

async function main() {
  loadEnv();
  const dbUrl = getDatabaseUrl();

  if (!dbUrl) {
    console.error(`
❌ Connexion base de données manquante.

Ajoutez dans le fichier .env l'une des options :

  DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.VOTRE_REF.supabase.co:5432/postgres

ou :

  SUPABASE_DB_PASSWORD=votre_mot_de_passe_db
  VITE_SUPABASE_URL=https://votre-ref.supabase.co

Mot de passe : Supabase Dashboard → Project Settings → Database → Database password
`);
    process.exit(1);
  }

  if (!existsSync(migrationsDir)) {
    console.error('Dossier supabase/migrations introuvable.');
    process.exit(1);
  }

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('Connexion à la base établie.\n');
    await ensureMigrationsTable(client);

    const hasSchema = await schemaAlreadyInitialized(client);

    for (const file of files) {
      if (await isApplied(client, file)) {
        console.log(`⊘ ${file} (déjà appliquée)`);
        continue;
      }
      if (file.includes('initial_schema') && hasSchema) {
        await client.query(
          'INSERT INTO _nova_migrations (name) VALUES ($1) ON CONFLICT DO NOTHING',
          [file]
        );
        console.log(`⊘ ${file} (schéma déjà présent, ignorée)`);
        continue;
      }
      const sql = readFileSync(join(migrationsDir, file), 'utf8');
      await applyFile(client, file, sql);
    }

    console.log('\n✅ Toutes les migrations sont à jour.');
  } catch (err) {
    console.error('\n❌ Erreur migration:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
