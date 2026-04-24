import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface TextStyle {
  text: string;
  fontSize: string;    // e.g. "1rem", "2.5rem"
  fontFamily: string;  // e.g. "Poppins"
  color: string;       // hex
  fontWeight: string;  // "400" | "600" | "700" | "800"
}

type EditorStore = Record<string, TextStyle>;

interface InlineEditorCtx {
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  store: EditorStore;
  get: (id: string, defaults: TextStyle) => TextStyle;
  set: (id: string, style: Partial<TextStyle>) => void;
  reset: () => void;
}

const STORAGE_KEY = 'becomeus_inline_texts';

const Ctx = createContext<InlineEditorCtx | null>(null);

export function InlineEditorProvider({ children }: { children: ReactNode }) {
  const [editMode, setEditMode] = useState(false);
  const [store, setStore] = useState<EditorStore>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : {};
    } catch { return {}; }
  });

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const get = useCallback((id: string, defaults: TextStyle): TextStyle => {
    return store[id] ? { ...defaults, ...store[id] } : defaults;
  }, [store]);

  const set = useCallback((id: string, patch: Partial<TextStyle>) => {
    setStore(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }, []);

  const reset = useCallback(() => {
    setStore({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <Ctx.Provider value={{ editMode, setEditMode, store, get, set, reset }}>
      {children}
    </Ctx.Provider>
  );
}

export function useInlineEditor() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useInlineEditor must be used inside InlineEditorProvider');
  return ctx;
}
