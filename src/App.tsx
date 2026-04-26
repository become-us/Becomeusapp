import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
import { SettingsProvider } from '@/lib/settings';
import { Loader2 } from 'lucide-react';

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

function AdminGate() {
  const { user } = useAuth();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return <AdminPanel />;
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
          <AppRoutes />
          <AdminGate />
          <InstallBanner />
        </SettingsProvider>
      </AuthProvider>
    </HashRouter>
  );
}
