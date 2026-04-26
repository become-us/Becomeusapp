import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';

export interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: string;
  color: string;
  visible: boolean;
  isCustom?: boolean;
}

export interface AppSettings {
  appName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  lavenderColor: string;
  greenColor: string;
  logoBase64: string;
  navItems: NavItem[];
}

export const DEFAULT_NAV: NavItem[] = [
  { id: 'dashboard',    label: 'Tableau de bord',   to: '/dashboard',    icon: 'LayoutDashboard', color: '#7A90B5', visible: true },
  { id: 'equipe',       label: 'Mon équipe',         to: '/equipe',       icon: 'Users',           color: '#7A90B5', visible: true },
  { id: 'integrations', label: 'Mes intégrations',   to: '/integrations', icon: 'Rocket',          color: '#C4956A', visible: true },
  { id: 'formations',   label: 'Mes formations',     to: '/formations',   icon: 'BookOpen',        color: '#9B85C4', visible: true },
  { id: 'meteo',        label: "Météo d'équipe",     to: '/meteo',        icon: 'CloudSun',        color: '#6BB5A0', visible: true },
];

export const DEFAULT_SETTINGS: AppSettings = {
  appName: 'BecomeUs',
  tagline: 'On arrive seul. On repart en équipe.',
  primaryColor: '#7A90B5',
  accentColor: '#C4956A',
  lavenderColor: '#9B85C4',
  greenColor: '#6BB5A0',
  logoBase64: '',
  navItems: DEFAULT_NAV,
};

interface SettingsCtx {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  saveSettings: () => Promise<void>;
  saving: boolean;
  resetSettings: () => void;
  loaded: boolean;
}

const Ctx = createContext<SettingsCtx | null>(null);
export const useSettings = () => useContext(Ctx)!;

export function SettingsProvider({ children }: React.PropsWithChildren) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) { setLoaded(true); return; }
    const load = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();
      if (data?.settings) {
        const saved = data.settings as Partial<AppSettings>;
        const savedNav: NavItem[] = saved.navItems || [];
        // Merge built-in nav items with saved overrides
        const merged = DEFAULT_NAV.map(def => {
          const override = savedNav.find(n => n.id === def.id);
          return override ? { ...def, ...override } : def;
        });
        // Append custom pages
        const customs = savedNav.filter(n => n.isCustom);
        setSettings({ ...DEFAULT_SETTINGS, ...saved, navItems: [...merged, ...customs] });
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  const saveSettings = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('app_settings').upsert(
      { user_id: user.id, settings, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
    setSaving(false);
  }, [user, settings]);

  const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  return (
    <Ctx.Provider value={{ settings, updateSettings, saveSettings, saving, resetSettings, loaded }}>
      {children}
    </Ctx.Provider>
  );
}
