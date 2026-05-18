import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { El } from '@/components/El';
import { Users, Rocket, BookOpen, CloudSun, UserPlus, ArrowRight, Pencil, Check, X } from 'lucide-react';

interface Stats { team: number; integrations: number; formations: number; mood: string; }

const CARD_ROUTES = ['/equipe', '/integrations', '/formations', '/meteo'];
const CARD_ICONS  = [Users, Rocket, BookOpen, CloudSun];
const KPI_ICONS   = [Users, Rocket, BookOpen, CloudSun];
const KPI_KEYS    = ['team', 'integrations', 'formations', 'mood'] as const;

const CARD_DEFAULTS = [
  { label: 'Mon équipe',       desc: 'Gérez vos collaborateurs', color: '#7A90B5', bg: '#EDF2FB' },
  { label: 'Mes intégrations', desc: 'Suivez les parcours',      color: '#C4956A', bg: '#FDF3EC' },
  { label: 'Mes formations',   desc: 'Bilans post-formation',    color: '#9B85C4', bg: '#F3EFFC' },
  { label: "Météo d'équipe",   desc: "Humeur de l'équipe",       color: '#6BB5A0', bg: '#EFFAF6' },
];
const KPI_DEFAULTS = [
  { label: 'Membres',             color: '#7A90B5', bg: '#EDF2FB' },
  { label: 'Intégrations',        color: '#C4956A', bg: '#FDF3EC' },
  { label: 'Formations',          color: '#9B85C4', bg: '#F3EFFC' },
  { label: 'Météo cette semaine', color: '#6BB5A0', bg: '#EFFAF6' },
];

type CardCfg = typeof CARD_DEFAULTS[0];
type KpiCfg  = typeof KPI_DEFAULTS[0];

function loadLS<T>(k: string, d: T): T { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }
function saveLS(k: string, v: unknown) { localStorage.setItem(k, JSON.stringify(v)); }

function Editable({ value, onChange, multiline, style }: { value: string; onChange: (v: string) => void; multiline?: boolean; style?: React.CSSProperties }) {
  const [v, setV] = useState(value);
  const props = { value: v, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV(e.target.value), onBlur: () => onChange(v), style: { ...style, border: '1px dashed #7A90B5', borderRadius: 6, padding: '2px 6px', outline: 'none', background: 'rgba(237,242,251,0.5)', width: '100%' } };
  return multiline ? <textarea {...props} rows={2} style={{ ...props.style, resize: 'none', fontSize: 'inherit' }} /> : <input {...props} />;
}

