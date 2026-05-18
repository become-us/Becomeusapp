import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  textAlign?: 'left' | 'center' | 'right';
  letterSpacing?: string;
  lineHeight?: string;
  opacity?: string;
}

interface EditCtx {
  editMode: boolean;
  toggleEditMode: () => void;
  selectedId: string | null;
  selectEl: (id: string | null) => void;
  styles: Record<string, ElementStyle>;
  setStyle: (id: string, patch: ElementStyle) => void;
  resetStyle: (id: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<EditCtx | null>(null);
export const useEditStore = () => useContext(Ctx)!;

const LS_KEY = 'bu_element_styles';
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; } };
const save = (s: Record<string, ElementStyle>) => localStorage.setItem(LS_KEY, JSON.stringify(s));

export function EditModeProvider({ children }: React.PropsWithChildren) {
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [styles, setStyles] = useState<Record<string, ElementStyle>>(load);

  const toggleEditMode = useCallback(() => {
    setEditMode(v => { if (v) setSelectedId(null); return !v; });
  }, []);

  const selectEl = useCallback((id: string | null) => setSelectedId(id), []);

  const setStyle = useCallback((id: string, patch: ElementStyle) => {
    setStyles(prev => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } };
      save(next);
      return next;
    });
  }, []);

  const resetStyle = useCallback((id: string) => {
    setStyles(prev => {
      const next = { ...prev };
      delete next[id];
      save(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setStyles({});
    localStorage.removeItem(LS_KEY);
  }, []);

  return (
    <Ctx.Provider value={{ editMode, toggleEditMode, selectedId, selectEl, styles, setStyle, resetStyle, resetAll }}>
      {children}
    </Ctx.Provider>
  );
}
