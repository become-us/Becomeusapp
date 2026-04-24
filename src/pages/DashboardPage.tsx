import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Users, Rocket, BookOpen, CloudSun, UserPlus, ArrowRight, Pencil, Check, X } from 'lucide-react';

interface Stats { team: number; integrations: number; formations: number; mood: string; }

/* ---- types modifiables ---- */
interface CardConfig { label: string; desc: string; color: string; bg: string; }
interface KpiConfig  { label: string; color: string; bg: string; }

const CARD_DEFAULTS: CardConfig[] = [
  { label: 'Mon équipe',       desc: 'Gérez vos collaborateurs', color: '#7A90B5', bg: '#EDF2FB' },
  { label: 'Mes intégrations', desc: 'Suivez les parcours',      color: '#C4956A', bg: '#FDF3EC' },
  { label: 'Mes formations',   desc: 'Bilans post-formation',    color: '#9B85C4', bg: '#F3EFFC' },
  { label: "Météo d'équipe",   desc: "Humeur de l'équipe",       color: '#6BB5A0', bg: '#EFFAF6' },
];
const KPI_DEFAULTS: KpiConfig[] = [
  { label: 'Membres',              color: '#7A90B5', bg: '#EDF2FB' },
  { label: 'Intégrations',         color: '#C4956A', bg: '#FDF3EC' },
  { label: 'Formations',           color: '#9B85C4', bg: '#F3EFFC' },
  { label: 'Météo cette semaine',  color: '#6BB5A0', bg: '#EFFAF6' },
];
const CARD_ROUTES = ['/equipe','/integrations','/formations','/meteo'];
const CARD_ICONS  = [Users, Rocket, BookOpen, CloudSun];
const KPI_ICONS   = [Users, Rocket, BookOpen, CloudSun];
const KPI_KEYS    = ['team','integrations','formations','mood'] as const;

