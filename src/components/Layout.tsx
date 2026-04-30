import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { assetUrl } from '@/lib/assetUrl';
import {
  LayoutDashboard, Users, Rocket, BookOpen, CloudSun,
  FileText, Star, Heart, Zap, Target, Award, LogOut, ChevronRight, CalendarDays,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Users, Rocket, BookOpen, CloudSun,
  FileText, Star, Heart, Zap, Target, Award, CalendarDays,
};

const ADMIN_EMAIL = 'cuisiniercelyne30@gmail.com';

export default function Layout() {
  const { user, signOut } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const isAdmin = user?.email === ADMIN_EMAIL;
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'ME';

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const logoSrc = settings.logoBase64 || assetUrl('images/becomeus_logo.png');
  const visibleNav = settings.navItems.filter(n => n.visible);

  return (
    <div className="min-h-screen flex bg-[#F4F6FB]">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20 shadow-sm">

        {/* Logo */}
        <div className="px-5 py-4 border-b border-gray-100">
          <img src={logoSrc} alt={settings.appName}
            className="h-9 w-auto object-contain max-w-full"
            onError={e => { (e.target as HTMLImageElement).src = assetUrl('images/becomeus_logo.png'); }} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {visibleNav.map(({ id, to, icon, label, color }) => {
            const Icon = ICON_MAP[icon] || FileText;
            return (
              <NavLink key={id} to={to} end={to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive ? 'bg-[#EDF2FB] text-[#7A90B5]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }>
                {({ isActive }) => (
                  <>
                    <Icon size={17} style={{ color: isActive ? color : '#9CA3AF' }} className="flex-shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                    {isActive && <ChevronRight size={13} className="flex-shrink-0" style={{ color }} />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg,${settings.primaryColor},${settings.lavenderColor})` }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </p>
              {isAdmin && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#EDF2FB', color: '#7A90B5' }}>
                  Admin ⚙️
                </span>
              )}
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={handleSignOut} title="Déconnexion"
              className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
