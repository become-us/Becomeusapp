import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
import { SettingsProvider } from '@/lib/settings';
import { EditModeProvider, useEditStore } from '@/lib/editStore';
import { Loader2, Pencil, X } from 'lucide-react';

import AuthPage from '@/pages/AuthPage';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import EquipePage from '@/pages/EquipePage';
import IntegrationsPage from '@/pages/IntegrationsPage';
import FormationsPage from '@/pages/FormationsPage';
import MeteoPage from '@/pages/MeteoPage';
import CustomPageView from '@/pages/CustomPageView';
import InstallBanner from '@/components/InstallBanner';
import AdminPanel from '@/components/AdminPanel';
import { StylePanel } from '@/components/StylePanel';

const ADMIN_EMAIL = 'cuisiniercelyne30@gmail.com';

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#F0F4FF,#F9F4FF)' }}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={32} className="animate-spin" style={{ color: '#7A90B5' }} />
        <p className="text-sm text-gray-400">Chargement…</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  return <Layout />;
}

function PublicRoute({ children }: React.PropsWithChildren) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/* Bouton flottant mode édition (admin seulement) */
function EditModeBtn() {
  const { user } = useAuth();
  const { editMode, toggleEditMode, resetAll } = useEditStore();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return (
    <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end gap-2">
      {editMode && (
        <button onClick={resetAll}
          className="text-xs px-3 py-1.5 rounded-full bg-red-50 text-red-400 border border-red-200 hover:bg-red-100 transition-all">
          Tout réinitialiser
        </button>
      )}
      <button onClick={toggleEditMode}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl text-sm font-bold text-white transition-all hover:scale-105 ${editMode ? 'ring-2 ring-offset-2 ring-[#7A90B5]' : ''}`}
        style={{ background: editMode ? 'linear-gradient(135deg,#C4956A,#E8A838)' : 'linear-gradient(135deg,#9B85C4,#7A90B5)' }}>
        {editMode ? <><X size={15} />Quitter l'édition</> : <><Pencil size={15} />Mode édition</>}
      </button>
    </div>
  );
}

function AdminGate() {
  const { user } = useAuth();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return (
    <>
      <AdminPanel />
      <StylePanel />
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="equipe" element={<EquipePage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="formations" element={<FormationsPage />} />
        <Route path="meteo" element={<MeteoPage />} />
        <Route path="page/:pageId" element={<CustomPageView />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <SettingsProvider>
          <EditModeProvider>
            <AppRoutes />
            <AdminGate />
            <EditModeBtn />
            <InstallBanner />
          </EditModeProvider>
        </SettingsProvider>
      </AuthProvider>
    </HashRouter>
  );
}
