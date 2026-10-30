import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
  ArrowLeft,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../services/api.ts';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateHome,
  children,
}) => {
  const { user, logout } = useAuth();

  const handleResetData = async () => {
    if (window.confirm('Reset all fleet and booking data to clean default demo state?')) {
      await api.resetDatabaseSeed();
      window.location.reload();
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Overview & KPIs', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Fleet Management', icon: Car },
    { id: 'bookings', label: 'Bookings & Returns', icon: CalendarCheck },
    { id: 'customers', label: 'Customer Directory', icon: Users },
    { id: 'payments', label: 'Transactions & Refunds', icon: CreditCard },
    { id: 'reports', label: 'Reports & CSV Export', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-950 text-white shrink-0 flex flex-col justify-between border-r border-slate-900">
        <div>
          {/* Top Brand */}
          <div className="p-6 border-b border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                A
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  VELOCITA ADMIN
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                  Enterprise v2.4
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-900 space-y-2 text-xs">
          <button
            onClick={handleResetData}
            title="Reset system to default sample data"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Fleet Data</span>
          </button>

          <button
            onClick={onNavigateHome}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Website</span>
          </button>

          <div className="pt-2 border-t border-slate-900 flex items-center justify-between px-1">
            <div className="truncate">
              <p className="text-[11px] font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
};
