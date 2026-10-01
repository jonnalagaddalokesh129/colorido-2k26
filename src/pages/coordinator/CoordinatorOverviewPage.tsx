import React, { useState, useEffect } from 'react';
import {
  Clipboard,
  Calendar,
  QrCode,
  Trophy,
  Bell,
  Image,
  ShieldOff,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Clock,
  BarChart3,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../lib/store';

interface Props {
  onSelectTab: (tab: string) => void;
}

const PERMISSIONS = [
  {
    icon: Calendar,
    label: 'Event Management',
    tab: 'events',
    desc: 'View and manage event details, schedules and venue info for assigned events.',
    allowed: true,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/10 border-blue-500/30'
  },
  {
    icon: QrCode,
    label: 'QR Gate Check-In',
    tab: 'checkin',
    desc: 'Scan participant QR codes and verify entries at event gates.',
    allowed: true,
    color: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-500/10 border-violet-500/30'
  },
  {
    icon: Trophy,
    label: 'Results & Scoring',
    tab: 'results',
    desc: 'Enter and publish event results and winner details.',
    allowed: true,
    color: 'from-yellow-500 to-amber-500',
    bg: 'bg-yellow-500/10 border-yellow-500/30'
  },
  {
    icon: Bell,
    label: 'Announcements',
    tab: 'announcements',
    desc: 'Post and manage announcements for participants.',
    allowed: true,
    color: 'from-festival-emerald to-teal-500',
    bg: 'bg-emerald-500/10 border-emerald-500/30'
  },
  {
    icon: Image,
    label: 'Gallery Media',
    tab: 'gallery',
    desc: 'Upload and manage event photos and highlights.',
    allowed: true,
    color: 'from-pink-500 to-rose-500',
    bg: 'bg-pink-500/10 border-pink-500/30'
  },
  {
    icon: BarChart3,
    label: 'Analytics Dashboard',
    tab: '',
    desc: 'Overall registration, revenue and analytics — Admin only.',
    allowed: false,
    color: 'from-slate-500 to-slate-600',
    bg: 'bg-slate-800/60 border-slate-700/40'
  },
  {
    icon: Users,
    label: 'Participant Registry',
    tab: '',
    desc: 'Full participant data access and management — Admin only.',
    allowed: false,
    color: 'from-slate-500 to-slate-600',
    bg: 'bg-slate-800/60 border-slate-700/40'
  },
  {
    icon: ShieldOff,
    label: 'Sponsors & Inquiries',
    tab: '',
    desc: 'Sponsor tiers and contact inquiries inbox — Admin only.',
    allowed: false,
    color: 'from-slate-500 to-slate-600',
    bg: 'bg-slate-800/60 border-slate-700/40'
  },
  {
    icon: Award,
    label: 'Certificate Issuance & Winners',
    tab: '',
    desc: 'Assigning winners and publishing official certificates — Admin only.',
    allowed: false,
    color: 'from-slate-500 to-slate-600',
    bg: 'bg-slate-800/60 border-slate-700/40'
  },
];

export const CoordinatorOverviewPage: React.FC<Props> = ({ onSelectTab }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState(() => store.getEvents());
  const [checkins, setCheckins] = useState(() => store.getCheckins());
  const [results, setResults] = useState(() => store.getResults());
  const [announcements, setAnnouncements] = useState(() => store.getAnnouncements());

  useEffect(() => {
    const update = () => {
      setEvents(store.getEvents());
      setCheckins(store.getCheckins());
      setResults(store.getResults());
      setAnnouncements(store.getAnnouncements());
    };
    const unsub = store.subscribe(update);
    return () => unsub();
  }, []);

  const stats = [
    { label: 'Total Events',       value: events.length,        icon: Calendar, color: 'text-blue-400'   },
    { label: 'Check-ins Today',    value: checkins.length,      icon: QrCode,   color: 'text-violet-400' },
    { label: 'Results Published',  value: results.filter(r => r.is_published).length, icon: Trophy, color: 'text-yellow-400' },
    { label: 'Announcements',      value: announcements.length, icon: Bell,     color: 'text-emerald-400'},
  ];

  const allowedPerms = PERMISSIONS.filter(p => p.allowed);
  const deniedPerms  = PERMISSIONS.filter(p => !p.allowed);

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Sparkles className="w-4 h-4 text-festival-emerald" />
            <span className="text-xs font-bold text-festival-emerald uppercase tracking-widest">
              Coordinator Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            Welcome back, {user?.full_name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {user?.college} · {user?.department}
          </p>
        </div>

        <div className="flex items-center space-x-3 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-300 font-extrabold flex items-center justify-center text-sm">
            {user?.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-bold text-white">{user?.full_name}</p>
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mt-0.5">
              Coordinator
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-[#0D1117] border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
              <Icon className={`w-5 h-5 ${stat.color}`} />
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="text-[11px] text-slate-500 font-semibold">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Role description */}
      <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl shrink-0">
            <Clipboard className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white mb-1">Your Role: Event Coordinator</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              As a <span className="text-emerald-300 font-semibold">Coordinator</span>, you are responsible for the on-ground
              management of festival events. You have access to operational tools — managing event details,
              verifying participant entries at gates, recording results, posting announcements, and uploading gallery media.
              Administrative functions (analytics, participant registry, sponsors, finances) are reserved for Admin.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs text-slate-500">Session active · COLORIDO 2K26</span>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions grid */}
      <div>
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Your Access Permissions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allowedPerms.map(perm => {
            const Icon = perm.icon;
            return (
              <button
                key={perm.label}
                onClick={() => perm.tab && onSelectTab(perm.tab)}
                className={`group text-left p-4 rounded-2xl border transition-all hover:scale-[1.02] ${perm.bg}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${perm.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Allowed</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-white mb-1">{perm.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{perm.desc}</p>
                {perm.tab && (
                  <div className="flex items-center space-x-1 mt-3 text-xs font-semibold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Open</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Restricted permissions */}
      <div>
        <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-4">Restricted (Admin Only)</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {deniedPerms.map(perm => {
            const Icon = perm.icon;
            return (
              <div key={perm.label} className={`p-4 rounded-2xl border ${perm.bg} opacity-50`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-700">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4 text-slate-600" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">Restricted</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-500 mb-1">{perm.label}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{perm.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
