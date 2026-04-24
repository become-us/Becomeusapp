import React, {
  useState, useRef, useEffect, CSSProperties, ElementType
} from 'react';
import { useInlineEditor, TextStyle } from '@/lib/inlineEditor';
import { Pencil, Check, X, RotateCcw } from 'lucide-react';

const FONTS = ['Poppins', 'Inter', 'Montserrat', 'Raleway', 'Nunito', 'DM Sans', 'Plus Jakarta Sans'];
const WEIGHTS = [
  { label: 'Fin', value: '300' },
  { label: 'Normal', value: '400' },
  { label: 'Moyen', value: '500' },
  { label: 'Semi-gras', value: '600' },
  { label: 'Gras', value: '700' },
  { label: 'Extra-gras', value: '800' },
];

interface EditableTextProps {
  id: string;
  defaults: TextStyle;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export default function EditableText({
  id,
  defaults,
  as: Tag = 'span',
  className = '',
  style = {},
}: EditableTextProps) {
  const { editMode, get, set } = useInlineEditor();
  const current = get(id, defaults);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TextStyle>(current);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Sync draft when store changes externally
  useEffect(() => {
    setDraft(get(id, defaults));
  }, [id]);

  // Position the panel near the clicked element
  const openPanel = (e: React.MouseEvent) => {
    if (!editMode) return;
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const panelWidth = 260;
    const left = Math.min(
      Math.max(rect.left + window.scrollX, 8),
      window.innerWidth - panelWidth - 8
    );
    const top = rect.bottom + window.scrollY + 6;
    setPanelPos({ top, left });
    setDraft(get(id, defaults));
    setOpen(true);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const applyAndClose = () => {
    set(id, draft);
    setOpen(false);
  };

  const cancelAndClose = () => {
    setDraft(get(id, defaults));
    setOpen(false);
  };

  const resetToDefault = () => {
    setDraft(defaults);
    set(id, defaults);
    setOpen(false);
  };

  // Rendered styles
  const textStyle: CSSProperties = {
    fontSize: current.fontSize,
    fontFamily: `'${current.fontFamily}', sans-serif`,
    color: current.color,
    fontWeight: current.fontWeight,
    ...style,
  };

  const editModeStyle: CSSProperties = editMode ? {
    cursor: 'pointer',
    outline: open ? '2px solid #7A90B5' : '1px dashed rgba(122,144,181,0.5)',
    outlineOffset: '2px',
    borderRadius: '3px',
    transition: 'outline 0.15s ease',
  } : {};

  return (
    <>
      {/* The text element itself */}
      <Tag
        ref={wrapRef as React.Ref<HTMLDivElement>}
        className={className}
        style={{ ...textStyle, ...editModeStyle, position: 'relative', display: 'inline' }}
        onClick={openPanel}
        title={editMode ? '✏️ Cliquer pour modifier' : undefined}
      >
        {current.text}

        {/* Small pencil indicator when hovered in edit mode */}
        {editMode && (
          <span
            className="inline-flex items-center justify-center ml-1 opacity-40 hover:opacity-100 transition-opacity align-middle"
            style={{ fontSize: '0.6em' }}
          >
            <Pencil size={10} />
          </span>
        )}
      </Tag>

      {/* Floating toolbar panel — rendered in a portal-like fixed div */}
      {open && (
        <div
          ref={panelRef}
          className="fixed z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-100"
          style={{ top: panelPos.top, left: panelPos.left, width: 260 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 bg-gradient-to-r from-[#7A90B5]/10 to-[#9B85C4]/10 rounded-t-2xl">
            <span className="text-xs font-bold text-gray-600">✏️ Modifier le texte</span>
            <div className="flex items-center gap-1">
              <button onClick={resetToDefault} title="Réinitialiser" className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-orange-400 transition-colors">
                <RotateCcw size={12} />
              </button>
              <button onClick={cancelAndClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={12} />
              </button>
              <button onClick={applyAndClose} className="p-1 rounded-lg hover:bg-green-50 text-green-500 transition-colors">
                <Check size={12} />
              </button>
            </div>
          </div>

          <div className="p-3 space-y-3">
            {/* Text content */}
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Texte</label>
              <textarea
                value={draft.text}
                onChange={(e) => setDraft(d => ({ ...d, text: e.target.value }))}
                rows={2}
                className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-[#7A90B5] text-gray-800"
                style={{ fontFamily: `'${draft.fontFamily}', sans-serif` }}
              />
            </div>

            {/* Color + size row */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 font-medium block mb-1">Couleur</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={draft.color}
                    onChange={(e) => setDraft(d => ({ ...d, color: e.target.value }))}
                    className="w-8 h-7 rounded border border-gray-200 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={draft.color}
                    onChange={(e) => setDraft(d => ({ ...d, color: e.target.value }))}
                    className="flex-1 text-xs border border-gray-200 rounded px-1.5 py-1 font-mono text-gray-700 focus:outline-none"
                  />
                </div>
              </div>
              <div className="w-20">
                <label className="text-xs text-gray-500 font-medium block mb-1">Taille</label>
                <input
                  type="text"
                  value={draft.fontSize}
                  onChange={(e) => setDraft(d => ({ ...d, fontSize: e.target.value }))}
                  placeholder="1rem"
                  className="w-full text-xs border border-gray-200 rounded px-1.5 py-1 font-mono text-gray-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Font family */}
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Police</label>
              <select
                value={draft.fontFamily}
                onChange={(e) => setDraft(d => ({ ...d, fontFamily: e.target.value }))}
                className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none"
              >
                {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Font weight */}
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Épaisseur</label>
              <div className="flex flex-wrap gap-1">
                {WEIGHTS.map(w => (
                  <button
                    key={w.value}
                    onClick={() => setDraft(d => ({ ...d, fontWeight: w.value }))}
                    className="text-xs px-2 py-1 rounded-lg border transition-all"
                    style={{
                      fontWeight: w.value,
                      background: draft.fontWeight === w.value ? '#7A90B5' : 'white',
                      color: draft.fontWeight === w.value ? 'white' : '#6B7A90',
                      borderColor: draft.fontWeight === w.value ? '#7A90B5' : '#E5E9F0',
                    }}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Aperçu :</p>
              <p style={{
                fontSize: draft.fontSize,
                fontFamily: `'${draft.fontFamily}', sans-serif`,
                color: draft.color,
                fontWeight: draft.fontWeight,
                lineHeight: 1.3,
                wordBreak: 'break-word',
              }}>
                {draft.text || '—'}
              </p>
            </div>

            {/* Apply button */}
            <button
              onClick={applyAndClose}
              className="w-full py-2 text-xs font-bold text-white rounded-xl transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(90deg, #7A90B5, #9B85C4)' }}
            >
              ✓ Appliquer les modifications
            </button>
          </div>
        </div>
      )}
    </>
  );
}
