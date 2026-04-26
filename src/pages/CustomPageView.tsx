import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSettings } from '@/lib/settings';
import { Pencil, Check, X, FileText } from 'lucide-react';

export default function CustomPageView() {
  const { pageId } = useParams<{ pageId: string }>();
  const { settings, updateSettings, saveSettings } = useSettings();
  const page = settings.navItems.find(n => n.id === pageId);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (page) setTitle(page.label);
    if (pageId) setContent(localStorage.getItem(`bu_page_${pageId}`) || '');
  }, [pageId, page?.label]);

  const handleSave = async () => {
    if (pageId) localStorage.setItem(`bu_page_${pageId}`, content);
    if (page && pageId) {
      updateSettings({
        navItems: settings.navItems.map(n => n.id === pageId ? { ...n, label: title } : n),
      });
      await saveSettings();
    }
    setEditing(false);
  };

  if (!page) return (
    <div className="p-8 flex flex-col items-center justify-center text-gray-400 min-h-96">
      <FileText size={48} className="mb-4 opacity-20" />
      <p className="text-lg font-medium">Page introuvable</p>
    </div>
  );

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input value={title} onChange={e => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-gray-800 border-b-2 focus:outline-none bg-transparent pb-1"
              style={{ borderColor: page.color }} />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-3 h-10 rounded-full flex-shrink-0" style={{ background: page.color }} />
              <h1 className="text-2xl font-bold text-gray-800">{page.label}</h1>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {editing ? (
            <>
              <button onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90"
                style={{ background: `linear-gradient(135deg,${page.color},#9B85C4)` }}>
                <Check size={14} />Sauvegarder
              </button>
              <button onClick={() => setEditing(false)} className="p-2 rounded-xl hover:bg-gray-100">
                <X size={16} className="text-gray-400" />
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed text-sm font-medium transition-all hover:bg-gray-50"
              style={{ borderColor: page.color, color: page.color }}>
              <Pencil size={13} />Modifier
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {editing ? (
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder="Rédigez le contenu de cette page librement — notes, ressources, informations, checklist…"
          rows={20}
          className="w-full px-5 py-4 rounded-2xl border text-sm text-gray-700 focus:outline-none focus:ring-2 resize-none leading-relaxed"
          style={{ borderColor: `${page.color}40`, '--tw-ring-color': `${page.color}30` } as React.CSSProperties} />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {content ? (
            <div className="p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap min-h-48">{content}</div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <FileText size={40} className="mb-3 opacity-20" />
              <p className="font-medium">Page vide</p>
              <p className="text-xs mt-1 mb-4">Cliquez sur "Modifier" pour ajouter du contenu</p>
              <button onClick={() => setEditing(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90"
                style={{ background: `linear-gradient(135deg,${page.color},#9B85C4)` }}>
                Ajouter du contenu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
