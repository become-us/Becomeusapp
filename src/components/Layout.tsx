import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Users, Rocket, BookOpen, CloudSun, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', exact: true },
  { to: '/equipe', icon: Users, label: 'Mon équipe', color: '#7A90B5' },
  { to: '/integrations', icon: Rocket, label: 'Mes intégrations', color: '#C4956A' },
  { to: '/formations', icon: BookOpen, label: 'Mes formations', color: '#9B85C4' },
  { to: '/meteo', icon: CloudSun, label: "Météo d'équipe", color: '#6BB5A0' },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? 'ME';

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <div className="min-h-screen flex bg-[#F4F6FB]">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20 shadow-sm">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <img src="/images/becomeus_logo.png" alt="BecomeUs" className="h-9 w-auto object-contain" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label, color }) => (
            <NavLink key={to} to={to} end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#EDF2FB] text-[#7A90B5]'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon size={18} style={{ color: isActive ? color || '#7A90B5' : '#9CA3AF' }} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} className="text-[#7A90B5]" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#7A90B5,#9B85C4)' }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700 truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={handleSignOut} title="Déconnexion"
              className="text-gray-400 hover:text-red-400 transition-colors">
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
