import React, { useEffect, useState } from 'react';
import { supabase, Formation, TeamMember } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Plus, X, Loader2, Pencil, Trash2, BookOpen } from 'lucide-react';

const STATUTS = ['planifie','en_cours','termine'];
const SL: Record<string,string> = { planifie:'Planifié', en_cours:'En cours', termine:'Terminé' };
const SC: Record<string,string> = { planifie:'bg-gray-100 text-gray-600', en_cours:'bg-blue-100 text-blue-700', termine:'bg-green-100 text-green-700' };
const TYPES = ['post-formation','4-6 mois'];
type FormData = { member_id:string; titre:string; type_bilan:'post-formation'|'4-6 mois'; score:string; statut:'planifie'|'en_cours'|'termine'; date_formation:string; observations:string };
const EMPTY: FormData = { member_id:'', titre:'', type_bilan:'post-formation', score:'', statut:'planifie', date_formation:'', observations:'' };

export default function FormationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Formation[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Formation | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: fms }, { data: mbrs }] = await Promise.all([
      supabase.from('formations').select('*, team_members(full_name,avatar_color)').eq('user_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('team_members').select('*').eq('user_id', user!.id),
    ]);
    setItems(fms || []); setMembers(mbrs || []); setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (i: Formation) => {
    setForm({ member_id: i.member_id||'', titre: i.titre, type_bilan: i.type_bilan, score: String(i.score||''), statut: i.statut, date_formation: i.date_formation||'', observations: i.observations||'' });
    setEditing(i); setShowForm(true);
  };
  const handleSave = async () => {
    if (!form.titre.trim()) return;
    setSaving(true);
    const payload = { ...form, score: form.score ? parseFloat(form.score) : null, user_id: user!.id, member_id: form.member_id || null };
    if (editing) await supabase.from('formations').update(payload).eq('id', editing.id);
    else await supabase.from('formations').insert(payload);
    setSaving(false); setShowForm(false); load();
  };
  const handleDelete = async (id: string) => { if (!confirm('Supprimer ?')) return; await supabase.from('formations').delete().eq('id', id); load(); };

  const scoreColor = (s: number) => s >= 3.5 ? 'text-green-600' : s >= 2.5 ? 'text-orange-500' : 'text-red-500';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📚 Mes formations</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} bilan{items.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white hover:opacity-90 shadow" style={{ background: 'linear-gradient(135deg,#9B85C4,#7A90B5)' }}>
          <Plus size={16} /> Nouveau bilan
        </button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#9B85C4]" /></div>
        : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><BookOpen size={48} className="mx-auto mb-3 opacity-30" /><p>Aucun bilan de formation</p></div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => {
              const mb = item.team_members as unknown as { full_name: string; avatar_color: string } | undefined;
              return (
                <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    {mb && (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: mb.avatar_color }}>
                        {mb.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0,2)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <p className="font-bold text-gray-800">{item.titre}</p>
                          {mb && <p className="text-sm text-gray-500">{mb.full_name}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {item.score !== null && (
                            <span className={`text-lg font-extrabold ${scoreColor(item.score)}`}>{item.score}/4</span>
                          )}
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${SC[item.statut]}`}>{SL[item.statut]}</span>
                          <button onClick={() => openEdit(item)} className="p-1 text-gray-400 hover:text-[#9B85C4]"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{item.type_bilan}</span>
                        {item.date_formation && <span className="text-xs text-gray-400">{new Date(item.date_formation).toLocaleDateString('fr-FR')}</span>}
                      </div>
                      {item.observations && <p className="text-xs text-gray-500 mt-2 italic">"{item.observations}"</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800">{editing ? 'Modifier le bilan' : 'Nouveau bilan'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Titre *</label>
                <input value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} placeholder="Formation Excel avancé" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B85C4]/30 focus:border-[#9B85C4]" /></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Collaborateur</label>
                <select value={form.member_id} onChange={e => setForm(f => ({ ...f, member_id: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none">
                  <option value="">— Choisir —</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                </select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Type de bilan</label>
                  <select value={form.type_bilan} onChange={e => setForm(f => ({ ...f, type_bilan: e.target.value as typeof form.type_bilan }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none">
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select></div>
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Score (/4)</label>
                  <input type="number" min="0" max="4" step="0.5" value={form.score} onChange={e => setForm(f => ({ ...f, score: e.target.value }))} placeholder="3.5" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Statut</label>
                  <select value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value as typeof form.statut }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none">
                    {STATUTS.map(s => <option key={s} value={s}>{SL[s]}</option>)}
                  </select></div>
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Date</label>
                  <input type="date" value={form.date_formation} onChange={e => setForm(f => ({ ...f, date_formation: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" /></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Observations</label>
                <textarea value={form.observations} onChange={e => setForm(f => ({ ...f, observations: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90" style={{ background: 'linear-gradient(135deg,#9B85C4,#7A90B5)' }}>
                {saving && <Loader2 size={14} className="animate-spin" />}Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
