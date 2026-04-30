import React, { useState, useCallback, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type DayOfWeek = 'Lundi' | 'Mardi' | 'Mercredi' | 'Jeudi' | 'Vendredi' | 'Samedi' | 'Dimanche';
type ShiftType = 'matin' | 'journee' | 'apres-midi' | 'soir' | 'nuit' | 'repos' | 'demi-matin' | 'demi-aprem';
type ContractType = 'CDI' | 'CDD' | 'Temps partiel' | 'Intérim';

const DAYS: DayOfWeek[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DAYS_SHORT: Record<DayOfWeek, string> = {
  Lundi: 'Lun', Mardi: 'Mar', Mercredi: 'Mer', Jeudi: 'Jeu',
  Vendredi: 'Ven', Samedi: 'Sam', Dimanche: 'Dim',
};

const PAUSE_OPTIONS = [
  { value: 0,    label: 'Sans pause' },
  { value: 0.25, label: '15 min' },
  { value: 0.5,  label: '30 min' },
  { value: 0.75, label: '45 min' },
  { value: 1,    label: '1h' },
  { value: 1.5,  label: '1h30' },
];

interface ShiftDef {
  id: string; label: string; type: ShiftType;
  start: string; end: string; color: string;
  bgClass: string; emoji: string;
  isHalfDay?: boolean; isRest?: boolean;
  defaultPause: number; // heures
}

interface Employee {
  id: string; name: string; role: string; colorIdx: number;
  hoursPerWeek: number; contract: ContractType; daysOff: DayOfWeek[];
}

interface Slot {
  employeeId: string; day: DayOfWeek;
  shiftId: string; pause: number; note?: string;
}

// ─── Shift catalogue ─────────────────────────────────────────────────────────
const SHIFTS: ShiftDef[] = [
  { id: 'matin',      label: 'Matin',        type: 'matin',      start: '06:00', end: '14:00', color: '#F59E0B', bgClass: 'bg-amber-50  border-amber-200  text-amber-800',  emoji: '🌅', defaultPause: 0.5 },
  { id: 'journee',    label: 'Journée',      type: 'journee',    start: '09:00', end: '17:00', color: '#9B85C4', bgClass: 'bg-violet-50 border-violet-200 text-violet-800', emoji: '☀️', defaultPause: 1   },
  { id: 'apres-midi', label: 'Après-midi',   type: 'apres-midi', start: '14:00', end: '22:00', color: '#7A90B5', bgClass: 'bg-blue-50   border-blue-200   text-blue-800',   emoji: '🌤️', defaultPause: 0.5 },
  { id: 'soir',       label: 'Soir',         type: 'soir',       start: '17:00', end: '23:00', color: '#EC4899', bgClass: 'bg-pink-50   border-pink-200   text-pink-800',   emoji: '🌙', defaultPause: 0.5 },
  { id: 'nuit',       label: 'Nuit',         type: 'nuit',       start: '22:00', end: '06:00', color: '#6366F1', bgClass: 'bg-indigo-50 border-indigo-200 text-indigo-800', emoji: '🌃', defaultPause: 0.5 },
  { id: 'demi-matin', label: '½ Matin',      type: 'demi-matin', start: '08:00', end: '12:00', color: '#F97316', bgClass: 'bg-orange-50 border-orange-200 text-orange-800', emoji: '🌤️', isHalfDay: true, defaultPause: 0 },
  { id: 'demi-aprem', label: '½ Après-midi', type: 'demi-aprem', start: '13:00', end: '17:00', color: '#14B8A6', bgClass: 'bg-teal-50   border-teal-200   text-teal-800',   emoji: '🌇', isHalfDay: true, defaultPause: 0 },
  { id: 'repos',      label: 'Repos',        type: 'repos',      start: '',      end: '',       color: '#9CA3AF', bgClass: 'bg-gray-50   border-gray-200   text-gray-400',   emoji: '😴', isRest: true, defaultPause: 0 },
];

const COLORS = [
  { bg: 'bg-violet-100 border-violet-300 text-violet-800', dot: '#9B85C4' },
  { bg: 'bg-emerald-100 border-emerald-300 text-emerald-800', dot: '#10B981' },
  { bg: 'bg-orange-100 border-orange-300 text-orange-800', dot: '#F97316' },
  { bg: 'bg-sky-100 border-sky-300 text-sky-800', dot: '#0EA5E9' },
  { bg: 'bg-pink-100 border-pink-300 text-pink-800', dot: '#EC4899' },
  { bg: 'bg-yellow-100 border-yellow-300 text-yellow-800', dot: '#EAB308' },
  { bg: 'bg-red-100 border-red-300 text-red-800', dot: '#EF4444' },
  { bg: 'bg-teal-100 border-teal-300 text-teal-800', dot: '#14B8A6' },
  { bg: 'bg-rose-100 border-rose-300 text-rose-800', dot: '#F43F5E' },
];

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Alice Martin',    role: 'Responsable',        colorIdx: 0, hoursPerWeek: 35, contract: 'CDI',          daysOff: ['Dimanche'] },
  { id: 'e2', name: 'Baptiste Dubois', role: 'Infirmier',           colorIdx: 1, hoursPerWeek: 35, contract: 'CDI',          daysOff: ['Samedi']   },
  { id: 'e3', name: 'Clara Fontaine',  role: 'Aide-soignante',      colorIdx: 2, hoursPerWeek: 28, contract: 'Temps partiel', daysOff: []           },
  { id: 'e4', name: 'David Leroy',     role: 'Infirmier',           colorIdx: 3, hoursPerWeek: 35, contract: 'CDI',          daysOff: ['Dimanche'] },
  { id: 'e5', name: 'Emma Bernard',    role: 'Aide-soignante',      colorIdx: 4, hoursPerWeek: 35, contract: 'CDI',          daysOff: ['Samedi']   },
  { id: 'e6', name: 'Félix Moreau',    role: 'Technicien',          colorIdx: 5, hoursPerWeek: 35, contract: 'CDD',          daysOff: []           },
  { id: 'e7', name: 'Gaëlle Simon',    role: 'Secrétaire médicale', colorIdx: 6, hoursPerWeek: 28, contract: 'Temps partiel', daysOff: ['Dimanche'] },
];

// ─── Utils ────────────────────────────────────────────────────────────────────
function gId() { return Math.random().toString(36).slice(2, 9); }

function calcRawH(start: string, end: string): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let m = (eh * 60 + em) - (sh * 60 + sm);
  if (m < 0) m += 1440;
  return m / 60;
}

