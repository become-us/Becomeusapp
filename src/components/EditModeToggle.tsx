import React from 'react';
import { Pencil, PencilOff, RotateCcw } from 'lucide-react';
import { useInlineEditor } from '@/lib/inlineEditor';

export default function EditModeToggle() {
  const { editMode, setEditMode, reset } = useInlineEditor();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {/* Main toggle button */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
        style={{
          background: editMode
            ? 'linear-gradient(135deg, #7A90B5, #9B85C4)'
            : 'white',
          color: editMode ? 'white' : '#6B7A90',
          border: editMode ? 'none' : '1.5px solid #E5E9F0',
          boxShadow: editMode
            ? '0 8px 24px rgba(122,144,181,0.4)'
            : '0 4px 16px rgba(0,0,0,0.1)',
        }}
        title={editMode ? 'Désactiver le mode édition' : 'Activer le mode édition'}
      >
        {editMode ? <PencilOff size={16} /> : <Pencil size={16} />}
        {editMode ? 'Quitter édition' : '✏️ Modifier les textes'}
      </button>

      {/* Instruction badge when active */}
      {editMode && (
        <div
          className="text-xs px-3 py-2 rounded-xl max-w-[180px] leading-snug shadow"
          style={{ background: 'rgba(122,144,181,0.12)', color: '#7A90B5', border: '1px dashed #7A90B5' }}
        >
          Cliquez sur n'importe quel texte pour le modifier
        </div>
      )}

      {/* Reset button when active */}
      {editMode && (
        <button
          onClick={() => { if (window.confirm('Réinitialiser tous les textes aux valeurs par défaut ?')) reset(); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-red-400 hover:text-red-600 transition-colors"
          style={{ background: 'white', border: '1px solid #FECACA', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <RotateCcw size={11} />
          Tout réinitialiser
        </button>
      )}
    </div>
  );
}
