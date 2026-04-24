import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Déjà installée ?
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem('bu_install_dismissed')) return;

    // iOS (pas de beforeinstallprompt sur Safari)
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as any).standalone;
    if (ios) { setIsIOS(true); setShow(true); return; }

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('bu_install_dismissed', '1');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:bottom-6 md:w-96">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-start gap-3">
        {/* Icône app */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}>
          <Smartphone size={22} className="text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">Installer BecomeUs</p>
          {isIOS ? (
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Appuyez sur <strong>Partager</strong> <span className="text-base">⎙</span> puis <strong>"Sur l'écran d'accueil"</strong> pour installer l'app.
            </p>
          ) : (
            <>
              <p className="text-xs text-gray-500 mt-0.5">Accès rapide depuis votre écran d'accueil, fonctionne hors-ligne.</p>
              <button onClick={handleInstall}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}>
                <Download size={12} />Installer l'app
              </button>
            </>
          )}
        </div>

        <button onClick={handleDismiss} className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
