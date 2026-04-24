import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cqkumhjujfgypjfsptfp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ET2z2RbpQY62ATUslTAEHg_1XIjP8S2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export type TeamMember = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  poste: string;
  date_arrivee: string;
  statut: 'actif' | 'inactif' | 'en_integration';
  avatar_color: string;
  created_at: string;
};

export type Integration = {
  id: string;
  user_id: string;
  member_id: string;
  titre: string;
  statut: 'en_cours' | 'termine' | 'en_pause';
  progression: number;
  date_debut: string;
  date_fin_prevue: string;
  notes: string;
  created_at: string;
  team_members?: TeamMember;
};

export type Formation = {
  id: string;
  user_id: string;
  member_id: string;
  titre: string;
  type_bilan: 'post-formation' | '4-6 mois';
  score: number;
  statut: 'planifie' | 'en_cours' | 'termine';
  date_formation: string;
  observations: string;
  created_at: string;
  team_members?: TeamMember;
};

export type TeamMood = {
  id: string;
  user_id: string;
  member_id: string;
  humeur: 'super' | 'bien' | 'moyen' | 'difficile';
  commentaire: string;
  semaine: string;
  created_at: string;
  team_members?: TeamMember;
};
