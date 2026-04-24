import React, { useState, useRef, useEffect, useCallback, CSSProperties, ElementType } from 'react';
import { useEditor, TextStyle } from '@/lib/editorStore';
import { Bold, Italic, Underline, Plus, GripVertical } from 'lucide-react';

const FONTS = ['Poppins','Inter','Montserrat','Raleway','Nunito','DM Sans','Plus Jakarta Sans'];
const SIZES = ['0.7rem','0.8rem','0.875rem','1rem','1.125rem','1.25rem','1.5rem','1.75rem','2rem','2.5rem','3rem','3.5rem','4rem'];
const WEIGHTS: Record<string,string> = { '300':'Fin', '400':'Normal', '600':'Semi', '700':'Gras', '800':'Xtra' };

/* ─── FORMAT BAR (appears above each active zone) ─────────────────────────── */
interface FmtBarProps {
  style: TextStyle;
  onChange: (p: Partial<TextStyle>) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function FormatBar({ style, onChange, onClose, anchorRef }: FmtBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const update = () => {
      if (!anchorRef.current) return;
      const r = anchorRef.current.getBoundingClientRect();
      const barW = 420;
      const left = Math.min(Math.max(r.left + window.scrollX, 4), window.innerWidth - barW - 4);
      setPos({ top: r.top + window.scrollY - 52, left });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); };
  }, [anchorRef]);

  // Don't close when clicking inside bar
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (barRef.current?.contains(e.target as Node)) return;
      if (anchorRef.current?.contains(e.target as Node)) return;
      onClose();
    };
    setTimeout(() => document.addEventListener('mousedown', handler), 100);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  const toggle = (field: 'fontStyle' | 'textDecoration', onVal: string) => {
    const cur = (style as Record<string,string>)[field] || '';
    onChange({ [field]: cur === onVal ? 'normal' : onVal } as Partial<TextStyle>);
  };

  return (
    <div
      ref={barRef}
      className="fixed z-[9999] flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-2xl border border-gray-100"
      style={{ top: pos.top, left: pos.left, background: '#fff', minWidth: 320, flexWrap: 'wrap' }}
      onMouseDown={(e) => e.preventDefault()} // prevent blur
    >
      {/* Font family */}
      <select value={style.fontFamily} onChange={e => onChange({ fontFamily: e.target.value })}
        className="text-xs border border-gray-200 rounded-lg px-1.5 py-1 bg-white text-gray-700 focus:outline-none w-28">
        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
      </select>

      {/* Font size */}
      <select value={style.fontSize} onChange={e => onChange({ fontSize: e.target.value })}
        className="text-xs border border-gray-200 rounded-lg px-1.5 py-1 bg-white text-gray-700 focus:outline-none w-20">
        {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>

      {/* Weight */}
      <select value={style.fontWeight} onChange={e => onChange({ fontWeight: e.target.value })}
        className="text-xs border border-gray-200 rounded-lg px-1.5 py-1 bg-white text-gray-700 focus:outline-none w-16">
        {Object.entries(WEIGHTS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
      </select>

      {/* Bold */}
      <button onMouseDown={e=>{e.preventDefault();toggle('fontStyle','italic')}}
        className={`p-1.5 rounded-lg transition-colors ${style.fontStyle==='italic'?'bg-[#7A90B5] text-white':'hover:bg-gray-100 text-gray-500'}`}>
        <Italic size={13}/>
      </button>

      {/* Underline */}
      <button onMouseDown={e=>{e.preventDefault();toggle('textDecoration','underline')}}
        className={`p-1.5 rounded-lg transition-colors ${(style as Record<string,string>).textDecoration==='underline'?'bg-[#7A90B5] text-white':'hover:bg-gray-100 text-gray-500'}`}>
        <Underline size={13}/>
      </button>

      {/* Bold */}
      <button onMouseDown={e=>{e.preventDefault(); onChange({ fontWeight: style.fontWeight==='700'?'400':'700' })}}
        className={`p-1.5 rounded-lg transition-colors ${style.fontWeight==='700'||style.fontWeight==='800'?'bg-[#7A90B5] text-white':'hover:bg-gray-100 text-gray-500'}`}>
        <Bold size={13}/>
      </button>

      {/* Color */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400">A</span>
        <input type="color" value={style.color} onChange={e => onChange({ color: e.target.value })}
          className="w-6 h-6 rounded border border-gray-200 cursor-pointer p-0" />
      </div>

      {/* Hex input */}
      <input type="text" value={style.color} onChange={e => onChange({ color: e.target.value })}
        className="text-xs border border-gray-200 rounded px-1.5 py-1 font-mono text-gray-700 focus:outline-none w-16" />
    </div>
  );
}

/* ─── EDIT ZONE ───────────────────────────────────────────────────────────── */
interface EditZoneProps {
  id: string;
  defaults: TextStyle;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}

export default function EditZone({ id, defaults, as: Tag = 'span', className = '', style = {} }: EditZoneProps) {
  const { editMode, get, set } = useEditor();
  const current = get(id, defaults);
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const isFocused = useRef(false);

  // Sync DOM text when not focused
  useEffect(() => {
    if (ref.current && !isFocused.current) {
      if (ref.current.textContent !== current.content) {
        ref.current.textContent = current.content;
      }
    }
  }, [current.content]);

  const handleFocus = useCallback(() => {
    isFocused.current = true;
    setActive(true);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLElement>) => {
    // Small delay so FormatBar click doesn't trigger blur save prematurely
    setTimeout(() => {
      isFocused.current = false;
      const txt = e.currentTarget?.textContent || '';
      set(id, { content: txt });
    }, 150);
  }, [id, set]);

  const computedStyle: CSSProperties = {
    color: current.color,
    fontSize: current.fontSize,
    fontFamily: `'${current.fontFamily}', sans-serif`,
    fontWeight: current.fontWeight,
    fontStyle: current.fontStyle || 'normal',
    textDecoration: (current as Record<string,string>).textDecoration || 'none',
    ...style,
  };

  const editBorder: CSSProperties = editMode ? {
    outline: active ? '2px solid #7A90B5' : '1px dashed rgba(122,144,181,0.45)',
    outlineOffset: '2px',
    borderRadius: '3px',
    cursor: 'text',
    minWidth: '20px',
    display: 'inline-block',
    transition: 'outline 0.1s',
  } : {};

  return (
    <>
      {active && editMode && (
        <FormatBar
          style={current}
          onChange={(p) => set(id, p)}
          onClose={() => setActive(false)}
          anchorRef={ref}
        />
      )}
      <Tag
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
        style={{ ...computedStyle, ...editBorder }}
        contentEditable={editMode || undefined}
        suppressContentEditableWarning={editMode}
        onFocus={editMode ? handleFocus : undefined}
        onBlur={editMode ? handleBlur : undefined}
        data-edit-id={id}
      />
    </>
  );
}

/* ─── DRAG LIST (reorder cards) ────────────────────────────────────────────── */
interface DragListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number, handle: React.ReactNode) => React.ReactNode;
  className?: string;
}

export function DragList<T>({ items, onReorder, renderItem, className = '' }: DragListProps<T>) {
  const { editMode } = useEditor();
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  const handleDragStart = (i: number) => setDragging(i);
  const handleDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setOver(i); };
  const handleDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragging === null || dragging === i) { setDragging(null); setOver(null); return; }
    const next = [...items];
    const [moved] = next.splice(dragging, 1);
    next.splice(i, 0, moved);
    onReorder(next);
    setDragging(null); setOver(null);
  };

  const handle = (i: number) => editMode ? (
    <div
      draggable
      onDragStart={() => handleDragStart(i)}
      onDragEnd={() => { setDragging(null); setOver(null); }}
      className="absolute top-2 right-2 cursor-grab active:cursor-grabbing p-1 rounded-lg bg-white/80 shadow hover:bg-[#7A90B5]/10 transition-colors z-10"
      title="Glisser pour réordonner"
    >
      <GripVertical size={14} className="text-[#7A90B5]" />
    </div>
  ) : null;

  return (
    <div className={className}>
      {items.map((item, i) => (
        <div
          key={i}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={(e) => handleDrop(e, i)}
          style={{
            opacity: dragging === i ? 0.4 : 1,
            outline: over === i && dragging !== i ? '2px dashed #7A90B5' : undefined,
            outlineOffset: '4px',
            borderRadius: '1rem',
            transition: 'opacity 0.15s, outline 0.1s',
            position: 'relative',
          }}
        >
          {renderItem(item, i, handle(i))}
        </div>
      ))}
    </div>
  );
}

