import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';

export interface TextStyle extends Record<string, string> {
  content: string;
  color: string;
  fontSize: string;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
}

type Store = Record<string, TextStyle>;

interface Ctx {
  editMode: boolean;
  toggleEditMode: () => void;
  store: Store;
  get: (id: string, def: TextStyle) => TextStyle;
  set: (id: string, patch: Partial<TextStyle>) => void;
  resetAll: () => void;
}

const KEY = 'bu_editor_v2';
const EditorCtx = createContext<Ctx | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  const [store, setStore] = useState<Store>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(store)); }, [store]);

  const get = useCallback((id: string, def: TextStyle): TextStyle =>
    store[id] ? { ...def, ...store[id] } : def, [store]);

  const set = useCallback((id: string, patch: Partial<TextStyle>) =>
    setStore(p => ({ ...p, [id]: { ...p[id], ...patch } })), []);

  const resetAll = useCallback(() => { setStore({}); localStorage.removeItem(KEY); }, []);
  const toggleEditMode = useCallback(() => setEditMode(p => !p), []);

  return <EditorCtx.Provider value={{ editMode, toggleEditMode, store, get, set, resetAll }}>{children}</EditorCtx.Provider>;
}

export function useEditor() {
  const c = useContext(EditorCtx);
  if (!c) throw new Error('useEditor must be inside EditorProvider');
  return c;
}

// ── Hook for a single editable zone ──────────────────────────────────────────
export function useEditZone(id: string, defaults: TextStyle) {
  const { editMode, get, set } = useEditor();
  const current = get(id, defaults);
  const ref = useRef<HTMLElement>(null);
  const focused = useRef(false);

  // Sync DOM content when not focused
  useEffect(() => {
    if (ref.current && !focused.current) {
      ref.current.textContent = current.content;
    }
  }, [current.content]);

  const handleFocus = () => { focused.current = true; };
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    focused.current = false;
    const txt = e.currentTarget.textContent || '';
    if (txt !== current.content) set(id, { content: txt });
  };

  return { editMode, current, ref, handleFocus, handleBlur, set: (p: Partial<TextStyle>) => set(id, p) };
}
