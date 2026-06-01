/*
  # Initial Schema for NovaCV

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `subscription_tier` (text, default 'free')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `cvs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `template` (text, default 'modern')
      - `color_theme` (text, default 'blue')
      - `language` (text, default 'fr')
      - `personal_info` (jsonb)
      - `is_draft` (boolean, default true)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
    - `experiences`
      - `id` (uuid, primary key)
      - `cv_id` (uuid, references cvs)
      - `company` (text)
      - `position` (text)
      - `location` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `is_current` (boolean, default false)
      - `description` (text)
      - `achievements` (jsonb, array of text)
      - `display_order` (integer, default 0)
      - `created_at` (timestamptz)
      
    - `education`
      - `id` (uuid, primary key)
      - `cv_id` (uuid, references cvs)
      - `institution` (text)
      - `degree` (text)
      - `field` (text)
      - `location` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `is_current` (boolean, default false)
      - `description` (text)
      - `achievements` (jsonb, array of text)
      - `display_order` (integer, default 0)
      - `created_at` (timestamptz)
      
    - `skills`
      - `id` (uuid, primary key)
      - `cv_id` (uuid, references cvs)
      - `name` (text)
      - `level` (integer, default 3)
      - `category` (text)
      - `display_order` (integer, default 0)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Policies ensure users can only access their own data
    - CV-related tables cascade delete when CV is deleted
*/

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'professional', 'enterprise')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- CVs table
CREATE TABLE IF NOT EXISTS cvs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Mon CV',
  template text DEFAULT 'modern' CHECK (template IN ('modern', 'classic', 'executive', 'minimal', 'ats')),
  color_theme text DEFAULT 'blue' CHECK (color_theme IN ('blue', 'gray', 'teal', 'green', 'red')),
  language text DEFAULT 'fr' CHECK (language IN ('fr', 'en')),
  personal_info jsonb DEFAULT '{"firstName": "", "lastName": "", "email": "", "phone": "", "address": "", "summary": "", "photo": ""}'::jsonb,
  is_draft boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cv_id uuid NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  company text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  location text DEFAULT '',
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text DEFAULT '',
  achievements jsonb DEFAULT '[]'::jsonb,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cv_id uuid NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  institution text NOT NULL DEFAULT '',
  degree text NOT NULL DEFAULT '',
  field text DEFAULT '',
  location text DEFAULT '',
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text DEFAULT '',
  achievements jsonb DEFAULT '[]'::jsonb,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cv_id uuid NOT NULL REFERENCES cvs(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  level integer DEFAULT 3 CHECK (level >= 1 AND level <= 5),
  category text DEFAULT 'Technical',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- CVs policies
CREATE POLICY "Users can view own CVs"
  ON cvs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = cvs.user_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can create own CVs"
  ON cvs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own CVs"
  ON cvs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = cvs.user_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own CVs"
  ON cvs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = cvs.user_id
      AND profiles.id = auth.uid()
    )
  );

-- Experiences policies
CREATE POLICY "Users can view experiences in own CVs"
  ON experiences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = experiences.cv_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can create experiences in own CVs"
  ON experiences FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = experiences.cv_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update experiences in own CVs"
  ON experiences FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = experiences.cv_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = experiences.cv_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete experiences in own CVs"
  ON experiences FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = experiences.cv_id
      AND profiles.id = auth.uid()
    )
  );

-- Education policies
CREATE POLICY "Users can view education in own CVs"
  ON education FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = education.cv_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can create education in own CVs"
  ON education FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = education.cv_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update education in own CVs"
  ON education FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = education.cv_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = education.cv_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete education in own CVs"
  ON education FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = education.cv_id
      AND profiles.id = auth.uid()
    )
  );

-- Skills policies
CREATE POLICY "Users can view skills in own CVs"
  ON skills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = skills.cv_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can create skills in own CVs"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = skills.cv_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can update skills in own CVs"
  ON skills FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = skills.cv_id
      AND profiles.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = skills.cv_id
      AND profiles.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete skills in own CVs"
  ON skills FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM cvs
      INNER JOIN profiles ON profiles.id = cvs.user_id
      WHERE cvs.id = skills.cv_id
      AND profiles.id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_experiences_cv_id ON experiences(cv_id);
CREATE INDEX IF NOT EXISTS idx_education_cv_id ON education(cv_id);
CREATE INDEX IF NOT EXISTS idx_skills_cv_id ON skills(cv_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();