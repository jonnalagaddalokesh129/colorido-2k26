import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Calendar, 
  Users, 
  QrCode, 
  Trophy, 
  Bell, 
  Image, 
  HeartHandshake, 
  Mail, 
  ArrowLeft, 
  Settings,
  Sliders,
  LogOut,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  onLogout,
  children
}) => {
  const { user, logout, isAdmin } = useAuth();

  const allNavItems = [
    { id: 'dashboard',     label: 'Analytics Dashboard',  icon: BarChart3,     adminOnly: true  },
    { id: 'events',        label: 'Event Management',      icon: Calendar,      adminOnly: false },
    { id: 'participants',  label: 'Participant Registry',  icon: Users,         adminOnly: true  },
    { id: 'coordinators',  label: 'Coordinators',          icon: ShieldCheck,   adminOnly: true  },
    { id: 'checkin',       label: 'QR Gate Check-In',      icon: QrCode,        adminOnly: false },
    { id: 'results',       label: 'Results & Scoring',     icon: Trophy,        adminOnly: false },
    { id: 'certificates',  label: 'Certificates',          icon: Award,         adminOnly: true  },
    { id: 'announcements', label: 'Announcements',         icon: Bell,          adminOnly: false },
    { id: 'gallery',       label: 'Gallery Media',         icon: Image,         adminOnly: false },
    { id: 'sponsors',      label: 'Sponsors & Tiers',      icon: HeartHandshake,adminOnly: true  },
    { id: 'messages',      label: 'Inquiries Inbox',       icon: Mail,          adminOnly: true  },
  ];

  // Coordinators get limited access; admins see everything
  const navItems = isAdmin ? allNavItems : allNavItems.filter(item => !item.adminOnly);

  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0B0D1B] border-r border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand & Admin Badge */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/25">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base text-white">COLORIDO 2K26</h2>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                Administration Portal
              </span>
            </div>
          </div>

          {/* Quick Exit to Main Festival Site */}
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors border border-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Signout */}
        <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
          {user ? (
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="truncate text-xs">
                <p className="font-bold text-white truncate">{user.full_name}</p>
                <p className="text-[10px] text-indigo-400 capitalize">{user.role} Panel</p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 font-semibold">
              Signed Out
            </div>
          )}

          <button
            onClick={() => {
              logout();
              onLogout ? onLogout() : onExitAdmin();
            }}
            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-white/5"
            title="Sign out of session"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
