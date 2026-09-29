import React, { useState } from 'react';
import {
  Calendar,
  QrCode,
  Trophy,
  Bell,
  Image,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Clipboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onExit: () => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { id: 'overview',      label: 'My Overview',        icon: Clipboard },
  { id: 'events',        label: 'Event Management',    icon: Calendar  },
  { id: 'checkin',       label: 'QR Gate Check-In',   icon: QrCode    },
  { id: 'results',       label: 'Results & Scoring',   icon: Trophy    },
  { id: 'announcements', label: 'Announcements',       icon: Bell      },
  { id: 'gallery',       label: 'Gallery Media',       icon: Image     },
];

export const CoordinatorLayout: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onExit,
  onLogout,
  children
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout ? onLogout() : onExit();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-festival-emerald to-teal-500 rounded-xl text-white shadow-lg shadow-emerald-500/25">
            <Clipboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-sm text-white">COLORIDO 2K26</h2>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Coordinator Portal
            </span>
          </div>
        </div>

        {/* Return to site */}
        <button
          onClick={onExit}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors border border-white/5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onSelectTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-festival-emerald to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User card */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          {user ? (
            <div className="flex items-center space-x-2 overflow-hidden min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 text-emerald-300 font-bold flex items-center justify-center text-xs shrink-0">
                {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-bold text-white text-xs truncate">{user.full_name}</p>
                <p className="text-[10px] text-emerald-400 capitalize">{user.role}</p>
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-400">Signed Out</span>
          )}
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row">

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B0D1B] border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-br from-festival-emerald to-teal-500 rounded-lg text-white">
            <Clipboard className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Coordinator Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-white/10 text-slate-300 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[#0B0D1B] border-r border-white/10 z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-[#0B0D1B] border-r border-white/10 shrink-0 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
