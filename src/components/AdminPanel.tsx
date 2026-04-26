import React, { useState, useRef } from 'react';
import { useSettings, NavItem, DEFAULT_SETTINGS } from '@/lib/settings';
import { assetUrl } from '@/lib/assetUrl';
import {
  Settings2, X, Check, Loader2, ChevronUp, ChevronDown,
  Eye, EyeOff, Trash2, Plus, RotateCcw, ImageIcon,
  Palette, Navigation, FileText
} from 'lucide-react';

type Tab = 'apparence' | 'navigation' | 'pages';

export default function AdminPanel() {
  const { settings, updateSettings, saveSettings, saving, resetSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('apparence');
  const [savedOk, setSavedOk] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    await saveSettings();
    setSavedOk(true);
    setTimeout(() => setSavedOk(false), 2500);
  };

  // Logo upload → base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSettings({ logoBase64: reader.result as string });
    reader.readAsDataURL(file);
  };

  // Nav helpers
  const updateNav = (id: string, patch: Partial<NavItem>) =>
    updateSettings({ navItems: settings.navItems.map(n => n.id === id ? { ...n, ...patch } : n) });

  const moveNav = (id: string, dir: 'up' | 'down') => {
    const items = [...settings.navItems];
    const i = items.findIndex(n => n.id === id);
    if (dir === 'up' && i > 0) [items[i - 1], items[i]] = [items[i], items[i - 1]];
    else if (dir === 'down' && i < items.length - 1) [items[i], items[i + 1]] = [items[i + 1], items[i]];
    updateSettings({ navItems: items });
  };

  const deleteNav = (id: string) =>
    updateSettings({ navItems: settings.navItems.filter(n => n.id !== id) });

  const addCustomPage = () => {
    const id = `custom_${Date.now()}`;
    const item: NavItem = {
      id, label: 'Nouvelle page', to: `/page/${id}`,
      icon: 'FileText', color: settings.primaryColor, visible: true, isCustom: true,
    };
    updateSettings({ navItems: [...settings.navItems, item] });
  };

  const logoSrc = settings.logoBase64 || assetUrl('images/becomeus_logo.png');
  const customPages = settings.navItems.filter(n => n.isCustom);

  const TABS: { id: Tab; Icon: React.ElementType; label: string }[] = [
    { id: 'apparence', Icon: Palette, label: 'Apparence' },
    { id: 'navigation', Icon: Navigation, label: 'Navigation' },
    { id: 'pages', Icon: FileText, label: 'Pages' },
  ];

  const COLORS: { key: keyof typeof settings; label: string; desc: string }[] = [
    { key: 'primaryColor', label: 'Principale', desc: 'Sidebar, accents' },
    { key: 'accentColor', label: 'Accent', desc: 'Intégrations' },
    { key: 'lavenderColor', label: 'Lavande', desc: 'Formations' },
    { key: 'greenColor', label: 'Vert', desc: 'Météo' },
  ];

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}
        title="Personnaliser l'application">
        <Settings2 size={20} />
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-[400px] bg-white shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Settings2 size={18} style={{ color: '#7A90B5' }} />
            <h2 className="font-bold text-gray-800">Personnalisation</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity min-w-[120px] justify-center"
              style={{ background: savedOk ? 'linear-gradient(135deg,#6BB5A0,#7A90B5)' : 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}>
              {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              {saving ? 'Sauvegarde…' : savedOk ? '✓ Sauvegardé !' : 'Sauvegarder'}
            </button>
            <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {TABS.map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all border-b-2 ${
                tab === id ? 'border-[#7A90B5] text-[#7A90B5] bg-[#EDF2FB]/40' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-7">

          {/* ═══ APPARENCE ═══ */}
          {tab === 'apparence' && (<>

            {/* Logo */}
            <section>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Logo</p>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                  <img src={logoSrc} alt="Logo" className="max-w-full max-h-full object-contain p-1" />
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed text-xs font-medium transition-colors hover:bg-[#EDF2FB]"
                    style={{ borderColor: '#7A90B5', color: '#7A90B5' }}>
                    <ImageIcon size={13} />Changer le logo
                  </button>
                  {settings.logoBase64 && (
                    <button onClick={() => updateSettings({ logoBase64: '' })}
                      className="text-xs text-gray-400 hover:text-red-400 text-left transition-colors">
                      ↩ Revenir au logo original
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>
            </section>

            {/* Infos app */}
            <section>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Informations</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Nom de l'application</label>
                  <input value={settings.appName}
                    onChange={e => updateSettings({ appName: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A90B5]/30 focus:border-[#7A90B5]" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Tagline</label>
                  <textarea value={settings.tagline}
                    onChange={e => updateSettings({ tagline: e.target.value })}
                    rows={2} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none resize-none" />
                </div>
              </div>
            </section>

            {/* Couleurs */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Couleurs</p>
                <button onClick={() => updateSettings({
                  primaryColor: DEFAULT_SETTINGS.primaryColor,
                  accentColor: DEFAULT_SETTINGS.accentColor,
                  lavenderColor: DEFAULT_SETTINGS.lavenderColor,
                  greenColor: DEFAULT_SETTINGS.greenColor,
                })} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors">
                  <RotateCcw size={11} />Réinitialiser
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {COLORS.map(({ key, label, desc }) => (
                  <label key={key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer bg-white shadow-sm transition-all hover:shadow-md">
                    <div className="relative w-9 h-9 rounded-xl flex-shrink-0 shadow-sm" style={{ background: settings[key] as string }}>
                      <input type="color" value={settings[key] as string}
                        onChange={e => updateSettings({ [key]: e.target.value } as Partial<typeof settings>)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

          </>)}

          {/* ═══ NAVIGATION ═══ */}
          {tab === 'navigation' && (<>
            <section>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Onglets de navigation</p>
              <p className="text-xs text-gray-400 mb-4">Renommez, réordonnez, masquez ou ajoutez des onglets.</p>
              <div className="space-y-2">
                {settings.navItems.map((item, idx) => (
                  <div key={item.id}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
                      item.visible ? 'bg-white border-gray-100 shadow-sm' : 'bg-gray-50 border-dashed border-gray-200 opacity-60'
                    }`}>
                    {/* Color picker dot */}
                    <label className="relative cursor-pointer flex-shrink-0" title="Changer la couleur">
                      <div className="w-5 h-5 rounded-full border-2 border-white shadow"
                        style={{ background: item.color }} />
                      <input type="color" value={item.color}
                        onChange={e => updateNav(item.id, { color: e.target.value })}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    </label>

                    {/* Editable label */}
                    <input value={item.label}
                      onChange={e => updateNav(item.id, { label: e.target.value })}
                      className="flex-1 text-sm font-medium text-gray-700 bg-transparent border-none outline-none focus:bg-blue-50 px-1.5 py-0.5 rounded-lg transition-colors min-w-0" />

                    {/* Controls */}
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button onClick={() => moveNav(item.id, 'up')} disabled={idx === 0}
                        className="p-1 rounded text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors">
                        <ChevronUp size={13} />
                      </button>
                      <button onClick={() => moveNav(item.id, 'down')} disabled={idx === settings.navItems.length - 1}
                        className="p-1 rounded text-gray-300 hover:text-gray-500 disabled:opacity-20 transition-colors">
                        <ChevronDown size={13} />
                      </button>
                      <button onClick={() => updateNav(item.id, { visible: !item.visible })}
                        className={`p-1 rounded transition-colors ${item.visible ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300 hover:text-gray-400'}`}>
                        {item.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      {item.isCustom && (
                        <button onClick={() => deleteNav(item.id)}
                          className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addCustomPage}
                className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-medium text-gray-400 hover:border-[#7A90B5] hover:text-[#7A90B5] hover:bg-[#EDF2FB]/30 transition-all">
                <Plus size={15} />Ajouter un onglet personnalisé
              </button>
            </section>
          </>)}

          {/* ═══ PAGES ═══ */}
          {tab === 'pages' && (
            <section>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pages personnalisées</p>
              <p className="text-xs text-gray-400 mb-4">Créez des pages libres pour vos notes, ressources ou informations.</p>
              {customPages.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <FileText size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">Aucune page créée</p>
                  <p className="text-xs mt-1 mb-4">Allez dans "Navigation" pour en ajouter</p>
                  <button onClick={() => setTab('navigation')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}>
                    Créer un onglet →
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {customPages.map(page => (
                    <div key={page.id} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: page.color }} />
                        <p className="font-semibold text-sm text-gray-800">{page.label}</p>
                        {!page.visible && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">Masquée</span>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        ✏️ Cliquez sur l'onglet dans la sidebar pour modifier le contenu
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50/50">
          <button onClick={resetSettings}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors">
            <RotateCcw size={11} />Tout réinitialiser
          </button>
          <p className="text-xs text-gray-400">Sauvegardé dans Supabase ☁️</p>
        </div>
      </div>
    </>
  );
}
