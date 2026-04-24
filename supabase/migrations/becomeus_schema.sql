
-- Membres de l'équipe
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text,
  poste text,
  date_arrivee date,
  statut text DEFAULT 'actif' CHECK (statut IN ('actif','inactif','en_integration')),
  avatar_color text DEFAULT '#7A90B5',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own team" ON team_members FOR ALL USING (auth.uid() = user_id);

-- Intégrations (suivi parcours)
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  titre text NOT NULL,
  statut text DEFAULT 'en_cours' CHECK (statut IN ('en_cours','termine','en_pause')),
  progression integer DEFAULT 0 CHECK (progression >= 0 AND progression <= 100),
  date_debut date DEFAULT CURRENT_DATE,
  date_fin_prevue date,
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own integrations" ON integrations FOR ALL USING (auth.uid() = user_id);

-- Formations
CREATE TABLE IF NOT EXISTS formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES team_members(id) ON DELETE SET NULL,
  titre text NOT NULL,
  type_bilan text DEFAULT 'post-formation' CHECK (type_bilan IN ('post-formation','4-6 mois')),
  score numeric(3,1),
  statut text DEFAULT 'planifie' CHECK (statut IN ('planifie','en_cours','termine')),
  date_formation date,
  observations text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own formations" ON formations FOR ALL USING (auth.uid() = user_id);

-- Météo d'équipe (votes hebdo)
CREATE TABLE IF NOT EXISTS team_mood (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES team_members(id) ON DELETE CASCADE,
  humeur text NOT NULL CHECK (humeur IN ('super','bien','moyen','difficile')),
  commentaire text,
  semaine date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE team_mood ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own moods" ON team_mood FOR ALL USING (auth.uid() = user_id);
