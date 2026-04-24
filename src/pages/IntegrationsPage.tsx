import React, { useEffect, useState } from 'react';
import { supabase, Integration, TeamMember } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Plus, X, Loader2, Pencil, Trash2, Rocket } from 'lucide-react';

const STATUTS = ['en_cours','termine','en_pause'];
const SL: Record<string,string> = { en_cours:'En cours', termine:'Terminé', en_pause:'En pause' };
const SC: Record<string,string> = { en_cours:'bg-blue-100 text-blue-700', termine:'bg-green-100 text-green-700', en_pause:'bg-orange-100 text-orange-700' };
type FormData = { member_id:string; titre:string; statut:'en_cours'|'termine'|'en_pause'; progression:number; date_debut:string; date_fin_prevue:string; notes:string };
const EMPTY: FormData = { member_id:'', titre:'', statut:'en_cours', progression:0, date_debut:'', date_fin_prevue:'', notes:'' };

export default function IntegrationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Integration[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Integration | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [{ data: integs }, { data: mbrs }] = await Promise.all([
      supabase.from('integrations').select('*, team_members(full_name,avatar_color)').eq('user_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('team_members').select('*').eq('user_id', user!.id),
    ]);
    setItems(integs || []); setMembers(mbrs || []); setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (i: Integration) => {
    setForm({ member_id: i.member_id||'', titre: i.titre, statut: i.statut, progression: i.progression, date_debut: i.date_debut||'', date_fin_prevue: i.date_fin_prevue||'', notes: i.notes||'' });
    setEditing(i); setShowForm(true);
  };
  const handleSave = async () => {
    if (!form.titre.trim()) return;
    setSaving(true);
    const payload = { ...form, user_id: user!.id, member_id: form.member_id || null };
    if (editing) await supabase.from('integrations').update(payload).eq('id', editing.id);
    else await supabase.from('integrations').insert(payload);
    setSaving(false); setShowForm(false); load();
  };
  const handleDelete = async (id: string) => { if (!confirm('Supprimer ?')) return; await supabase.from('integrations').delete().eq('id', id); load(); };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🚀 Mes intégrations</h1>
          <p className="text-gray-500 text-sm mt-1">{items.length} parcours</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white hover:opacity-90 shadow" style={{ background: 'linear-gradient(135deg,#C4956A,#E8A838)' }}>
          <Plus size={16} /> Nouveau parcours
        </button>
      </div>

      {loading ? <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#C4956A]" /></div>
        : items.length === 0 ? (
          <div className="text-center py-20 text-gray-400"><Rocket size={48} className="mx-auto mb-3 opacity-30" /><p>Aucun parcours d'intégration</p></div>
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
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-bold text-gray-800">{item.titre}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${SC[item.statut]}`}>{SL[item.statut]}</span>
                          <button onClick={() => openEdit(item)} className="p-1 text-gray-400 hover:text-[#C4956A]"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      {mb && <p className="text-sm text-gray-500 mb-2">{mb.full_name}</p>}
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="h-2 rounded-full transition-all" style={{ width: `${item.progression}%`, background: 'linear-gradient(90deg,#C4956A,#E8A838)' }} />
                        </div>
                        <span className="text-xs font-bold text-[#C4956A]">{item.progression}%</span>
                      </div>
                      {item.date_fin_prevue && <p className="text-xs text-gray-400 mt-1">Fin prévue : {new Date(item.date_fin_prevue).toLocaleDateString('fr-FR')}</p>}
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
              <h2 className="font-bold text-gray-800">{editing ? 'Modifier le parcours' : 'Nouveau parcours'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Titre *</label>
                <input value={form.titre} onChange={e => setForm(f => ({ ...f, titre: e.target.value }))} placeholder="Intégration - Poste" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4956A]/30 focus:border-[#C4956A]" /></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Collaborateur</label>
                <select value={form.member_id} onChange={e => setForm(f => ({ ...f, member_id: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none">
                  <option value="">— Choisir un membre —</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                </select></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Statut</label>
                <select value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value as typeof form.statut }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none">
                  {STATUTS.map(s => <option key={s} value={s}>{SL[s]}</option>)}
                </select></div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Progression : {form.progression}%</label>
                <input type="range" min={0} max={100} value={form.progression} onChange={e => setForm(f => ({ ...f, progression: +e.target.value }))} className="w-full accent-[#C4956A]" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Date début</label>
                  <input type="date" value={form.date_debut} onChange={e => setForm(f => ({ ...f, date_debut: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" /></div>
                <div><label className="text-xs font-semibold text-gray-600 block mb-1">Date fin prévue</label>
                  <input type="date" value={form.date_fin_prevue} onChange={e => setForm(f => ({ ...f, date_fin_prevue: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none" /></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-600 block mb-1">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90" style={{ background: 'linear-gradient(135deg,#C4956A,#E8A838)' }}>
                {saving && <Loader2 size={14} className="animate-spin" />}Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
