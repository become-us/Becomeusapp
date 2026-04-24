import React, { useEffect, useState } from 'react';
import { supabase, TeamMember } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Plus, X, Loader2, Pencil, Trash2, UserCircle } from 'lucide-react';

const COLORS = ['#7A90B5','#C4956A','#9B85C4','#6BB5A0','#E07B8A','#E8A838'];
const STATUTS = ['actif','en_integration','inactif'];
const STATUT_LABELS: Record<string,string> = { actif:'Actif', en_integration:'En intégration', inactif:'Inactif' };
const STATUT_COLORS: Record<string,string> = { actif:'bg-green-100 text-green-700', en_integration:'bg-blue-100 text-blue-700', inactif:'bg-gray-100 text-gray-500' };

type FormData = { full_name:string; email:string; poste:string; date_arrivee:string; statut:'actif'|'inactif'|'en_integration'; avatar_color:string };
const EMPTY: FormData = { full_name:'', email:'', poste:'', date_arrivee:'', statut:'actif', avatar_color:'#7A90B5' };

export default function EquipePage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await supabase.from('team_members').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
    setMembers(data || []); setLoading(false);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowForm(true); setError(''); };
  const openEdit = (m: TeamMember) => { setForm({ full_name: m.full_name, email: m.email||'', poste: m.poste||'', date_arrivee: m.date_arrivee||'', statut: m.statut, avatar_color: m.avatar_color||'#7A90B5' }); setEditing(m); setShowForm(true); setError(''); };

  const handleSave = async () => {
    if (!form.full_name.trim()) { setError('Le nom est requis.'); return; }
    setSaving(true); setError('');
    if (editing) {
      await supabase.from('team_members').update({ ...form }).eq('id', editing.id);
    } else {
      await supabase.from('team_members').insert({ ...form, user_id: user!.id });
    }
    setSaving(false); setShowForm(false); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce membre ?')) return;
    await supabase.from('team_members').delete().eq('id', id); load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">👥 Mon équipe</h1>
          <p className="text-gray-500 text-sm mt-1">{members.length} membre{members.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white hover:opacity-90 transition-all shadow"
          style={{ background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}>
          <Plus size={16} /> Ajouter un membre
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-[#7A90B5]" /></div>
      ) : members.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <UserCircle size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucun membre pour l'instant</p>
          <p className="text-sm mt-1">Ajoutez votre premier collaborateur</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {members.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{ background: m.avatar_color }}>
                {m.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{m.full_name}</p>
                <p className="text-sm text-gray-500 truncate">{m.poste || '—'} {m.email ? `· ${m.email}` : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                {m.date_arrivee && <span className="text-xs text-gray-400">Arrivée : {new Date(m.date_arrivee).toLocaleDateString('fr-FR')}</span>}
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUT_COLORS[m.statut]}`}>{STATUT_LABELS[m.statut]}</span>
                <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-[#7A90B5] transition-colors"><Pencil size={15} /></button>
                <button onClick={() => handleDelete(m.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-800">{editing ? 'Modifier le membre' : 'Nouveau membre'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              {[
                { label:'Nom complet *', key:'full_name', placeholder:'Marie Dupont', type:'text' },
                { label:'Email', key:'email', placeholder:'marie@exemple.com', type:'email' },
                { label:'Poste', key:'poste', placeholder:'Chef de projet', type:'text' },
                { label:"Date d'arrivée", key:'date_arrivee', placeholder:'', type:'date' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">{label}</label>
                  <input type={type} value={(form as Record<string,string>)[key]} placeholder={placeholder}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A90B5]/30 focus:border-[#7A90B5]" />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Statut</label>
                <select value={form.statut} onChange={e => setForm(f => ({ ...f, statut: e.target.value as typeof form.statut }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A90B5]/30">
                  {STATUTS.map(s => <option key={s} value={s}>{STATUT_LABELS[s]}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2">Couleur avatar</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, avatar_color: c }))}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{ background: c, borderColor: form.avatar_color === c ? '#374151' : 'transparent' }} />
                  ))}
                </div>
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}>
                {saving && <Loader2 size={14} className="animate-spin" />}
                {editing ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