function loadLS<T>(key: string, def: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function saveLS(key: string, val: unknown) { localStorage.setItem(key, JSON.stringify(val)); }

/* ---- mini éditeur inline ---- */
function Editable({ value, onChange, textarea, style }: {
  value: string; onChange: (v: string) => void; textarea?: boolean; style?: React.CSSProperties;
}) {
  const [v, setV] = useState(value);
  const props = {
    value: v,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV(e.target.value),
    onBlur: () => onChange(v),
    className: 'bg-white/80 border border-dashed border-blue-300 rounded px-1 focus:outline-none focus:ring-1 focus:ring-blue-400 w-full text-inherit font-inherit',
    style,
  };
  return textarea
    ? <textarea {...props} rows={2} className={props.className + ' resize-none text-sm'} />
    : <input {...props} />;
}

function ColorDot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="relative cursor-pointer" title="Changer la couleur">
      <span className="w-5 h-5 rounded-full border-2 border-white shadow inline-block" style={{ background: value }} />
      <input type="color" value={value} onChange={e => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
    </label>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ team: 0, integrations: 0, formations: 0, mood: '—' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [cards, setCards] = useState<CardConfig[]>(() => loadLS('bu_dash_cards', CARD_DEFAULTS));
  const [kpis,  setKpis]  = useState<KpiConfig[]>(() => loadLS('bu_dash_kpis',  KPI_DEFAULTS));
  const [greeting, setGreeting] = useState(() => loadLS('bu_dash_greeting', 'Voici un aperçu de votre équipe aujourd\'hui'));
  const [quickTitle, setQuickTitle] = useState(() => loadLS('bu_dash_qt', 'Ajouter un nouveau membre'));
  const [quickDesc,  setQuickDesc]  = useState(() => loadLS('bu_dash_qd', 'Intégrez un nouveau talent dans votre équipe'));

  const prenom = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Coach';

  useEffect(() => {
    const load = async () => {
      const [t, i, f, m] = await Promise.all([
        supabase.from('team_members').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('integrations').select('id', { count: 'exact' }).eq('user_id', user!.id).eq('statut', 'en_cours'),
        supabase.from('formations').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('team_mood').select('humeur').eq('user_id', user!.id).gte('semaine', new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]),
      ]);
      const moods = m.data || [];
      const mc: Record<string, number> = {};
      moods.forEach((r: { humeur: string }) => { mc[r.humeur] = (mc[r.humeur] || 0) + 1; });
      const top = Object.entries(mc).sort((a, b) => b[1] - a[1])[0]?.[0];
      const emoji: Record<string, string> = { super:'😄', bien:'😊', moyen:'😐', difficile:'😔' };
      setStats({ team: t.count||0, integrations: i.count||0, formations: f.count||0, mood: emoji[top] || '—' });
      setLoading(false);
    };
    if (user) load();
  }, [user]);

  const saveAll = () => {
    saveLS('bu_dash_cards', cards);
    saveLS('bu_dash_kpis', kpis);
    saveLS('bu_dash_greeting', greeting);
    saveLS('bu_dash_qt', quickTitle);
    saveLS('bu_dash_qd', quickDesc);
    setEditMode(false);
  };
  const resetAll = () => {
    setCards(CARD_DEFAULTS); setKpis(KPI_DEFAULTS);
    setGreeting('Voici un aperçu de votre équipe aujourd\'hui');
    setQuickTitle('Ajouter un nouveau membre');
    setQuickDesc('Intégrez un nouveau talent dans votre équipe');
    ['bu_dash_cards','bu_dash_kpis','bu_dash_greeting','bu_dash_qt','bu_dash_qd'].forEach(k => localStorage.removeItem(k));
  };

  const updateCard = (i: number, patch: Partial<CardConfig>) =>
    setCards(prev => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  const updateKpi = (i: number, patch: Partial<KpiConfig>) =>
    setKpis(prev => prev.map((k, idx) => idx === i ? { ...k, ...patch } : k));

  const statValues: Record<string, string | number> = {
    team: stats.team, integrations: stats.integrations, formations: stats.formations, mood: stats.mood,
  };
  const statSuffix: Record<string, string> = {
    team: 'membres', integrations: 'en cours', formations: 'bilans', mood: '',
  };

  return (
    <div className="p-6 lg:p-8">

      {/* ---- Barre mode édition ---- */}
      {editMode ? (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-blue-50 border border-blue-200 text-sm">
          <Pencil size={15} className="text-blue-500 flex-shrink-0" />
          <span className="text-blue-700 font-medium flex-1">Mode personnalisation actif — cliquez sur les textes ou les pastilles de couleur pour modifier</span>
          <button onClick={resetAll} className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-medium">Réinitialiser</button>
          <button onClick={saveAll} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600">
            <Check size={13} />Sauvegarder
          </button>
          <button onClick={() => setEditMode(false)} className="p-1.5 rounded-lg hover:bg-blue-100"><X size={15} className="text-blue-400" /></button>
        </div>
      ) : (
        <button onClick={() => setEditMode(true)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 text-gray-400 text-xs font-medium hover:border-blue-300 hover:text-blue-400 transition-all">
          <Pencil size={13} />Personnaliser le tableau de bord
        </button>
      )}

      {/* ---- Header ---- */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-800">
          Bonjour, <span style={{ color: '#7A90B5' }}>{prenom}</span> 👋
        </h1>
        {editMode
          ? <Editable value={greeting} onChange={setGreeting} style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }} />
          : <p className="text-gray-500 text-sm mt-1">{greeting}</p>
        }
      </div>

      {/* ---- KPI bar ---- */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => {
          const Icon = KPI_ICONS[i];
          const key = KPI_KEYS[i];
          return (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg }}>
                <Icon size={18} style={{ color: kpi.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-bold text-gray-800 leading-none">{loading ? '…' : statValues[key]}</p>
                {editMode
                  ? <div className="flex items-center gap-1 mt-1">
                      <Editable value={kpi.label} onChange={v => updateKpi(i, { label: v })} style={{ fontSize: '0.7rem', color: '#6B7280' }} />
                      <ColorDot value={kpi.color} onChange={v => updateKpi(i, { color: v })} />
                    </div>
                  : <p className="text-xs text-gray-500 mt-0.5 truncate">{kpi.label}</p>
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* ---- 4 modules ---- */}
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Mes modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const Icon = CARD_ICONS[i];
          const key = KPI_KEYS[i];
          return editMode ? (
            /* mode édition : pas de Link, tout est cliquable */
            <div key={i} className="bg-white rounded-2xl p-5 border-2 border-dashed border-blue-200 flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: card.bg }}>
                  <Icon size={22} style={{ color: card.color }} />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <ColorDot value={card.color} onChange={v => updateCard(i, { color: v, bg: v + '22' })} />
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <Editable value={card.label} onChange={v => updateCard(i, { label: v })} style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1f2937' }} />
                <Editable value={card.desc} onChange={v => updateCard(i, { desc: v })} textarea style={{ color: '#6B7280' }} />
              </div>
            </div>
          ) : (
            <Link key={i} to={CARD_ROUTES[i]}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                style={{ background: card.bg }}>
                <Icon size={22} style={{ color: card.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-sm mb-0.5 truncate">{card.label}</h3>
                <p className="text-xs text-gray-500 leading-snug line-clamp-2">{card.desc}</p>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-lg font-bold" style={{ color: card.color }}>
                    {loading ? '…' : statValues[key]}
                  </span>
                  {statSuffix[key] && (
                    <span className="text-xs text-gray-400">{statSuffix[key]}</span>
                  )}
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-400 mt-1 transition-colors flex-shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* ---- Quick action ---- */}
      <div className="mt-6 bg-gradient-to-r from-[#EDF2FB] to-[#F3EFFC] rounded-2xl p-5 flex items-center justify-between gap-4 border border-[#7A90B5]/10">
        <div className="min-w-0">
          {editMode
            ? <>
                <Editable value={quickTitle} onChange={setQuickTitle} style={{ fontWeight: 700, color: '#1f2937' }} />
                <Editable value={quickDesc} onChange={setQuickDesc} style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }} />
              </>
            : <>
                <p className="font-bold text-gray-800 truncate">{quickTitle}</p>
                <p className="text-sm text-gray-500 mt-0.5 truncate">{quickDesc}</p>
              </>
          }
        </div>
        <Link to="/equipe"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white hover:opacity-90 shadow flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}>
          <UserPlus size={15} />Ajouter
        </Link>
      </div>

    </div>
  );
}
