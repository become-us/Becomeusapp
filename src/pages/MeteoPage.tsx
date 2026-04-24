import React, { useEffect, useState } from 'react';
import { supabase, TeamMood, TeamMember } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Plus, X, Loader2, CloudSun, Trash2 } from 'lucide-react';

const HUMEURS = [
  { val: 'super', label: 'Super', emoji: '😄', color: '#6BB5A0', bg: '#EFFAF6' },
  { val: 'bien', label: 'Bien', emoji: '😊', color: '#7A90B5', bg: '#EDF2FB' },
  { val: 'moyen', label: 'Moyen', emoji: '😐', color: '#E8A838', bg: '#FEF9EC' },
  { val: 'difficile', label: 'Difficile', emoji: '😔', color: '#E07B8A', bg: '#FEF0F2' },
];
const EMPTY = { member_id: '', humeur: 'bien' as const, commentaire: '' };

export default function MeteoPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<TeamMood[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: moods }, { data: mbrs }] = await Promise.all([
      supabase.from('team_mood').select('*, team_members(full_name,avatar_color)').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('team_members').select('*').eq('user_id', user!.id),
    ]);
    setItems(moods || []); setMembers(mbrs || []); setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const handleSave = async () => {
    setSaving(true);
    await supabase.from('team_mood').insert({ ...form, user_id: user!.id, member_id: form.member_id || null, semaine: new Date().toISOString().split('T')[0] });
    setSaving(false); setShowForm(false); setForm(EMPTY); load();
  };
  const handleDelete = async (id: string) => { await supabase.from('team_mood').delete().eq('id', id); load(); };

  // Stats
  const stats = HUMEURS.map(h => ({ ...h, count: items.filter(i => i.humeur === h.val).length }));
  const total = items.length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🌤️ Météo d'équipe</h1>
          <p className="text-gray-500 text-sm mt-1">Baromètre du moral de votre équipe</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white hover:opacity-90 shadow" style={{ background: 'linear-gradient(135deg,#6BB5A0,#7A90B5)' }}>
          <Plus size={16} /> Ajouter un vote
        </button>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(({ val, label, emoji, color, bg, count }) => (
          <div key={val} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
            <div className="text-3xl mb-2">{emoji}</div>
            <p className="text-2xl font-bold" style={{ color }}>{count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            {total > 0 && (
              <div className="mt-2 bg-gray-100 rounded-full h-1.5 mx-2">
                <div className="h-1.5 rounded-full" style={{ width: `${Math.round(count/total*100)}%`, background: color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Votes récents */}
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Votes récents</h2>
      {loading ? <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#6BB5A0]" /></div>
        : items.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><CloudSun size={48} className="mx-auto mb-3 opacity-30" /><p>Aucun vote enregistré</p><p className="text-sm mt-1">Commencez à mesurer le moral de votre équipe</p></div>
        ) : (
          <div className="grid gap-3">
            {items.map((item) => {
              const h = HUMEURS.find(x => x.val === item.humeur)!;
              const mb = item.team_members as unknown as { full_name: string; avatar_color: string } | undefined;
              return (
                <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{ background: h.bg }}>{h.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {mb ? (
                        <span className="font-semibold text-sm text-gray-800">{mb.full_name}</span>
                      ) : <span className="text-sm text-gray-400 italic">Anonyme</span>}
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: h.bg, color: h.color }}>{h.label}</span>
                    </div>
                    {item.commentaire && <p className="text-xs text-gray-500 mt-0.5 italic">"{item.commentaire}"</p>}
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(item.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                </div>
              );
            })}
          </div>
        )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800">Ajouter un vote météo</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Collaborateur</label>
                <select value={form.member_id} onChange={e => setForm(f => ({ ...f, member_id: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none">
                  <option value="">— Anonyme —</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                </select></div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Comment se sent-il/elle ?</label>
                <div className="grid grid-cols-2 gap-2">
                  {HUMEURS.map(h => (
                    <button key={h.val} onClick={() => setForm(f => ({ ...f, humeur: h.val as typeof form.humeur }))}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                      style={{ background: form.humeur === h.val ? h.bg : 'white', borderColor: form.humeur === h.val ? h.color : '#E5E7EB', color: form.humeur === h.val ? h.color : '#6B7280' }}>
                      <span className="text-xl">{h.emoji}</span>{h.label}
                    </button>
                  ))}
                </div>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Commentaire (optionnel)</label>
                <textarea value={form.commentaire} onChange={e => setForm(f => ({ ...f, commentaire: e.target.value }))} rows={2} placeholder="Un mot pour décrire..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90" style={{ background: 'linear-gradient(135deg,#6BB5A0,#7A90B5)' }}>
                {saving && <Loader2 size={14} className="animate-spin" />}Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