function calcNetH(shift: ShiftDef, pause: number): number {
  if (shift.isRest) return 0;
  return Math.max(0, calcRawH(shift.start, shift.end) - pause);
}

function fmtH(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return mm ? `${hh}h${String(mm).padStart(2, '0')}` : `${hh}h`;
}

function weekNetHours(empId: string, slots: Slot[]): number {
  return slots.filter(s => s.employeeId === empId).reduce((acc, s) => {
    const sh = SHIFTS.find(x => x.id === s.shiftId);
    if (!sh || sh.isRest) return acc;
    return acc + calcNetH(sh, s.pause);
  }, 0);
}

function weekGrossHours(empId: string, slots: Slot[]): number {
  return slots.filter(s => s.employeeId === empId).reduce((acc, s) => {
    const sh = SHIFTS.find(x => x.id === s.shiftId);
    if (!sh || sh.isRest) return acc;
    return acc + calcRawH(sh.start, sh.end);
  }, 0);
}

function totalPauseHours(empId: string, slots: Slot[]): number {
  return slots.filter(s => s.employeeId === empId && !SHIFTS.find(x => x.id === s.shiftId)?.isRest)
    .reduce((acc, s) => acc + s.pause, 0);
}

function genSlots(employees: Employee[]): Slot[] {
  const rota = ['matin', 'journee', 'apres-midi', 'matin', 'journee', 'repos', 'repos'];
  return employees.flatMap((emp, ei) =>
    DAYS.map((day, di) => {
      const shiftId = emp.daysOff.includes(day) ? 'repos' : rota[(ei + di) % rota.length];
      const sh = SHIFTS.find(s => s.id === shiftId)!;
      return { employeeId: emp.id, day, shiftId, pause: sh.defaultPause };
    })
  );
}