/* ─── ADD TEXT BUTTON ───────────────────────────────────────────────────────── */
export function AddTextBtn({ onAdd }: { onAdd: () => void }) {
  const { editMode } = useEditor();
  if (!editMode) return null;
  return (
    <button onClick={onAdd}
      className="flex items-center gap-1.5 mx-auto mt-4 text-xs text-[#7A90B5] border border-dashed border-[#7A90B5] px-3 py-1.5 rounded-full hover:bg-[#7A90B5]/10 transition-colors">
      <Plus size={12} /> Ajouter un texte
    </button>
  );
}

/* ─── EDIT MODE TOGGLE ──────────────────────────────────────────────────────── */
export function EditToggle() {
  const { editMode, toggleEditMode, resetAll } = useEditor();
  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      <button onClick={toggleEditMode}
        className="flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
        style={{
          background: editMode ? 'linear-gradient(135deg,#7A90B5,#9B85C4)' : 'white',
          color: editMode ? 'white' : '#6B7A90',
          border: editMode ? 'none' : '1.5px solid #E5E9F0',
          boxShadow: editMode ? '0 8px 24px rgba(122,144,181,0.4)' : '0 4px 16px rgba(0,0,0,0.1)',
        }}>
        ✏️ {editMode ? 'Quitter édition' : 'Modifier la page'}
      </button>
      {editMode && (
        <>
          <div className="text-xs px-3 py-2 rounded-xl leading-snug shadow"
            style={{ background: 'rgba(122,144,181,0.1)', color: '#7A90B5', border: '1px dashed #7A90B5', maxWidth: 180 }}>
            Cliquez sur un texte pour l'éditer · Glissez les cartes pour les déplacer
          </div>
          <button onClick={() => { if (window.confirm('Réinitialiser toute la page ?')) resetAll(); }}
            className="text-xs text-red-400 hover:text-red-600 px-3 py-1.5 rounded-full transition-colors"
            style={{ background: 'white', border: '1px solid #FECACA' }}>
            🔄 Tout réinitialiser
          </button>
        </>
      )}
    </div>
  );
}