function ColorDot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="cursor-pointer" title="Changer la couleur">
      <div className="w-4 h-4 rounded-full border-2 border-white shadow inline-block" style={{ background: value }} />
      <input type="color" value={value} onChange={e => onChange(e.target.value)} className="sr-only" />
    </label>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ team: 0, integrations: 0, formations: 0, mood: '—' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [cards, setCards]     = useState<CardCfg[]>(() => loadLS('bu_dash_cards', CARD_DEFAULTS));
  const [kpis, setKpis]       = useState<KpiCfg[]>(() => loadLS('bu_dash_kpis',  KPI_DEFAULTS));
  const [greeting, setGreeting] = useState(() => loadLS('bu_dash_greeting', "Voici un aperçu de votre équipe aujourd'hui"));
  const [quickTitle, setQuickTitle] = useState(() => loadLS('bu_dash_qt', 'Ajouter un nouveau membre'));
  const [quickDesc,  setQuickDesc]  = useState(() => loadLS('bu_dash_qd', 'Intégrez un nouveau talent dans votre équipe'));
  const prenom = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Coach';

  useEffect(() => {
    const load = async () => {
      const [t, i, f, m] = await Promise.all([
        supabase.from('team_members').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('integrations').select('id', { count: 'exact' }).eq('user_id', user!.id).eq('statut', 'en_cours'),
        supabase.from('formations').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('team_mood').select('humeur').eq('user_id', user!.id).gte('semaine', new Date(Date.now() - 7*86400000).toISOString().split('T')[0]),
      ]);
      const mc: Record<string, number> = {};
      (m.data || []).forEach((r: { humeur: string }) => { mc[r.humeur] = (mc[r.humeur] || 0) + 1; });
      const top = Object.entries(mc).sort((a, b) => b[1] - a[1])[0]?.[0];
      const emoji: Record<string, string> = { super: '😄', bien: '😊', moyen: '😐', difficile: '😔' };
      setStats({ team: t.count||0, integrations: i.count||0, formations: f.count||0, mood: emoji[top] || '—' });
      setLoading(false);
    };
    if (user) load();
  }, [user]);

  const saveAll = () => {
    saveLS('bu_dash_cards', cards); saveLS('bu_dash_kpis', kpis);
    saveLS('bu_dash_greeting', greeting); saveLS('bu_dash_qt', quickTitle); saveLS('bu_dash_qd', quickDesc);
    setEditMode(false);
  };
  const updateCard = (i: number, p: Partial<CardCfg>) => setCards(prev => prev.map((c, idx) => idx===i ? {...c,...p} : c));
  const updateKpi  = (i: number, p: Partial<KpiCfg>)  => setKpis(prev => prev.map((k, idx) => idx===i ? {...k,...p} : k));
  const statValues: Record<string, string|number> = { team: stats.team, integrations: stats.integrations, formations: stats.formations, mood: stats.mood };
  const statSuffix: Record<string, string> = { team:'membres', integrations:'en cours', formations:'bilans', mood:'' };

  return (
    <div className="p-6 lg:p-8">

      {/* Barre personnalisation contenu */}
      {editMode ? (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl bg-orange-50 border border-orange-200 text-sm">
          <Pencil size={14} className="text-orange-400 flex-shrink-0" />
          <span className="text-orange-700 font-medium flex-1">Cliquez sur les textes pour les modifier · pastilles pour les couleurs</span>
          <button onClick={saveAll} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#C4956A' }}>
            <Check size={12} />Sauvegarder
          </button>
          <button onClick={() => setEditMode(false)} className="p-1.5 rounded-lg hover:bg-orange-100"><X size={14} className="text-orange-400" /></button>
        </div>
      ) : (
        <button onClick={() => setEditMode(true)}
          className="mb-5 flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-300 text-gray-400 text-xs font-medium hover:border-orange-300 hover:text-orange-400 transition-all">
          <Pencil size={12} />Personnaliser le contenu du dashboard
        </button>
      )}

      {/* Header */}
      <El id="dash-header" className="mb-7">
        <El id="dash-title" as="h1" className="text-2xl font-bold text-gray-800">
          Bonjour, <span style={{ color: '#7A90B5' }}>{prenom}</span> 👋
        </El>
        {editMode
          ? <Editable value={greeting} onChange={setGreeting} style={{ fontSize: '0.875rem', color: '#6B7280' }} />
          : <El id="dash-subtitle" as="p" className="text-gray-500 text-sm mt-1">{greeting}</El>
        }
      </El>

      {/* KPIs */}
      <El id="dash-kpis" className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => {
          const Icon = KPI_ICONS[i];
          return (
            <El key={i} id={`kpi-card-${i}`} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: kpi.bg }}>
                <Icon size={18} style={{ color: kpi.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <El id={`kpi-value-${i}`} as="p" className="text-xl font-bold text-gray-800 leading-none">{loading ? '…' : statValues[KPI_KEYS[i]]}</El>
                {editMode
                  ? <div className="flex items-center gap-1 mt-1">
                      <Editable value={kpi.label} onChange={v => updateKpi(i, { label: v })} style={{ fontSize: '0.7rem', color: '#6B7280' }} />
                      <ColorDot value={kpi.color} onChange={v => updateKpi(i, { color: v })} />
                    </div>
                  : <El id={`kpi-label-${i}`} as="p" className="text-xs text-gray-500 mt-0.5 truncate">{kpi.label}</El>
                }
              </div>
            </El>
          );
        })}
      </El>

      {/* Module cards */}
      <El id="dash-modules-title" as="h2" className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Mes modules</El>
      <El id="dash-modules" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, i) => {
          const Icon = CARD_ICONS[i];
          return editMode ? (
            <El key={i} id={`module-card-${i}`} className="bg-white rounded-2xl p-5 border-2 border-dashed border-orange-200 flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: card.bg }}>
                  <Icon size={22} style={{ color: card.color }} />
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <ColorDot value={card.color} onChange={v => updateCard(i, { color: v })} />
                </div>
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <Editable value={card.label} onChange={v => updateCard(i, { label: v })} style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1f2937' }} />
                <Editable value={card.desc} onChange={v => updateCard(i, { desc: v })} multiline style={{ color: '#6B7280', fontSize: '0.8rem' }} />
              </div>
            </El>
          ) : (
            <Link key={i} to={CARD_ROUTES[i]}
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex items-start gap-4">
              <El id={`module-icon-${i}`} className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: card.bg }}>
                <Icon size={22} style={{ color: card.color }} />
              </El>
              <div className="flex-1 min-w-0">
                <El id={`module-title-${i}`} as="h3" className="font-bold text-gray-800 text-sm mb-0.5 truncate">{card.label}</El>
                <El id={`module-desc-${i}`} as="p" className="text-xs text-gray-500 leading-snug line-clamp-2">{card.desc}</El>
                <div className="flex items-baseline gap-1 mt-2">
                  <El id={`module-stat-${i}`} as="span" className="text-lg font-bold" style={{ color: card.color }}>{loading ? '…' : statValues[KPI_KEYS[i]]}</El>
                  {statSuffix[KPI_KEYS[i]] && <El id={`module-suffix-${i}`} as="span" className="text-xs text-gray-400">{statSuffix[KPI_KEYS[i]]}</El>}
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-400 mt-1 transition-colors flex-shrink-0" />
            </Link>
          );
        })}
      </El>

      {/* Quick action */}
      <El id="dash-quick" className="mt-6 rounded-2xl p-5 flex items-center justify-between gap-4 border" style={{ background: 'linear-gradient(135deg,#EDF2FB,#F3EFFC)', borderColor: 'rgba(122,144,181,0.1)' }}>
        <div className="min-w-0">
          {editMode
            ? <><Editable value={quickTitle} onChange={setQuickTitle} style={{ fontWeight: 700, color: '#1f2937' }} /><Editable value={quickDesc} onChange={setQuickDesc} style={{ fontSize: '0.875rem', color: '#6B7280' }} /></>
            : <><El id="dash-quick-title" as="p" className="font-bold text-gray-800 truncate">{quickTitle}</El><El id="dash-quick-desc" as="p" className="text-sm text-gray-500 mt-0.5 truncate">{quickDesc}</El></>
          }
        </div>
        <Link to="/equipe" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white hover:opacity-90 shadow flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}>
          <UserPlus size={15} />Ajouter
        </Link>
      </El>

    </div>
  );
}