function getWeekLabel(w: number, y: number) {
  const jan4 = new Date(y, 0, 4);
  const dow = jan4.getDay() || 7;
  const mon = new Date(jan4);
  mon.setDate(jan4.getDate() - dow + 1 + (w - 1) * 7);
  return `Semaine du ${mon.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

function currentWeekNum(): number {
  const n = new Date();
  const j1 = new Date(n.getFullYear(), 0, 1);
  return Math.ceil(((n.getTime() - j1.getTime()) / 86400000 + j1.getDay() + 1) / 7);
}

// ─── Storage ──────────────────────────────────────────────────────────────────
const S = {
  emp: (): Employee[] => { try { const r = localStorage.getItem('bu_pl2_emp'); return r ? JSON.parse(r) : DEFAULT_EMPLOYEES; } catch { return DEFAULT_EMPLOYEES; } },
  saveEmp: (e: Employee[]) => localStorage.setItem('bu_pl2_emp', JSON.stringify(e)),
  slots: (): Slot[] | null => { try { const r = localStorage.getItem('bu_pl2_slots'); return r ? JSON.parse(r) : null; } catch { return null; } },
  saveSlots: (s: Slot[]) => localStorage.setItem('bu_pl2_slots', JSON.stringify(s)),
};

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditModalProps { emp: Employee; day: DayOfWeek; slot: Slot; onSave: (s: Slot) => void; onClose: () => void; }
function EditModal({ emp, day, slot, onSave, onClose }: EditModalProps) {
  const [shiftId, setShiftId] = useState(slot.shiftId);
  const [pause, setPause] = useState(slot.pause);
  const [note, setNote] = useState(slot.note ?? '');
  const col = COLORS[emp.colorIdx] || COLORS[0];
  const chosenShift = SHIFTS.find(s => s.id === shiftId)!;
  const rawH = calcRawH(chosenShift.start, chosenShift.end);
  const netH = calcNetH(chosenShift, pause);
  const maxH = emp.hoursPerWeek;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-lg">Modifier le créneau</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        {/* Employee badge */}
        <div className={`flex items-center gap-3 p-3 rounded-xl border-2 mb-5 ${col.bg}`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border-2 ${col.bg}`}>
            {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-sm">{emp.name}</div>
            <div className="text-xs opacity-70">{emp.role} · {day} · Max contractuel : {maxH}h/sem</div>
          </div>
        </div>

        {/* Shift picker */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-600 mb-2">Type de créneau</label>
          <div className="grid grid-cols-2 gap-2">
            {SHIFTS.map(sh => (
              <button key={sh.id} onClick={() => { setShiftId(sh.id); setPause(sh.defaultPause); }}
                className={`flex items-start gap-2 p-2.5 rounded-xl border-2 text-left transition-all ${
                  shiftId === sh.id ? 'border-[#9B85C4] bg-violet-50 ring-2 ring-violet-200' : `${sh.bgClass} hover:opacity-80`
                }`}>
                <span className="text-base shrink-0">{sh.emoji}</span>
                <div>
                  <div className="font-semibold text-xs flex items-center gap-1">
                    {sh.label}
                    {sh.isHalfDay && <span className="text-xs px-1 py-0 bg-orange-100 text-orange-600 rounded-full border border-orange-200">½ journée</span>}
                  </div>
                  {sh.start ? <div className="text-xs opacity-60 font-mono">{sh.start}–{sh.end} ({fmtH(calcRawH(sh.start, sh.end))} brut)</div> : <div className="text-xs opacity-50">Pas de travail</div>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pause picker (seulement si pas repos) */}
        {!chosenShift.isRest && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-2">⏸ Temps de pause (déduit)</label>
            <div className="flex flex-wrap gap-2">
              {PAUSE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setPause(opt.value)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    pause === opt.value ? 'bg-[#9B85C4] text-white border-[#9B85C4]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-violet-300'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Résumé temps */}
        {!chosenShift.isRest && rawH > 0 && (
          <div className="mb-4 bg-gray-50 rounded-xl p-3 flex gap-4 text-sm flex-wrap">
            <div className="text-center">
              <div className="font-bold text-gray-800">{fmtH(rawH)}</div>
              <div className="text-xs text-gray-400">Temps brut</div>
            </div>
            <div className="text-gray-300 self-center text-lg">−</div>
            <div className="text-center">
              <div className="font-bold text-orange-500">{fmtH(pause)}</div>
              <div className="text-xs text-gray-400">Pause</div>
            </div>
            <div className="text-gray-300 self-center text-lg">=</div>
            <div className="text-center">
              <div className="font-bold text-green-600">{fmtH(netH)}</div>
              <div className="text-xs text-gray-400">Net travaillé</div>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Note (optionnel)</label>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300"
            placeholder="Remplacement, remarque…" />
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
          <button onClick={() => { onSave({ ...slot, shiftId, pause, note: note || undefined }); onClose(); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg,#9B85C4,#7A90B5)' }}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Form ────────────────────────────────────────────────────────────
interface EmpFormProps { initial?: Partial<Employee>; takenColors: number[]; onSave: (e: Employee) => void; onCancel: () => void; }
function EmpForm({ initial, takenColors, onSave, onCancel }: EmpFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [role, setRole] = useState(initial?.role ?? '');
  const [col, setCol] = useState(initial?.colorIdx ?? 0);
  const [hrs, setHrs] = useState(initial?.hoursPerWeek ?? 35);
  const [ct, setCt] = useState<ContractType>(initial?.contract ?? 'CDI');
  const [dOff, setDOff] = useState<DayOfWeek[]>(initial?.daysOff ?? []);
  const togDay = (d: DayOfWeek) => setDOff(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-gray-600 mb-1">Nom *</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="Prénom Nom" /></div>
        <div><label className="block text-xs font-medium text-gray-600 mb-1">Rôle *</label>
          <input value={role} onChange={e => setRole(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" placeholder="Infirmier…" /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs font-medium text-gray-600 mb-1">Contrat</label>
          <select value={ct} onChange={e => setCt(e.target.value as ContractType)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
            {(['CDI', 'CDD', 'Temps partiel', 'Intérim'] as ContractType[]).map(c => <option key={c}>{c}</option>)}</select></div>
        <div><label className="block text-xs font-medium text-gray-600 mb-1">Max heures/semaine</label>
          <input type="number" min={1} max={48} value={hrs} onChange={e => setHrs(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
      </div>
      <div><label className="block text-xs font-medium text-gray-600 mb-2">Couleur</label>
        <div className="flex gap-2 flex-wrap">{COLORS.map((c, i) => (
          <button key={i} onClick={() => setCol(i)} className={`w-8 h-8 rounded-lg border-2 font-bold text-xs flex items-center justify-center transition-all ${c.bg} ${col === i ? 'scale-110 border-gray-600 shadow-md' : 'border-transparent hover:scale-105'}`}>
            {String.fromCharCode(65 + i)}
          </button>))}</div></div>
      <div><label className="block text-xs font-medium text-gray-600 mb-2">Jours de repos contractuels</label>
        <div className="flex flex-wrap gap-2">{DAYS.map(d => (
          <button key={d} onClick={() => togDay(d)} className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${dOff.includes(d) ? 'bg-violet-100 border-violet-300 text-violet-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-violet-200'}`}>
            {d}</button>))}</div></div>
      <div className="flex gap-2 justify-end pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
        <button onClick={() => { if (!name.trim() || !role.trim()) return; onSave({ id: initial?.id ?? gId(), name: name.trim(), role: role.trim(), colorIdx: col, hoursPerWeek: hrs, contract: ct, daysOff: dOff }); }}
          disabled={!name.trim() || !role.trim()}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg,#9B85C4,#7A90B5)' }}>
          {initial?.id ? 'Modifier' : 'Ajouter'}</button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PlanningPage() {
  const [tab, setTab] = useState<'planning' | 'equipe'>('planning');
  const [employees, setEmployees] = useState<Employee[]>(() => S.emp());
  const [slots, setSlots] = useState<Slot[]>(() => S.slots() ?? genSlots(S.emp()));
  const [week, setWeek] = useState(currentWeekNum());
  const [year, setYear] = useState(new Date().getFullYear());
  const [editTarget, setEditTarget] = useState<{ emp: Employee; day: DayOfWeek; slot: Slot } | null>(null);
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [editEmp, setEditEmp] = useState<Employee | null>(null);
  const [delEmp, setDelEmp] = useState<Employee | null>(null);

  useEffect(() => { S.saveEmp(employees); }, [employees]);
  useEffect(() => { S.saveSlots(slots); }, [slots]);

  const getSlot = (empId: string, day: DayOfWeek): Slot => {
    return slots.find(s => s.employeeId === empId && s.day === day)
      ?? { employeeId: empId, day, shiftId: 'repos', pause: 0 };
  };

  const saveSlot = useCallback((s: Slot) => {
    setSlots(p => { const n = [...p]; const i = n.findIndex(x => x.employeeId === s.employeeId && x.day === s.day); if (i >= 0) n[i] = s; else n.push(s); return n; });
  }, []);

  const regenerate = () => setSlots(genSlots(employees));
  const prevWeek = () => { if (week <= 1) { setWeek(52); setYear(y => y - 1); } else setWeek(w => w - 1); };
  const nextWeek = () => { if (week >= 52) { setWeek(1); setYear(y => y + 1); } else setWeek(w => w + 1); };

  const addEmp = (e: Employee) => {
    const ne = [...employees, e];
    setEmployees(ne);
    setSlots(p => [...p, ...DAYS.map(d => ({ employeeId: e.id, day: d, shiftId: e.daysOff.includes(d) ? 'repos' : 'journee', pause: e.daysOff.includes(d) ? 0 : 1 }))]);
    setShowAddEmp(false);
  };
  const updateEmp = (e: Employee) => { setEmployees(p => p.map(x => x.id === e.id ? e : x)); setEditEmp(null); };
  const removeEmp = (id: string) => { setEmployees(p => p.filter(x => x.id !== id)); setSlots(p => p.filter(s => s.employeeId !== id)); setDelEmp(null); };

  const teamOk = employees.length >= 7 && employees.length <= 9;

  return (
    <div className="p-6 max-w-full" style={{ background: '#F4F6FB', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📅 Planning Équipe</h1>
            <p className="text-sm text-gray-500 mt-0.5">Emploi du temps hebdomadaire • pauses déduites • ½ journée</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-100 shadow-sm">
            {(['planning', 'equipe'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-violet-100 text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t === 'planning' ? '📅 Emploi du temps' : '👥 Équipe'}
              </button>
            ))}
          </div>
        </div>

        {/* ── TAB PLANNING ── */}
        {tab === 'planning' && (
          <div className="space-y-4">
            {/* Week nav */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button onClick={prevWeek} className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-600 shadow-sm">‹</button>
                <div className="text-center min-w-[210px] bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2">
                  <div className="font-semibold text-sm text-gray-800">{getWeekLabel(week, year)}</div>
                  <div className="text-xs text-gray-400">S{week} · {year}</div>
                </div>
                <button onClick={nextWeek} className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 text-gray-600 shadow-sm">›</button>
              </div>
              <div className="flex gap-2">
                <button onClick={regenerate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 font-medium shadow-sm">🔄 Regénérer</button>
                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 font-medium shadow-sm">🖨️ Imprimer</button>
              </div>
            </div>

            {/* Légende pauses */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-amber-700">
              <span className="text-base">⏸</span>
              <span><strong>Temps net = temps brut − pause.</strong> Cliquez sur une cellule pour modifier le créneau et le temps de pause. Le total affiché est le temps <em>effectivement travaillé</em>.</span>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full border-collapse" style={{ minWidth: '960px' }}>
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="sticky left-0 bg-white z-10 w-44 p-3 text-left text-xs font-semibold text-gray-400 border-r border-gray-100">Salarié</th>
                    {DAYS.map(d => (
                      <th key={d} className="p-3 text-center border-r border-gray-100 last:border-r-0" style={{ minWidth: '110px' }}>
                        <div className="font-semibold text-sm text-gray-700">{DAYS_SHORT[d]}</div>
                        <div className="text-xs text-gray-400 font-normal">{d}</div>
                      </th>
                    ))}
                    <th className="p-3 text-center w-32 text-xs font-semibold text-gray-400">
                      <div>Net eff.</div>
                      <div className="font-normal text-gray-300">(brut − pause)</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, ei) => {
                    const col = COLORS[emp.colorIdx] || COLORS[0];
                    const netW = weekNetHours(emp.id, slots);
                    const grossW = weekGrossHours(emp.id, slots);
                    const totalPause = totalPauseHours(emp.id, slots);
                    const over = netW > emp.hoursPerWeek + 0.1;
                    const under = netW < emp.hoursPerWeek - 0.1;
                    return (
                      <tr key={emp.id} className={`border-b border-gray-50 last:border-b-0 ${ei % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                        {/* Name cell */}
                        <td className="p-3 sticky left-0 bg-inherit z-10 border-r border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs border-2 shrink-0 ${col.bg}`}>
                              {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-gray-800 truncate" style={{ maxWidth: '80px' }}>{emp.name.split(' ')[0]}</div>
                              <div className="text-xs text-gray-400 truncate" style={{ maxWidth: '80px' }}>{emp.role}</div>
                            </div>
                          </div>
                        </td>

                        {/* Day cells */}
                        {DAYS.map(day => {
                          const slot = getSlot(emp.id, day);
                          const sh = SHIFTS.find(s => s.id === slot.shiftId)!;
                          const netH = calcNetH(sh, slot.pause);
                          const rawH = calcRawH(sh.start, sh.end);
                          return (
                            <td key={day} className="p-1.5 border-r border-gray-50 last:border-r-0">
                              <button onClick={() => setEditTarget({ emp, day, slot })}
                                className={`w-full rounded-xl border-2 p-2 text-left transition-all hover:scale-[1.03] hover:shadow-md active:scale-[0.97] focus:outline-none ${sh.isRest ? 'bg-gray-50 border-gray-100 hover:border-gray-200' : sh.bgClass}`}
                                style={{ minHeight: '80px' }}>
                                {sh.isRest ? (
                                  <div className="flex flex-col items-center justify-center h-full gap-1 opacity-35">
                                    <span className="text-lg">{sh.emoji}</span>
                                    <span className="text-xs font-medium">Repos</span>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-0.5 h-full">
                                    <div className="flex items-center gap-1 font-semibold text-xs leading-tight">
                                      <span>{sh.emoji}</span>
                                      <span className="truncate">{sh.label}</span>
                                      {sh.isHalfDay && <span className="text-xs px-1 bg-orange-100 text-orange-600 rounded-full border border-orange-200 shrink-0">½j</span>}
                                    </div>
                                    <div className="text-xs opacity-60 font-mono">{sh.start}–{sh.end}</div>
                                    <div className="flex items-center gap-1 mt-auto">
                                      <span className="text-xs font-bold text-green-700">{fmtH(netH)}</span>
                                      {slot.pause > 0 && <span className="text-xs text-orange-500 opacity-70">−{fmtH(slot.pause)}</span>}
                                    </div>
                                    {slot.note && <div className="text-xs italic opacity-50 truncate">{slot.note}</div>}
                                  </div>
                                )}
                              </button>
                            </td>
                          );
                        })}

                        {/* Total column */}
                        <td className="p-3 text-center">
                          <div className={`text-sm font-bold font-mono px-2 py-1 rounded-lg inline-block ${over ? 'bg-red-50 text-red-600 border border-red-200' : under ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                            {fmtH(netW)}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">/ {emp.hoursPerWeek}h</div>
                          {totalPause > 0 && <div className="text-xs text-orange-400 mt-0.5">pause: {fmtH(totalPause)}</div>}
                          <div className="text-xs text-gray-300 mt-0.5">brut: {fmtH(grossW)}</div>
                          {over && <div className="text-xs text-red-500 font-semibold mt-0.5">⚠ Dépassement</div>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Légende créneaux */}
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="font-semibold text-gray-500">Créneaux :</span>
              {SHIFTS.map(sh => (
                <span key={sh.id} className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border ${sh.bgClass}`}>
                  <span>{sh.emoji}</span> {sh.label}
                  {sh.isHalfDay && <span className="font-bold opacity-60">½j</span>}
                  {sh.start && <span className="font-mono opacity-60">{sh.start}–{sh.end}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB EQUIPE ── */}
        {tab === 'equipe' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${teamOk ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
                  {employees.length}/9 salariés {teamOk ? '✓' : '⚠'}
                </span>
              </div>
              <button onClick={() => setShowAddEmp(true)} disabled={employees.length >= 9}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg,#9B85C4,#7A90B5)' }}>
                + Ajouter un salarié
              </button>
            </div>

            {!teamOk && employees.length < 7 && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <span className="text-red-500 mt-0.5 shrink-0">⚠</span>
                <p className="text-sm text-red-600">Ajoutez encore {7 - employees.length} salarié(s) pour un emploi du temps complet.</p>
              </div>
            )}

            <div className="space-y-3">
              {employees.map(emp => {
                const col = COLORS[emp.colorIdx] || COLORS[0];
                const netW = weekNetHours(emp.id, slots);
                const grossW = weekGrossHours(emp.id, slots);
                const over = netW > emp.hoursPerWeek + 0.1;
                return (
                  <div key={emp.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 hover:shadow-sm transition-shadow group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border-2 shrink-0 ${col.bg}`}>
                      {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800">{emp.name}</div>
                      <div className="text-sm text-gray-500">{emp.role}</div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{emp.contract}</span>
                        <span className="text-xs px-2 py-0.5 bg-violet-50 text-violet-700 rounded-full border border-violet-200">Max {emp.hoursPerWeek}h/sem</span>
                        {netW > 0 && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${over ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            Net: {fmtH(netW)} {over ? '⚠' : '✓'}
                          </span>
                        )}
                        {grossW > 0 && <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border border-gray-200">Brut: {fmtH(grossW)}</span>}
                        {emp.daysOff.length > 0 && <span className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full border border-gray-200">Repos: {emp.daysOff.join(', ')}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditEmp(emp)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-violet-500 hover:border-violet-200 transition-colors">✏️</button>
                      <button onClick={() => setDelEmp(emp)} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-200 transition-colors">🗑</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MODALS ── */}
        {editTarget && (
          <EditModal emp={editTarget.emp} day={editTarget.day} slot={editTarget.slot} onSave={saveSlot} onClose={() => setEditTarget(null)} />
        )}
        {showAddEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setShowAddEmp(false)}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 text-lg">Ajouter un salarié</h3>
                <button onClick={() => setShowAddEmp(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              <EmpForm takenColors={employees.map(e => e.colorIdx)} onSave={addEmp} onCancel={() => setShowAddEmp(false)} />
            </div>
          </div>
        )}
        {editEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setEditEmp(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-800 text-lg">Modifier le salarié</h3>
                <button onClick={() => setEditEmp(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              <EmpForm initial={editEmp} takenColors={employees.filter(e => e.id !== editEmp.id).map(e => e.colorIdx)} onSave={updateEmp} onCancel={() => setEditEmp(null)} />
            </div>
          </div>
        )}
        {delEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setDelEmp(null)}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="font-bold text-gray-800 text-lg mb-3">Supprimer ce salarié ?</h3>
              <p className="text-sm text-gray-500 mb-5">La suppression de <strong>{delEmp.name}</strong> retirera ses créneaux de tous les plannings.</p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setDelEmp(null)} className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600">Annuler</button>
                <button onClick={() => removeEmp(delEmp.id)} className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600">Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
