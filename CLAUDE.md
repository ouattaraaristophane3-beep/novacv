# NovaCV - Générateur de CV Professionnel

NovaCV est une application SaaS moderne pour créer des CV professionnels avec prévisualisation en temps réel, plusieurs modèles et export PDF.

## Fonctionnalités

### Fonctionnalités de base
- **Authentification Utilisateur** - Authentification sécurisée email/mot de passe avec Supabase Auth
- **Gestion de CV** - Créer, modifier, dupliquer et supprimer plusieurs CV
- **Édition en temps réel** - Édition de formulaire dynamique avec auto-sauvegarde (sans rechargement de page)
- **Aperçu en direct** - Visualisez les changements instantanément dans le panneau de prévisualisation
- **Export PDF** - Exportez les CV sous forme de documents PDF A4 professionnels
- **Téléchargement de Photo** - Ajoutez des photos de profil à votre CV
- **Support Multi-langue** - Interface en français et en anglais

### Modèles de CV
- **Moderne** - Design épuré et contemporain avec un en-tête coloré
- **Classique** - Mise en page traditionnelle à empattement avec une typographie élégante
- **Exécutif** - Mise en page sur deux colonnes idéale pour les cadres seniors
- **Minimaliste** - Design ultra-propre axé sur le contenu
- **Compatible ATS** - Optimisé pour les systèmes de suivi des candidatures (ATS)

### Thèmes de couleurs
- Bleu (par défaut)
- Gris
- Sarcelle
- Vert
- Rouge

### Sections
- **Informations personnelles** - Nom, coordonnées, résumé, photo de profil
- **Expérience professionnelle** - Emplois, postes, réalisations avec plages de dates
- **Formation** - Diplômes, institutions, domaines d'études
- **Compétences** - Compétences catégorisées avec niveaux de maîtrise (1-5)

## Stack Technique

- **Frontend** : React 18 + TypeScript + Vite
- **Stylisation** : Tailwind CSS
- **Icônes** : Lucide React
- **Backend** : Supabase (PostgreSQL, Auth, RLS)
- **Routage** : React Router v6

## Schéma de la base de données

### Tables (Tables)

#### profiles (profils)
- `id` (UUID, references auth.users)
- `email` (text, unique)
- `full_name` (text)
- `avatar_url` (text)
- `subscription_tier` (enum: free, professional, enterprise)

#### cvs (cv)
- `id` (UUID)
- `user_id` (UUID, references profiles)
- `title` (text)
- `template` (enum: modern, classic, executive, minimal, ats)
- `color_theme` (enum: blue, gray, teal, green, red)
- `language` (enum: fr, en)
- `personal_info` (JSONB)
- `is_draft` (boolean)

#### experiences (expériences)
- `id` (UUID)
- `cv_id` (UUID, references cvs)
- `company` (text)
- `position` (text)
- `location` (text)
- `start_date` / `end_date` (date)
- `is_current` (boolean)
- `description` (text)
- `achievements` (JSONB array)
- `display_order` (integer)

#### education (éducation)
- `id` (UUID)
- `cv_id` (UUID, references cvs)
- `institution` (text)
- `degree` (text)
- `field` (text)
- `start_date` / `end_date` (date)
- `is_current` (boolean)
- `description` (text)
- `achievements` (JSONB array)
- `display_order` (integer)

#### skills (compétences)
- `id` (UUID)
- `cv_id` (UUID, references cvs)
- `name` (text)
- `level` (integer 1-5)
- `category` (text)
- `display_order` (integer)

## Sécurité

Toutes les tables ont la sécurité au niveau des lignes (RLS) activée avec des politiques restrictives :
- Les utilisateurs ne peuvent accéder qu'à leurs propres données
- Les tables liées au CV sont supprimées en cascade lors de la suppression du CV
- Toutes les politiques vérifient la propriété via l'ID de l'utilisateur authentifié

## Feuille de route du développement

### Phase 1 : CRUD de base + AJAX (Terminé)
- [x] Schéma de base de données avec migrations
- [x] Système d'authentification
- [x] Opérations CRUD pour les CV
- [x] Édition en temps réel avec auto-sauvegarde
- [x] Aperçu en direct

### Phase 2 : Modèles + PDF (Terminé)
- [x] 5 modèles de CV
- [x] Thèmes de couleurs
- [x] Fonctionnalité d'exportation PDF

### Phase 3 : Thèmes + Langues (Terminé)
- [x] 5 thèmes de couleurs
- [x] Support français/anglais

### Phase 4 : Fonctionnalités Premium (Planifié)
- [ ] Rédaction assistée par IA
- [ ] Suggestions d'optimisation ATS
- [ ] Modèles premium
- [ ] Exportation PDF HD
- [ ] Suppression du filigrane

## Structure du projet

```
src/
├── components/
│   ├── auth/
│   │   └── AuthPage.tsx
│   ├── cv-editor/
│   │   ├── CVEditor.tsx
│   │   ├── PersonalInfoEditor.tsx
│   │   ├── ExperienceEditor.tsx
│   │   ├── EducationEditor.tsx
│   │   └── SkillsEditor.tsx
│   ├── cv-templates/
│   │   └── CVTemplates.tsx
│   └── dashboard/
│       └── Dashboard.tsx
├── context/
│   ├── AuthContext.tsx
│   └── CVContext.tsx
├── hooks/
│   └── useAutosave.ts
├── lib/
│   ├── supabase.ts
│   └── translations.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Environment Variables

Required in `.env`:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript type checking
```
