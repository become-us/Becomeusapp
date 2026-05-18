import React from 'react';
import { useEditStore, ElementStyle } from '@/lib/editStore';
import { X, RotateCcw, Bold, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export function StylePanel() {
  const { editMode, selectedId, selectEl, styles, setStyle, resetStyle } = useEditStore();
  if (!editMode || !selectedId) return null;

  const s = (styles[selectedId] || {}) as ElementStyle;
  const fontSize = parseInt(s.fontSize || '16');
  const isBold = s.fontWeight === 'bold' || s.fontWeight === '700';
  const isItalic = s.fontStyle === 'italic';
  const color = s.color || '#1f2937';
  const bg = s.backgroundColor || '#ffffff';
  const radius = parseInt(s.borderRadius || '0');
  const pad = parseInt(s.padding || '0');
  const align = s.textAlign || 'left';
  const lineH = parseFloat(s.lineHeight || '1.5');
  const opacity = parseInt(s.opacity || '100');

  const u = (patch: ElementStyle) => setStyle(selectedId, patch);

  return (
    <div className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-white shadow-2xl border-r border-gray-100 flex flex-col" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,#EDF2FB,#F3EFFC)' }}>
        <div className="min-w-0">
          <p className="text-xs font-bold" style={{ color: '#7A90B5' }}>✏️ Modifier l'élément</p>
          <p className="text-xs text-gray-400 truncate font-mono">{selectedId}</p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => resetStyle(selectedId)} title="Réinitialiser"
            className="p-1.5 rounded-lg hover:bg-white/70 text-gray-400 hover:text-red-400 transition-colors">
            <RotateCcw size={13} />
          </button>
          <button onClick={() => selectEl(null)} className="p-1.5 rounded-lg hover:bg-white/70 text-gray-400 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">

        {/* Taille texte */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Taille du texte — {fontSize}px</label>
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => u({ fontSize: `${Math.max(8, fontSize - 1)}px` })}
              className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 flex items-center justify-center text-xl transition-colors">−</button>
            <input type="number" value={fontSize} min={8} max={96}
              onChange={e => u({ fontSize: `${e.target.value}px` })}
              className="flex-1 text-center py-2 rounded-xl border border-gray-200 text-sm font-bold focus:outline-none focus:ring-2 focus:border-[#7A90B5]"
              style={{ '--tw-ring-color': '#7A90B5' } as React.CSSProperties} />
            <button onClick={() => u({ fontSize: `${Math.min(96, fontSize + 1)}px` })}
              className="w-9 h-9 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 flex items-center justify-center text-xl transition-colors">+</button>
          </div>
          <input type="range" min={8} max={72} value={fontSize}
            onChange={e => u({ fontSize: `${e.target.value}px` })}
            className="w-full accent-[#7A90B5]" />
        </div>

        {/* Style */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Style du texte</label>
          <div className="flex gap-2">
            <button onClick={() => u({ fontWeight: isBold ? 'normal' : 'bold' })}
              className={`flex-1 py-2.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${isBold ? 'text-white border-transparent' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
              style={isBold ? { background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' } : {}}>
              <Bold size={14} />Gras
            </button>
            <button onClick={() => u({ fontStyle: isItalic ? 'normal' : 'italic' })}
              className={`flex-1 py-2.5 rounded-xl border text-sm transition-all flex items-center justify-center gap-1.5 ${isItalic ? 'text-white border-transparent' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
              style={isItalic ? { background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' } : {}}>
              <Italic size={14} />Italique
            </button>
          </div>
        </div>

        {/* Alignement */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Alignement</label>
          <div className="flex gap-2">
            {([['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]] as const).map(([a, Icon]) => (
              <button key={a} onClick={() => u({ textAlign: a })}
                className={`flex-1 py-2.5 rounded-xl border transition-all ${align === a ? 'text-white border-transparent' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                style={align === a ? { background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' } : {}}>
                <Icon size={15} className="mx-auto" />
              </button>
            ))}
          </div>
        </div>

        {/* Couleurs */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Couleurs</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Texte', val: color, key: 'color' },
              { label: 'Fond', val: bg, key: 'backgroundColor' },
            ].map(({ label, val, key }) => (
              <label key={key} className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 cursor-pointer hover:border-[#7A90B5]/40 bg-white shadow-sm transition-all">
                <div className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm relative flex-shrink-0 overflow-hidden" style={{ background: val }}>
                  <input type="color" value={val}
                    onChange={e => u({ [key]: e.target.value } as ElementStyle)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 font-mono truncate">{val}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Espacement */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Espacement interne — {pad}px</label>
          <input type="range" min={0} max={64} value={pad}
            onChange={e => u({ padding: `${e.target.value}px` })}
            className="w-full accent-[#7A90B5]" />
          <div className="flex justify-between text-xs text-gray-300 mt-0.5"><span>0</span><span>64px</span></div>
        </div>

        {/* Arrondi */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Arrondi des coins — {radius}px</label>
          <input type="range" min={0} max={40} value={radius}
            onChange={e => u({ borderRadius: `${e.target.value}px` })}
            className="w-full accent-[#7A90B5]" />
        </div>

        {/* Interligne */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Interligne — {lineH}</label>
          <input type="range" min={1} max={3} step={0.1} value={lineH}
            onChange={e => u({ lineHeight: e.target.value })}
            className="w-full accent-[#7A90B5]" />
        </div>

        {/* Opacité */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Opacité — {opacity}%</label>
          <input type="range" min={10} max={100} value={opacity}
            onChange={e => u({ opacity: `${e.target.value}` })}
            className="w-full accent-[#7A90B5]" />
        </div>

      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50">
        <button onClick={() => resetStyle(selectedId)}
          className="w-full py-2.5 rounded-xl border border-dashed border-red-200 text-xs font-medium text-red-400 hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
          <RotateCcw size={11} />Réinitialiser cet élément
        </button>
      </div>
    </div>
  );
}
