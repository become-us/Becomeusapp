import React, { useState, useEffect, useCallback } from 'react';
import { Settings, X, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface CustomTheme {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBackground: string;
  colorText: string;
  colorTextMuted: string;
  fontFamily: string;
  heroSize: string;
  h2Size: string;
  bodySize: string;
  taglineSize: string;
  sectionPadding: string;
  cardRadius: string;
  buttonRadius: string;
  gap: string;
}

const DEFAULT_THEME: CustomTheme = {
  colorPrimary: '#7A90B5',
  colorSecondary: '#C4956A',
  colorAccent: '#9B85C4',
  colorBackground: '#FAFAFA',
  colorText: '#1E2A3A',
  colorTextMuted: '#6B7A90',
  fontFamily: 'Poppins',
  heroSize: '3.5',
  h2Size: '2.5',
  bodySize: '1',
  taglineSize: '1',
  sectionPadding: '6',
  cardRadius: '1',
  buttonRadius: '9999',
  gap: '1.5',
};

const FONT_OPTIONS = ['Poppins', 'Inter', 'Montserrat', 'Raleway', 'Nunito', 'DM Sans', 'Plus Jakarta Sans'];

const STORAGE_KEY = 'becomeus_theme';

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useCustomTheme(): [CustomTheme, (t: CustomTheme) => void, () => void] {
  const [theme, setThemeState] = useState<CustomTheme>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_THEME, ...JSON.parse(saved) } : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });

  const applyTheme = useCallback((t: CustomTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--bu-primary', t.colorPrimary);
    root.style.setProperty('--bu-secondary', t.colorSecondary);
    root.style.setProperty('--bu-accent', t.colorAccent);
    root.style.setProperty('--bu-background', t.colorBackground);
    root.style.setProperty('--bu-text', t.colorText);
    root.style.setProperty('--bu-text-muted', t.colorTextMuted);
    root.style.setProperty('--bu-hero-size', `${t.heroSize}rem`);
    root.style.setProperty('--bu-h2-size', `${t.h2Size}rem`);
    root.style.setProperty('--bu-body-size', `${t.bodySize}rem`);
    root.style.setProperty('--bu-tagline-size', `${t.taglineSize}rem`);
    root.style.setProperty('--bu-section-padding', `${t.sectionPadding}rem`);
    root.style.setProperty('--bu-card-radius', `${t.cardRadius}rem`);
    root.style.setProperty('--bu-button-radius', `${t.buttonRadius}px`);
    root.style.setProperty('--bu-gap', `${t.gap}rem`);
    // Font
    const fontLink = document.getElementById('bu-font-link') as HTMLLinkElement | null;
    const fontUrl = `https://fonts.googleapis.com/css2?family=${t.fontFamily.replace(/ /g, '+')}:wght@300;400;500;600;700;800&display=swap`;
    if (fontLink) {
      fontLink.href = fontUrl;
    } else {
      const link = document.createElement('link');
      link.id = 'bu-font-link';
      link.rel = 'stylesheet';
      link.href = fontUrl;
      document.head.appendChild(link);
    }
    root.style.setProperty('--bu-font', `'${t.fontFamily}', sans-serif`);
    document.body.style.fontFamily = `'${t.fontFamily}', sans-serif`;
  }, []);

  const setTheme = useCallback((t: CustomTheme) => {
    setThemeState(t);
    applyTheme(t);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
  }, [applyTheme]);

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME);
    localStorage.removeItem(STORAGE_KEY);
  }, [setTheme]);

  useEffect(() => { applyTheme(theme); }, []);

  return [theme, setTheme, resetTheme];
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-2 border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="px-4 py-3 space-y-3 bg-white">{children}</div>}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-600 flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 text-xs border border-gray-200 rounded-lg px-2 py-1.5 font-mono text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, unit, onChange }: {
  label: string; value: string; min: number; max: number; step: number; unit: string; onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={parseFloat(value)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-1.5 rounded-full accent-blue-400 cursor-pointer"
      />
    </div>
  );
}

// ── Main Panel ─────────────────────────────────────────────────────────────────
export default function CustomizerPanel() {
  const [theme, setTheme, resetTheme] = useCustomTheme();
  const [open, setOpen] = useState(false);

  const update = (key: keyof CustomTheme) => (value: string) => {
    setTheme({ ...theme, [key]: value });
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #7A90B5, #9B85C4)' }}
        title="Personnaliser le design"
      >
        {open ? <X size={22} className="text-white" /> : <Settings size={22} className="text-white" />}
      </button>

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full z-40 bg-white shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          open ? 'w-80 translate-x-0' : 'w-80 translate-x-full'
        }`}
        style={{ borderLeft: '1px solid #E5E9F0' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[#7A90B5]/10 to-[#9B85C4]/10">
          <div>
            <h2 className="font-bold text-gray-800 text-sm">🎨 Personnalisation</h2>
            <p className="text-xs text-gray-500 mt-0.5">Modifiez tout en temps réel</p>
          </div>
          <button
            onClick={resetTheme}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
            title="Réinitialiser"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">

          {/* COULEURS */}
          <Section title="🎨 Couleurs">
            <ColorRow label="Primaire (bleu)" value={theme.colorPrimary} onChange={update('colorPrimary')} />
            <ColorRow label="Secondaire (corail)" value={theme.colorSecondary} onChange={update('colorSecondary')} />
            <ColorRow label="Accent (lavande)" value={theme.colorAccent} onChange={update('colorAccent')} />
            <ColorRow label="Fond" value={theme.colorBackground} onChange={update('colorBackground')} />
            <ColorRow label="Texte principal" value={theme.colorText} onChange={update('colorText')} />
            <ColorRow label="Texte secondaire" value={theme.colorTextMuted} onChange={update('colorTextMuted')} />
          </Section>

          {/* POLICE */}
          <Section title="✍️ Police">
            <div className="space-y-1.5">
              <span className="text-xs text-gray-600">Famille de police</span>
              <select
                value={theme.fontFamily}
                onChange={(e) => update('fontFamily')(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 italic" style={{ fontFamily: theme.fontFamily }}>
                Aperçu : BecomeUs — Coaching RH
              </p>
            </div>
          </Section>

          {/* TAILLES DE TEXTE */}
          <Section title="📏 Tailles de texte">
            <SliderRow label="Titre Hero" value={theme.heroSize} min={1.5} max={6} step={0.1} unit="rem" onChange={update('heroSize')} />
            <SliderRow label="Titres de section (H2)" value={theme.h2Size} min={1.2} max={4} step={0.1} unit="rem" onChange={update('h2Size')} />
            <SliderRow label="Texte courant" value={theme.bodySize} min={0.7} max={1.5} step={0.05} unit="rem" onChange={update('bodySize')} />
            <SliderRow label="Citation / tagline" value={theme.taglineSize} min={0.7} max={1.5} step={0.05} unit="rem" onChange={update('taglineSize')} />
          </Section>

          {/* ESPACEMENT & FORMES */}
          <Section title="📐 Espacement & Formes">
            <SliderRow label="Padding sections" value={theme.sectionPadding} min={2} max={12} step={0.5} unit="rem" onChange={update('sectionPadding')} />
            <SliderRow label="Espacement cartes" value={theme.gap} min={0.5} max={4} step={0.25} unit="rem" onChange={update('gap')} />
            <SliderRow label="Arrondi cartes" value={theme.cardRadius} min={0} max={3} step={0.1} unit="rem" onChange={update('cardRadius')} />
            <SliderRow label="Arrondi boutons" value={theme.buttonRadius} min={0} max={9999} step={1} unit="px" onChange={update('buttonRadius')} />
          </Section>

        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400 text-center">
            💾 Modifications sauvegardées automatiquement
          </p>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
